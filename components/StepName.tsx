import React, { useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepNameProps {
  data: { fullName: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepName: React.FC<StepNameProps> = ({ data, onChange, onNext, onBack }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const isFormValid = data.fullName.trim().includes(' ');

  return (
    <div>
      <StepHeader 
        title="What is your full name?"
      />
      <div className="space-y-4">
        <input
          ref={nameInputRef}
          type="text"
          placeholder="John Smith"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className="w-full px-4 py-3 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
          aria-label="Full Name"
          required
        />
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isFormValid} />
    </div>
  );
};

export default StepName;