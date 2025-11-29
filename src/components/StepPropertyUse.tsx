import React from 'react';
import { PropertyUse } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import { Home, Sun, TrendingUp } from './icons';

interface StepPropertyUseProps {
  data: { propertyUse: PropertyUse | '' };
  onChange: (field: string, value: PropertyUse) => void;
}

const propertyUseOptions = [
  { value: PropertyUse.PRIMARY_RESIDENCE, icon: <Home className="h-8 w-8" /> },
  { value: PropertyUse.SECOND_HOME, icon: <Sun className="h-8 w-8" /> },
  { value: PropertyUse.INVESTMENT, icon: <TrendingUp className="h-8 w-8" /> },
];

const StepPropertyUse: React.FC<StepPropertyUseProps> = ({ data, onChange }) => {
  return (
    <div>
      <StepHeader title="How will you use this property?" />
      <div className="grid grid-cols-1 gap-4">
        {propertyUseOptions.map((option) => (
          <SelectionButton
            key={option.value}
            label={option.value}
            icon={option.icon}
            isSelected={data.propertyUse === option.value}
            onClick={() => onChange('propertyUse', option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepPropertyUse;