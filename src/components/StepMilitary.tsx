import React from 'react';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';

interface StepMilitaryProps {
  data: { isMilitary: boolean | null };
  onChange: (field: string, value: boolean) => void;
}

const militaryOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const StepMilitary: React.FC<StepMilitaryProps> = ({ data, onChange }) => {
  return (
    <div>
      <StepHeader title="Have you served in the U.S. Military?" />
      <div className="grid grid-cols-2 gap-4">
        {militaryOptions.map((option) => (
          <SelectionButton
            key={option.label}
            label={option.label}
            isSelected={data.isMilitary === option.value}
            onClick={() => onChange('isMilitary', option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepMilitary;