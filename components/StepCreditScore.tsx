import React from 'react';
import { CreditScore } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';

interface StepCreditScoreProps {
  data: { creditScore: CreditScore | '' };
  onChange: (field: string, value: CreditScore) => void;
}

const creditScoreOptions = [
  { value: CreditScore.EXCELLENT },
  { value: CreditScore.GOOD },
  { value: CreditScore.AVERAGE },
  { value: CreditScore.FAIR },
];

const StepCreditScore: React.FC<StepCreditScoreProps> = ({ data, onChange }) => {
  return (
    <div>
      <StepHeader title="What is your estimated credit score?" />
      <div className="grid grid-cols-1 gap-3">
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