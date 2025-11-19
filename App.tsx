import React, { useState, useMemo } from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from './components/ui/sidebar';
import { Landmark, FilePlus2, FileText, AiIcon, LayoutList } from './components/icons';
import StepIndicator from './components/StepIndicator';
import Form1003 from './components/Form1003';
import RequirementsChecklist from './components/Checklist';
import BellaChatWidget from './components/ChatWidget';
import DocumentList from './components/DocumentList';
import { FormData, LoanPurpose } from './types';
import { generateLoanSummary } from './services/geminiService';
import { motion, AnimatePresence } from "framer-motion";
import { appFlow, AppStep } from './appFlow';

const LogoSection = () => {
  const { open, animate } = useSidebar();
  return (
    <div className="mb-6 pt-4 flex flex-col items-center">
      <motion.div
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "flex" : "none") : "flex",
        }}
        className="flex flex-col items-center gap-2"
      >
        <img 
          src="/TeraTrans.png" 
          alt="TERAVERDE Logo" 
          className="w-auto h-auto max-w-[140px] object-contain"
          style={{ maxHeight: '80px' }}
        />
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-xs font-medium text-muted-foreground text-center whitespace-nowrap"
          style={{ color: '#6b7280' }}
        >
          Business Process Solutions
        </motion.span>
      </motion.div>
    </div>
  );
};

