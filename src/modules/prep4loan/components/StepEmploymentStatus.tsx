import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Briefcase, User, Clock, Home as HomeIcon, Lightbulb } from './icons';
import type { FormData } from '../types';

interface StepEmploymentStatusProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepEmploymentStatus: React.FC<StepEmploymentStatusProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [status, setStatus] = useState<FormData['employmentStatus']>(
    data.employmentStatus
  );

  const handleSelect = (value: FormData['employmentStatus']) => {
    setStatus(value);
    onChange('employmentStatus', value);
  };

  const employmentOptions = [
    { value: 'Employed' as const, icon: <Briefcase className="h-6 w-6" />, label: 'Employed' },
    { value: 'Self-Employed' as const, icon: <User className="h-6 w-6" />, label: 'Self-Employed' },
    { value: 'Gig Worker' as const, icon: <Clock className="h-6 w-6" />, label: 'Gig Worker / Freelancer' },
    { value: 'Retired' as const, icon: <HomeIcon className="h-6 w-6" />, label: 'Retired' },
    { value: 'Not Working' as const, icon: <User className="h-6 w-6" />, label: 'Not Working' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Employment Status"
        subtitle="How would you describe your current employment situation?"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> Your employment status helps us determine the best loan options for you. Self-employed borrowers may need additional documentation, while employed borrowers typically have a simpler process.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
        {employmentOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <SelectionButton
              label={option.label}
              icon={option.icon}
              isSelected={status === option.value}
              onClick={() => handleSelect(option.value)}
            />
          </motion.div>
        ))}
      </div>

      <StepNavigation onNext={status ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepEmploymentStatus;

