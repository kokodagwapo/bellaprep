import React from 'react';
import { FormData, LoanPurpose } from '../types';
import { getRequirements, Requirement } from '../data/requirements';

interface RequirementsChecklistProps {
  loanPurpose: LoanPurpose | '';
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Requirement; isCompleted: boolean }> = ({ requirement, isCompleted }) => (
    <li className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${isCompleted ? 'bg-primary border-primary' : 'border-border'}`}>
            {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span className={`font-medium text-lg transition-colors ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
            {requirement.label}
        </span>
    </li>
);

const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({ loanPurpose, formData }) => {
  const requirements = getRequirements(loanPurpose);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-heading text-primary">Your Requirements</h3>
      <p className="text-sm text-muted-foreground">
        As you provide information via the form, chat, or document uploads, this list will update automatically.
      </p>
      <ul className="space-y-8 relative">
        <li className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-border -z-10"></li>
        {requirements.map((req) => (
            <RequirementItem 
                key={req.key}
                requirement={req} 
                isCompleted={req.isCompleted(formData)}
            />
        ))}
      </ul>
    </div>
  );
};

export default RequirementsChecklist;