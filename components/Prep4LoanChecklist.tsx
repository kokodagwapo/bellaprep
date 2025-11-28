import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from './icons';
import { FormData } from '../types';
import { getRequirements, Requirement } from '../data/requirements';

import { LoanPurpose } from '../types';

interface Prep4LoanChecklistProps {
  loanPurpose: LoanPurpose | '';
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Requirement; isCompleted: boolean }> = ({ requirement, isCompleted }) => {
    if (!requirement || !requirement.label) {
        return null;
    }
    
    return (
        <div className="flex items-start gap-2">
        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${isCompleted ? 'bg-primary border-primary shadow-sm shadow-primary/20' : 'border-border'}`}>
            {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
            <div className="flex-1 min-w-0">
            <p className={`font-light text-[10px] sm:text-xs transition-colors duration-300 ${isCompleted ? 'line-through opacity-70 text-gray-700' : 'text-gray-900'}`}>
                {requirement.label}
            </p>
        </div>
    </div>
);
};

const Prep4LoanChecklist: React.FC<Prep4LoanChecklistProps> = ({ loanPurpose, formData }) => {
  const requirements = useMemo(() => {
    // Ensure we always return valid requirements, defaulting to purchase if loanPurpose is empty
    return getRequirements(loanPurpose || '');
  }, [loanPurpose]);
  
  const completedCount = useMemo(() => {
    if (!formData) return 0;
    return requirements.filter(req => req.isCompleted(formData)).length;
  }, [requirements, formData]);

  const totalCount = requirements.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
      <div>
        <h3 className="text-xs sm:text-sm font-light tracking-tight text-gray-900 mb-1">Application Checklist</h3>
        <p className="text-[10px] sm:text-xs font-light leading-relaxed mb-2 text-gray-800">
          This list tracks key information required for a complete application.
        </p>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-xs font-light text-gray-900">Progress</span>
          <span className="text-[10px] sm:text-xs font-light text-primary">{completedCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/90 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-xs font-light mt-1 text-right text-gray-800">{completionPercentage}% Complete</p>
      </div>
      
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar">
        {requirements.map((req) => (
          <div key={req.key} className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors">
            <RequirementItem 
              requirement={req} 
              isCompleted={req.isCompleted(formData)}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-3 border-t border-border">
        <p className="text-[10px] sm:text-xs font-light leading-relaxed text-gray-800">
          This is not an exhaustive list. Additional documentation may be required based on your specific loan scenario.
        </p>
      </div>
    </div>
  );
};

export default Prep4LoanChecklist;

