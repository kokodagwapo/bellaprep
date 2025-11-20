import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from './components/ui/sidebar';
import { Landmark, FilePlus2, FileText, AiIcon, LayoutList, Home } from './components/icons';
import StepIndicator from './components/StepIndicator';
import Form1003 from './components/Form1003';
import RequirementsChecklist from './components/Checklist';
import BellaChatWidget from './components/ChatWidget';
import DocumentList from './components/DocumentList';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import { FormData, LoanPurpose } from './types';
import { generateLoanSummary } from './services/geminiService';
import { motion, AnimatePresence } from "framer-motion";
import { appFlow, AppStep } from './appFlow';

const LogoSection = () => {
  const { open, animate } = useSidebar();
  return (
    <div className="mb-4 sm:mb-6 pt-3 sm:pt-4 flex flex-col items-center">
      <motion.div
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          display: animate ? (open ? "flex" : "none") : "flex",
        }}
        className="flex flex-col items-center gap-2"
      >
        <img 
          src={`${import.meta.env.BASE_URL}TeraTrans.png`}
          alt="TERAVERDE Logo" 
          className="w-auto h-auto max-w-[120px] sm:max-w-[140px] object-contain"
          style={{ maxHeight: '60px', width: 'auto', height: 'auto' }}
          onError={(e) => {
            console.error('Logo failed to load');
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center whitespace-nowrap"
          style={{ color: '#6b7280' }}
        >
          Business Process Solutions
        </motion.span>
      </motion.div>
    </div>
  );
};

type View = 'home' | 'prep' | 'form1003' | 'documents';

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
  const [currentView, setCurrentView] = useState<View>('home');
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when view changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Scroll to top when step changes in prep flow
  useEffect(() => {
    if (currentView === 'prep' && mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, currentView]);

  // Scroll to top on initial mount
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

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
    { label: "Home", action: () => setCurrentView('home'), icon: <Home className="h-6 w-6 flex-shrink-0" /> },
    { label: "Prep4Loan", action: resetApplication, icon: <FilePlus2 className="h-6 w-6 flex-shrink-0" /> },
    { label: "Home Journey", action: () => setCurrentView('form1003'), icon: <FileText className="h-6 w-6 flex-shrink-0" /> },
    { label: "Document List", action: () => setCurrentView('documents'), icon: <LayoutList className="h-6 w-6 flex-shrink-0" /> },
    { label: "My Loan", action: () => {}, icon: <Landmark className="h-6 w-6 flex-shrink-0" /> },
  ];

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-white border-r border-border" style={{ backgroundColor: '#ffffff', background: '#ffffff', color: '#000000', opacity: 1, backdropFilter: 'none', WebkitBackdropFilter: 'none', filter: 'none', WebkitFilter: 'none' }}>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" style={{ color: '#000000', backgroundColor: '#ffffff' }}>
            {/* Logo */}
            <LogoSection />
            <div className="flex flex-col gap-1 md:gap-2">
              {links.map((link, idx) => ( 
                <button 
                  key={idx} 
                  onClick={() => {
                    link.action();
                    if (window.innerWidth < 768) {
                      // Close mobile sidebar after clicking
                      setOpen(false);
                    }
                  }} 
                  className="w-full text-left touch-manipulation"
                  style={{ color: '#000000' }}
                >
                  <SidebarLink link={{...link, href: "#"}} className="w-full" />
                </button> 
              ))}
            </div>
          </div>
          <div style={{ color: '#000000' }}>
            <SidebarLink link={{ label: "Jane Doe", href: "#", icon: ( <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">JD</div> )}} />
          </div>
        </SidebarBody>
      </Sidebar>
      <main ref={mainContentRef} className="flex-1 h-full overflow-y-auto custom-scrollbar relative" style={{ backgroundColor: 'transparent', zIndex: 1 }}>
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 relative z-10">
            {currentView === 'home' ? (
                <LandingPage 
                  onNavigateToPrep={resetApplication}
                  onNavigateToForm1003={() => setCurrentView('form1003')}
                />
            ) : currentView === 'form1003' ? (
                <Form1003 initialData={formData} />
            ) : currentView === 'documents' ? (
                <DocumentList formData={formData} />
            ) : (
                <div className="w-full max-w-[1088px] mx-auto">
                    {/* Step Indicator at the top */}
                    {showStepIndicator && (
                        <div className="mb-2 sm:mb-6 md:mb-8 mt-1 sm:mt-4 md:mt-6">
                            <StepIndicator 
                                labels={indicatorSteps.labels} 
                                currentStepIndex={currentIndicatorIndex}
                                onStepClick={(stepIndex: number) => {
                                    // Validate step index is within bounds
                                    if (stepIndex >= 0 && stepIndex < filteredFlow.length) {
                                        setStep(stepIndex);
                                    }
                                }}
                                stepIndices={indicatorSteps.indices}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 xl:gap-16 items-start">
                        <div className="hidden lg:block lg:col-span-1 pt-6 lg:pt-12">
                            <RequirementsChecklist loanPurpose={formData.loanPurpose} formData={formData} />
                        </div>
                        <div className="w-full lg:col-span-2">
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border/60 transition-all duration-300 overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-2xl relative" style={{ zIndex: 10 }}>
                            <div className="p-4 sm:p-6 md:p-8 lg:p-12 min-h-[400px] sm:min-h-[500px] md:min-h-[550px] flex flex-col justify-between bg-white relative" style={{ zIndex: 10, pointerEvents: 'auto' }}>
                                <div key={step} className="animate-fade-in w-full flex-1 flex flex-col justify-center relative" style={{ zIndex: 10, pointerEvents: 'auto' }}>
                                    {renderPrepFlow()}
                                </div>
                                {/* Navigation Buttons */}
                                {step > 0 && step < filteredFlow.length - 1 && (
                                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
                                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                                            <button
                                                onClick={prevStep}
                                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3 rounded-xl sm:rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto sm:min-w-[120px] text-base sm:text-base touch-manipulation min-h-[48px] sm:min-h-[44px]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Back
                                            </button>
                                            <button
                                                onClick={nextStep}
                                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3 rounded-xl sm:rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md w-full sm:w-auto sm:min-w-[120px] text-base sm:text-base touch-manipulation min-h-[48px] sm:min-h-[44px]"
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
                </div>
            )}
        </div>
        <Footer />
      </main>
      
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-40 hidden sm:block touch-none" 
          onClick={() => setIsChatOpen(false)}
        />
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
          className="fixed bottom-6 right-6 z-30 h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:scale-110 active:scale-95 transition-transform touch-manipulation"
          style={{ minHeight: '64px', minWidth: '64px' }}
          aria-label="Open Bella AI Assistant"
        >
          <AiIcon className="w-8 h-8 sm:w-7 sm:h-7 text-foreground" />
        </motion.button>
      )}
      </AnimatePresence>
    </>
  );
};

export default App;