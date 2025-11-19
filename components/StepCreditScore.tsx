import React from 'react';
import { CreditScore } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';

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
  return (
    <div className="px-2 sm:px-0">
      <StepHeader title="What is your estimated credit score?" />
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
        {creditScoreOptions.map((option) => (
          <SelectionButton
            key={option.value}
            label={option.value}
            isSelected={data.creditScore === option.value}
            onClick={() => onChange('creditScore', option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepCreditScore;