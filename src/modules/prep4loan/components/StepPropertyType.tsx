import React from 'react';
import { PropertyType } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import { Building, Building2, Landmark } from './icons';


interface StepPropertyTypeProps {
  data: { propertyType: PropertyType | '' };
  onChange: (field: string, value: PropertyType) => void;
}

const propertyTypeOptions = [
  { value: PropertyType.SINGLE_FAMILY, icon: <Building className="h-8 w-8" /> },
  { value: PropertyType.CONDO, icon: <Building2 className="h-8 w-8" /> },
  { value: PropertyType.TOWNHOUSE, icon: <Building2 className="h-8 w-8" /> },
  { value: PropertyType.MULTI_FAMILY, icon: <Landmark className="h-8 w-8" /> },
];

const StepPropertyType: React.FC<StepPropertyTypeProps> = ({ data, onChange }) => {
  return (
    <div>
      <StepHeader title="What type of property are you looking for?" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {propertyTypeOptions.map((option) => (
          <SelectionButton
            key={option.value}
            label={option.value}
            icon={option.icon}
            isSelected={data.propertyType === option.value}
            onClick={() => onChange('propertyType', option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default StepPropertyType;