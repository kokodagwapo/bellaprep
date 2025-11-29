import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Users } from './icons';
import type { FormData } from '../types';

interface StepAddCoBorrowerProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAddCoBorrower: React.FC<StepAddCoBorrowerProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [hasCoBorrower, setHasCoBorrower] = useState<boolean | null>(
    data.coBorrower ? true : null
  );

  const handleSelect = (value: boolean) => {
    setHasCoBorrower(value);
    if (!value) {
      onChange('coBorrower', undefined);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Add Co-Borrower?"
        subtitle="Will someone else be applying for this loan with you?"
      />
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6">
        <SelectionButton
          label="Yes"
          icon={<Users className="h-8 w-8" />}
          isSelected={hasCoBorrower === true}
          onClick={() => handleSelect(true)}
        />
        <SelectionButton
          label="No"
          isSelected={hasCoBorrower === false}
          onClick={() => handleSelect(false)}
        />
      </div>

      <StepNavigation onNext={hasCoBorrower !== null ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepAddCoBorrower;

