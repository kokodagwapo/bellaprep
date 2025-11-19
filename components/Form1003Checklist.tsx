import React, { useMemo } from 'react';
import { FormData } from '../types';
import { getForm1003Requirements, Form1003Requirement } from '../data/form1003Requirements';

interface Form1003ChecklistProps {
  loanPurpose: string;
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Form1003Requirement; isCompleted: boolean }> = ({ requirement, isCompleted }) => (
    <div className="flex items-start space-x-3">
        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${isCompleted ? 'bg-primary border-primary shadow-sm shadow-primary/20' : 'border-border'}`}>
            {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <div className="flex-1">
            <p className={`font-semibold text-sm transition-colors duration-300 ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {requirement.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{requirement.section}</p>
        </div>
    </div>
);

const Form1003Checklist: React.FC<Form1003ChecklistProps> = ({ formData }) => {
  const requirements = getForm1003Requirements();
  
  const groupedRequirements = useMemo(() => {
    const groups: { [key: string]: Form1003Requirement[] } = {};
    requirements.forEach(req => {
      const sectionKey = req.section.split(' ')[0] + ' ' + req.section.split(' ')[1];
      if (!groups[sectionKey]) {
        groups[sectionKey] = [];
      }
      groups[sectionKey].push(req);
    });
    return groups;
  }, []);

  const completedCount = useMemo(() => {
    return requirements.filter(req => req.isCompleted(formData)).length;
  }, [requirements, formData]);

  const totalCount = requirements.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-4 p-6 bg-secondary/50 rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-bold font-heading text-foreground mb-1">Application Checklist</h3>
        <p className="text-xs text-muted-foreground mb-3">
          This list tracks key information required for a complete application.
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">Progress</span>
          <span className="text-xs font-semibold text-primary">{completedCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/90 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">{completionPercentage}% Complete</p>
      </div>
      
      <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {Object.entries(groupedRequirements).map(([section, sectionReqs]) => (
          <div key={section} className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider sticky top-0 bg-secondary/50 py-1 z-10">
              {section}
            </h4>
            <ul className="space-y-3 pl-1">
              {sectionReqs.map((req) => (
                <li key={req.key}>
                  <RequirementItem 
                    requirement={req} 
                    isCompleted={req.isCompleted(formData)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This checklist aligns with Fannie Mae Form 1003 requirements. Additional documentation may be required based on your specific loan scenario.
        </p>
      </div>
    </div>
  );
};

export default Form1003Checklist;
