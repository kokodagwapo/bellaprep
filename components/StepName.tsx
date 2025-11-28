import React, { useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { Lightbulb } from './icons';

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
    <div className="px-2 sm:px-0">
      <StepHeader 
        title="What is your full name?"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4">
        <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold">Bella's Insight:</span> Make sure to use your full legal name exactly as it appears on your government-issued ID. This helps prevent delays during verification!
        </p>
      </div>
      
      <div className="space-y-3 mt-3 sm:mt-4">
        <input
          ref={nameInputRef}
          type="text"
          placeholder="John Smith"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[40px] sm:min-h-[42px]"
          style={{ fontSize: '16px' }}
          aria-label="Full Name"
          required
        />
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isFormValid} />
    </div>
  );
};

export default StepName;