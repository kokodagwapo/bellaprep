import React, { useState, useMemo, useEffect } from 'react';
import type { FormData } from '../types';
import { LoanPurpose } from '../types';
import ProgressBar from './ProgressBar';
import StepIndicator from './StepIndicator';
import Form1003Checklist from './Form1003Checklist';
import Form1003Welcome from './Form1003/Form1003Welcome';
import { form1003Flow } from './Form1003/form1003Flow';

interface Form1003Props {
  initialData: FormData;
}

const Form1003: React.FC<Form1003Props> = ({ initialData }) => {
  const [step, setStep] = useState(-1); // Start at -1 to show welcome page
  const [formData, setFormData] = useState<FormData>(initialData);
  const totalSteps = form1003Flow.length;
  const showWelcome = step === -1;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, -1));
  
  const handleDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Backward compatibility: Map Prep4Loan data to Form1003 format on mount
  useEffect(() => {
    const mappedData: Partial<FormData> = {};
    
    // Map subjectProperty to purchasePrice/estimatedPropertyValue
    if (initialData.subjectProperty?.value) {
      if (initialData.loanPurpose === LoanPurpose.PURCHASE && !initialData.purchasePrice) {
        mappedData.purchasePrice = initialData.subjectProperty.value;
      } else if (initialData.loanPurpose !== LoanPurpose.PURCHASE && !initialData.estimatedPropertyValue) {
        mappedData.estimatedPropertyValue = initialData.subjectProperty.value;
      }
    }
    
    // Map subjectProperty address to location
    if (initialData.subjectProperty?.address && !initialData.location) {
      const addr = initialData.subjectProperty.address;
      if (addr.city && addr.state) {
        mappedData.location = `${addr.city}, ${addr.state}`;
      }
    }
    
    // Map currentAddress to borrowerAddress if needed
    if (initialData.currentAddress && !initialData.borrowerAddress) {
      const addr = initialData.currentAddress;
      mappedData.borrowerAddress = `${addr.street || ''}${addr.unit ? `, ${addr.unit}` : ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim();
    }
    
    // Apply mapped data if any
    if (Object.keys(mappedData).length > 0) {
      setFormData(prev => ({ ...prev, ...mappedData }));
    }
  }, []); // Only run on mount

  const handleWelcomeNext = () => {
    setStep(0); // Move to first form step
  };

  // Create indicator steps for StepIndicator (similar to prep4loan)
  const indicatorSteps = useMemo(() => {
    const labels: string[] = [];
    const indices: number[] = [];
    
    // Use labels from flow definition
    form1003Flow.forEach((flowStep, i) => {
      const label = (flowStep as any).label;
      if (label) {
        labels.push(label);
        indices.push(i);
      }
    });
    
    return { labels, indices };
  }, []);

  const currentIndicatorIndex = indicatorSteps.indices.filter(index => index <= step).length - 1;
  const showStepIndicator = step >= 0 && step < form1003Flow.length - 1;

  const renderStep = () => {
    if (showWelcome) {
      return <Form1003Welcome onNext={handleWelcomeNext} />;
    }

    const CurrentStepComponent = form1003Flow[step].component;
    if (!CurrentStepComponent) return null;

    const props: any = {
      data: formData,
      onDataChange: handleDataChange,
    };

    // Always provide onNext and onBack for consistent navigation
    if (step < totalSteps - 1) {
      props.onNext = nextStep;
    }
    // Provide onBack for all steps except the first one (step 0)
    if (step > 0) {
      props.onBack = prevStep;
    }

    return <CurrentStepComponent {...props} />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in mt-3 sm:mt-4 md:mt-5 mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4">
        {!showWelcome && (
          <>
            {showStepIndicator && (
              <div className="mb-2 sm:mb-4 md:mb-5 mt-1 sm:mt-2 md:mt-3 px-2 sm:px-4">
                <StepIndicator 
                  labels={indicatorSteps.labels} 
                  currentStepIndex={currentIndicatorIndex >= 0 ? currentIndicatorIndex : 0}
                  onStepClick={(stepIndex: number) => {
                    // Validate step index is within bounds
                    if (stepIndex >= 0 && stepIndex < form1003Flow.length) {
                      setStep(stepIndex);
                    }
                  }}
                  stepIndices={indicatorSteps.indices}
                />
            </div>
            )}
          </>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 xl:gap-8 items-start">
            <div className={`lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border border-border/60 transition-all duration-300 overflow-hidden shadow-lg sm:shadow-xl hover:shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col ${showWelcome ? 'justify-center' : 'justify-between'}`}>
                {renderStep()}
            </div>
            <div className="hidden lg:block lg:col-span-1 space-y-3 flex flex-col">
                <ProgressBar 
                  currentStep={step + 1} 
                  totalSteps={totalSteps} 
                  formData={formData}
                  flowSteps={form1003Flow}
                  onSectionClick={(sectionKey, stepIndex) => {
                    // Navigate to the step if a valid index is provided
                    if (stepIndex !== null && stepIndex !== undefined && stepIndex >= 0 && stepIndex < totalSteps) {
                      setStep(stepIndex);
                    }
                  }}
                />
                <Form1003Checklist loanPurpose={formData.loanPurpose} formData={formData} />
            </div>
        </div>
    </div>
  );
};

export default Form1003;