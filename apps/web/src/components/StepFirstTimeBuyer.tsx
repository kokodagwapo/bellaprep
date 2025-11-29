import React from 'react';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';

interface StepFirstTimeBuyerProps {
  data: { isFirstTimeBuyer: boolean | null };
  onChange: (field: string, value: boolean) => void;
}

const buyerOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const StepFirstTimeBuyer: React.FC<StepFirstTimeBuyerProps> = ({ data, onChange }) => {
  return (
    <div>
      <StepHeader title="Are you a first time home buyer?" />
      <div className="grid grid-cols-2 gap-4">
        {buyerOptions.map((option) => (
          <SelectionButton
            key={option.label}
            label={option.label}
            isSelected={data.isFirstTimeBuyer === option.value}
            onClick={() => onChange('isFirstTimeBuyer', option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepFirstTimeBuyer;