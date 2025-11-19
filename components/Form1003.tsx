import React, { useState } from 'react';
import type { FormData } from '../types';
import ProgressBar from './ProgressBar';
import Form1003Checklist from './Form1003Checklist';
import { form1003Flow } from './Form1003/form1003Flow';

interface Form1003Props {
  initialData: FormData;
}

const Form1003: React.FC<Form1003Props> = ({ initialData }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const totalSteps = form1003Flow.length;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  
  const handleDataChange = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const renderStep = () => {
    const CurrentStepComponent = form1003Flow[step].component;
    if (!CurrentStepComponent) return null;

    const props: any = {
      data: formData,
      onDataChange: handleDataChange,
    };

    if (step < totalSteps - 1) {
      props.onNext = nextStep;
    }
    if (step > 0) {
      props.onBack = prevStep;
    }

    return <CurrentStepComponent {...props} />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in my-4 sm:my-6 md:my-8 px-3 sm:px-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground font-heading px-2">Uniform Residential Loan Application</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base md:text-lg">Fannie Mae Form 1003</p>
        </div>
        <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
            <ProgressBar currentStep={step + 1} totalSteps={totalSteps} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12 items-start">
            <div className="lg:col-span-2 bg-card p-4 sm:p-6 md:p-8 rounded-lg border border-border shadow-sm">
                {renderStep()}
            </div>
            <div className="hidden lg:block lg:col-span-1">
                <Form1003Checklist loanPurpose={formData.loanPurpose} formData={formData} />
            </div>
        </div>
    </div>
  );
};

export default Form1003;