type View = 'prep' | 'form1003' | 'documents';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    loanPurpose: '',
    propertyType: '',
    propertyUse: '',
    purchasePrice: 0,
    downPayment: 0,
    loanAmount: 0,
    creditScore: '',
    location: '',
    isFirstTimeBuyer: null,
    isMilitary: null,
    fullName: '',
    email: '',
    phoneNumber: '',
    income: undefined,
    borrowerAddress: undefined,
    dob: undefined,
    estimatedPropertyValue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState('');
  const [currentView, setCurrentView] = useState<View>('prep');
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const filteredFlow = useMemo(() => {
    return appFlow.filter(flowStep =>
      flowStep.path === 'all' || flowStep.path === formData.loanPurpose
    );
  }, [formData.loanPurpose]);

  const resetApplication = () => {
    setStep(0);
    setCurrentView('prep');
    // Optionally reset form data here if desired
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, filteredFlow.length - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updatedData = { ...prev, ...newData };

      if (
        updatedData.loanPurpose === 'Purchase a Home' &&
        (newData.purchasePrice !== undefined || newData.downPayment !== undefined)
      ) {
        if (updatedData.purchasePrice > 0 && updatedData.downPayment >= 0) {
          updatedData.loanAmount = Math.max(0, updatedData.purchasePrice - updatedData.downPayment);
        }
      }
      
      return updatedData;
    });
  };
  
  const handleSelectionAndNext = (field: keyof FormData, value: any) => {
    handleDataChange({ [field]: value });
    if (field !== 'loanPurpose') {
        setTimeout(nextStep, 200);
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const summary = await generateLoanSummary(formData);
      setSubmissionResult(summary);
      nextStep();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionResult("We've received your application and will be in touch shortly with a personalized summary.");
      nextStep();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProceedToApplication = () => {
      setCurrentView('form1003');
  }

  const renderPrepFlow = () => {
    const CurrentStepComponent = filteredFlow[step]?.component;
    if (!CurrentStepComponent) return null; // Or return a default welcome/error component

    const commonProps = {
      data: formData,
      onNext: nextStep,
      onBack: prevStep,
      onChange: handleDataChange,
    };
    
    // Customize props based on component needs
    const stepProps: { [key: string]: any } = {
        StepWelcome: { onNext: nextStep },
        StepLoanPurpose: { data: formData, onChange: (f: string, v: any) => handleDataChange({[f]:v}), onNext: nextStep },
        StepPropertyType: { data: formData, onChange: handleSelectionAndNext },
        StepPropertyUse: { data: formData, onChange: handleSelectionAndNext },
        StepPricing: { ...commonProps },
        StepRefinanceDetails: { ...commonProps },
        StepCreditScore: { data: formData, onChange: (f: string, v: any) => handleDataChange({[f]:v}), onNext: nextStep, onBack: prevStep },
        StepBorrowAmount: { ...commonProps },
        StepLocation: { ...commonProps, onChange: (f: string, v: any) => handleDataChange({[f]:v}) },
        StepFirstTimeBuyer: { data: formData, onChange: handleSelectionAndNext },
        StepMilitary: { data: formData, onChange: handleSelectionAndNext },
        StepPrepDocs: { onDataChange: handleDataChange, onNext: nextStep, onBack: prevStep },
        StepName: { ...commonProps, onChange: (f: string, v: any) => handleDataChange({[f]:v}) },
        StepContact: { ...commonProps, onChange: (f: string, v: any) => handleDataChange({[f]:v}), onNext: handleSubmit },
        StepConfirmation: { isLoading: isLoading, result: submissionResult, onProceed: handleProceedToApplication },
    };
    
    return <CurrentStepComponent {...stepProps[CurrentStepComponent.name]} />;
  };
  
  const indicatorSteps = useMemo(() => {
      const labels: string[] = [];
      const indices: number[] = [];
      filteredFlow.forEach((s, i) => {
          if (s.indicatorLabel) {
              labels.push(s.indicatorLabel);
              indices.push(i);
          }
      });
      return { labels, indices };
  }, [filteredFlow]);

  const currentIndicatorIndex = indicatorSteps.indices.filter(index => index <= step).length - 1;

  const showStepIndicator = step > 0 && step < filteredFlow.length - 1 && currentView === 'prep';

  const links = [
    { label: "Prep4Loan", action: resetApplication, icon: <FilePlus2 className="h-6 w-6 flex-shrink-0" style={{ color: '#000000' }} /> },
    { label: "Loan Application", action: () => setCurrentView('form1003'), icon: <FileText className="h-6 w-6 flex-shrink-0" style={{ color: '#000000' }} /> },
    { label: "Document List", action: () => setCurrentView('documents'), icon: <LayoutList className="h-6 w-6 flex-shrink-0" style={{ color: '#000000' }} /> },
    { label: "My Loans", action: () => {}, icon: <Landmark className="h-6 w-6 flex-shrink-0" style={{ color: '#000000' }} /> },
  ];

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-white border-r border-border" style={{ backgroundColor: '#ffffff', color: '#000000', opacity: 1 }}>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" style={{ color: '#000000' }}>
            {/* Logo */}
            <LogoSection />
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => ( 
                <button key={idx} onClick={link.action} className="w-full" style={{ color: '#000000' }}>
                  <SidebarLink link={{...link, href: "#"}} className="w-full" />
                </button> 
              ))}
            </div>
          </div>
          <div style={{ color: '#000000' }}>
            <SidebarLink link={{ label: "Jane Doe", href: "#", icon: ( <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JaneDoe&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf" className="h-7 w-7 flex-shrink-0 rounded-full" width={50} height={50} alt="Avatar"/> )}} />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 h-full overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
            {currentView === 'form1003' ? (
                <Form1003 initialData={formData} />
            ) : currentView === 'documents' ? (
                <DocumentList formData={formData} />
            ) : (
                <div className="w-full max-w-[1088px] mx-auto grid grid-cols-1 md:grid-cols-3 md:gap-12 lg:gap-16 items-start">
                    <div className="hidden md:block md:col-span-1 pt-24">
                        <RequirementsChecklist loanPurpose={formData.loanPurpose} formData={formData} />
                    </div>
                    <div className="w-full md:col-span-2">
                        {showStepIndicator && (
                        <div className="mb-8 mt-8">
                            <StepIndicator 
                                labels={indicatorSteps.labels} 
                                currentStepIndex={currentIndicatorIndex}
                                onStepClick={(stepIndex) => setStep(stepIndex)}
                                stepIndices={indicatorSteps.indices}
                            />
                        </div>
                        )}
                        <div className="bg-card rounded-2xl border border-border transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
                            <div className="p-8 sm:p-12 min-h-[550px] flex flex-col justify-between">
                                <div key={step} className="animate-fade-in w-full flex-1 flex flex-col justify-center">
                                    {renderPrepFlow()}
                                </div>
                                {/* Navigation Buttons */}
                                {step > 0 && step < filteredFlow.length - 1 && (
                                    <div className="mt-8 pt-6 border-t border-border/50">
                                        <div className="flex items-center justify-between gap-4">
                                            <button
                                                onClick={prevStep}
                                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-white hover:bg-muted/50 text-foreground font-medium transition-all duration-200 active:scale-95 min-w-[120px]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Back
                                            </button>
                                            <button
                                                onClick={nextStep}
                                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md min-w-[120px]"
                                            >
                                                Next
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
      
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsChatOpen(false)} />
      )}

      <AnimatePresence>
      {isChatOpen ? (
        <BellaChatWidget
          onClose={() => setIsChatOpen(false)}
          onDataExtracted={handleDataChange}
          formData={formData}
        />
      ) : (
        <motion.button
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 50 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 h-16 w-16 rounded-full bg-white/50 backdrop-blur-sm shadow-lg border border-border flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open Bella AI Assistant"
        >
          <AiIcon className="w-8 h-8 text-foreground" />
        </motion.button>
      )}
      </AnimatePresence>
    </>
  );
};

export default App;