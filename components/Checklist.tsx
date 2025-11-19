import React from 'react';
import { FormData, LoanPurpose } from '../types';
import { getRequirements, Requirement } from '../data/requirements';
import { motion } from 'framer-motion';

interface RequirementsChecklistProps {
  loanPurpose: LoanPurpose | '';
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Requirement; isCompleted: boolean; index: number }> = ({ requirement, isCompleted, index }) => (
    <motion.li 
        className="flex items-center space-x-4 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
    >
        <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                isCompleted 
                    ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                    : 'border-border bg-card group-hover:border-primary/50 group-hover:bg-primary/5'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {isCompleted && (
                <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary-foreground" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </motion.svg>
            )}
        </motion.div>
        <span className={`font-semibold text-base transition-all duration-300 ${
            isCompleted 
                ? 'text-muted-foreground line-through' 
                : 'text-foreground group-hover:text-primary'
        }`}>
            {requirement.label}
        </span>
    </motion.li>
);

const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({ loanPurpose, formData }) => {
  const requirements = getRequirements(loanPurpose);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold font-heading text-foreground tracking-tight">
          Your Requirements
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          As you provide information via the form, chat, or document uploads, this list will update automatically.
        </p>
      </div>
      <ul className="space-y-6 relative pl-2">
        <motion.li 
            className="absolute left-5 top-6 h-[calc(100%-1.5rem)] w-0.5 bg-border -z-10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />
        {requirements.map((req, index) => (
            <RequirementItem 
                key={req.key}
                requirement={req} 
                isCompleted={req.isCompleted(formData)}
                index={index}
            />
        ))}
      </ul>
    </div>
  );
};

export default RequirementsChecklist;