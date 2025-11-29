import React, { useState, useMemo } from 'react';
import { appFlow, AppStep, getFilteredFlow } from '../../../appFlow';
import type { FormData } from '../../../types';

interface Prep4LoanFlowProps {
  formData: FormData;
  onDataChange: (data: Partial<FormData>) => void;
  onComplete?: () => void;
}

const Prep4LoanFlow: React.FC<Prep4LoanFlowProps> = ({
  formData,
  onDataChange,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  const filteredFlow = useMemo(() => getFilteredFlow(appFlow, formData), [formData]);

  const currentStep = filteredFlow[step];
  const totalSteps = filteredFlow.length;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleDataChange = (field: string, value: any) => {
    onDataChange({ [field]: value });
  };

  if (!currentStep) {
    return <div>Loading...</div>;
  }

  const StepComponent = currentStep.component;
  const commonProps = {
    data: formData,
    onChange: handleDataChange,
    onNext: handleNext,
    onBack: handleBack,
  };

  return <StepComponent {...commonProps} />;
};

export default Prep4LoanFlow;

