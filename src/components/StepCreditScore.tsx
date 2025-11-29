import React from 'react';
import { CreditScore } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import { Lightbulb } from './icons';

interface StepCreditScoreProps {
  data: { creditScore: CreditScore | '' };
  onChange: (field: string, value: CreditScore) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const creditScoreOptions = [
  { value: CreditScore.EXCELLENT },
  { value: CreditScore.GOOD },
  { value: CreditScore.AVERAGE },
  { value: CreditScore.FAIR },
];

const StepCreditScore: React.FC<StepCreditScoreProps> = ({ data, onChange, onNext, onBack }) => {
  const handleSelect = (value: CreditScore) => {
    onChange('creditScore', value);
    if (onNext) {
      setTimeout(onNext, 250); // Small delay for visual feedback
    }
  };

  return (
    <div className="px-2 sm:px-0">
      <StepHeader title="What is your estimated credit score?" />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> Your credit score is a key factor in determining your loan eligibility and interest rate. Don't worry if your score isn't perfect - there are loan options available for various credit ranges!
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
        {creditScoreOptions.map((option) => (
          <SelectionButton
            key={option.value}
            label={option.value}
            isSelected={data.creditScore === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepCreditScore;