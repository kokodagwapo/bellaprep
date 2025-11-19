import React from 'react';
import { motion } from 'framer-motion';
import { LoanPurpose } from '../types';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import { ShoppingCart, Repeat } from './icons';

interface StepLoanPurposeProps {
  data: { loanPurpose: LoanPurpose | '' };
  onChange: (field: string, value: LoanPurpose) => void;
  onNext: () => void;
  onBack: () => void;
}

const loanPurposeOptions = [
  { value: LoanPurpose.PURCHASE, icon: <ShoppingCart className="h-8 w-8"/> },
  { value: LoanPurpose.REFINANCE, icon: <Repeat className="h-8 w-8" /> },
];

const StepLoanPurpose: React.FC<StepLoanPurposeProps> = ({ data, onChange, onNext }) => {
  const handleSelect = (value: LoanPurpose) => {
    onChange('loanPurpose', value);
    setTimeout(onNext, 250); // Small delay for visual feedback
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="What is the purpose of this loan?" 
        subtitle="Select the option that best describes your loan needs"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        {loanPurposeOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <SelectionButton
              label={option.value}
              icon={option.icon}
              isSelected={data.loanPurpose === option.value}
              onClick={() => handleSelect(option.value)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepLoanPurpose;