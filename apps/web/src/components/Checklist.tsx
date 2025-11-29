import React from 'react';
import { FormData, LoanPurpose } from '../types';
import { getRequirements, Requirement } from '../data/requirements';

interface RequirementsChecklistProps {
  loanPurpose: LoanPurpose | '';
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Requirement; isCompleted: boolean }> = ({ requirement, isCompleted }) => (
    <div className="flex items-start space-x-3">
        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${isCompleted ? 'bg-primary border-primary' : 'border-border'}`}>
            {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <div>
            <p className={`font-semibold text-sm ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                {requirement.label}
            </p>
        </div>
    </div>
);

const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({ loanPurpose, formData }) => {
  const requirements = getRequirements(loanPurpose);

  return (
    <div className="space-y-4 p-6 bg-secondary/50 rounded-lg border border-border">
      <h3 className="text-lg font-bold font-heading text-foreground">Your Requirements</h3>
      <p className="text-xs text-muted-foreground">
        As you provide information via the form, chat, or document uploads, this list will update automatically.
      </p>
      <ul className="space-y-4">
        {requirements.map((req) => (
            <RequirementItem 
                key={req.key}
                requirement={req} 
                isCompleted={req.isCompleted(formData)}
            />
        ))}
         <li className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">This is not an exhaustive list. Additional documentation may be required.</p>
        </li>
      </ul>
    </div>
  );
};

export default RequirementsChecklist;