import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from './icons';
import { FormData } from '../types';
import { getForm1003Requirements, Form1003Requirement } from '../data/form1003Requirements';

interface Form1003ChecklistProps {
  loanPurpose: string;
  formData: FormData;
}

const RequirementItem: React.FC<{ requirement: Form1003Requirement; isCompleted: boolean }> = ({ requirement, isCompleted }) => {
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
                {requirement.section && (
            <p className="text-[10px] font-light mt-0.5 text-gray-800">{requirement.section}</p>
                )}
        </div>
    </div>
);
};

const Form1003Checklist: React.FC<Form1003ChecklistProps> = ({ formData }) => {
  const requirements = useMemo(() => {
    // Always get Form1003 requirements
    return getForm1003Requirements();
  }, []);
  
  const groupedRequirements = useMemo(() => {
    const groups: { [key: string]: Form1003Requirement[] } = {};
    requirements.forEach(req => {
      // Handle sections with format "Section X" or "Section Xy" or just "Documents"
      const parts = req.section.split(' ');
      let sectionKey: string;
      if (parts.length >= 2 && parts[0].toLowerCase() === 'section') {
        // Format: "Section 1a" -> "Section 1a"
        sectionKey = parts[0] + ' ' + parts[1];
      } else {
        // Format: "Documents" -> "Documents"
        sectionKey = req.section;
      }
      if (!groups[sectionKey]) {
        groups[sectionKey] = [];
      }
      groups[sectionKey].push(req);
    });
    return groups;
  }, [requirements]);

  const completedCount = useMemo(() => {
    if (!formData) return 0;
    return requirements.filter(req => {
      try {
        return req.isCompleted(formData);
      } catch (error) {
        console.warn('Error checking requirement completion:', req.key, error);
        return false;
      }
    }).length;
  }, [requirements, formData]);

  const totalCount = requirements.length;
  const completionPercentage = totalCount > 0 ? Math.max(0, Math.min(100, Math.round((completedCount / totalCount) * 100))) : 0;

  // Initialize expanded sections - all sections collapsed by default
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    return new Set<string>();
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
      <div>
        <h3 className="text-xs sm:text-sm font-light tracking-tight text-foreground mb-1">Application Checklist</h3>
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
        {Object.entries(groupedRequirements).map(([section, sectionReqs]) => {
          const isExpanded = expandedSections.has(section);
          return (
            <div key={section} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                <h4 className="text-[10px] sm:text-xs font-light text-black uppercase tracking-wider">
              {section}
            </h4>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3 text-primary" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 p-3 pl-4">
              {sectionReqs.map((req) => (
                <li key={req.key}>
                  <RequirementItem 
                    requirement={req} 
                    isCompleted={req.isCompleted(formData)}
                  />
                </li>
              ))}
            </ul>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
          );
        })}
      </div>
      
      <div className="pt-3 border-t border-border">
        <p className="text-[10px] sm:text-xs font-light leading-relaxed text-gray-800">
          This checklist aligns with Fannie Mae Form 1003 requirements. Additional documentation may be required based on your specific loan scenario.
        </p>
      </div>
    </div>
  );
};

export default Form1003Checklist;
