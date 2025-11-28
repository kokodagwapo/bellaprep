import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormData } from '../types';
import { calculateProgress } from '../utils/progressCalculator';
import { CheckCircle2, Circle, ChevronDown } from './icons';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  formData?: FormData;
  onSectionClick?: (sectionKey: string, stepIndex: number) => void; // Callback for section clicks
  flowSteps?: Array<{ component: { name: string } }>; // Optional flow steps for mapping
}

// Section definitions matching progressCalculator
const sections: Array<{ 
  key: string; 
  label: string; 
  isCompleted: (data: FormData) => boolean;
  stepIndex?: number; // Optional step index mapping
}> = [
  { key: 'goal', label: 'Goal', isCompleted: (d) => !!d.goal },
  { key: 'propertyType', label: 'Property Type', isCompleted: (d) => !!d.propertyType },
  { key: 'propertyUse', label: 'Occupancy', isCompleted: (d) => !!d.propertyUse },
  { key: 'primaryResidenceIntent', label: 'Primary Residence', isCompleted: (d) => 
    !!(d.primaryResidenceIntent?.moveInWithin60Days !== undefined && 
       d.primaryResidenceIntent?.liveAtLeast12Months !== undefined) 
  },
  { key: 'subjectProperty', label: 'Subject Property', isCompleted: (d) => 
    !!(d.subjectProperty?.hasProperty !== undefined && 
       (d.subjectProperty.hasProperty 
         ? (d.subjectProperty.address?.street && d.subjectProperty.address?.zip && d.subjectProperty.value)
         : (d.subjectProperty.budgetRange && d.subjectProperty.targetZip)))
  },
  { key: 'currentHousingStatus', label: 'Housing Status', isCompleted: (d) => !!d.currentHousingStatus },
  { key: 'employmentStatus', label: 'Employment', isCompleted: (d) => !!d.employmentStatus },
  { key: 'timeInJob', label: 'Income', isCompleted: (d) => !!d.timeInJob && !!(d.income && d.income > 0) },
  { key: 'debts', label: 'Debts', isCompleted: (d) => 
    !!(d.debts && (d.debts.none || Object.keys(d.debts).filter(k => k !== 'none').length > 0))
  },
  { key: 'assets', label: 'Assets', isCompleted: (d) => 
    !!(d.assets && (d.assets.skip || Object.keys(d.assets).filter(k => k !== 'skip').length > 0))
  },
  { key: 'coBorrower', label: 'Co-Borrower', isCompleted: (d) => 
    d.coBorrower !== undefined || !d.coBorrower
  },
  { key: 'documents', label: 'Documents', isCompleted: () => true },
  { key: 'dmvVerification', label: 'Verification', isCompleted: (d) => 
    !!(d.dmvVerification?.idVerified && d.dmvVerification?.addressVerified)
  },
  { key: 'affordabilitySnapshot', label: 'Snapshot', isCompleted: (d) => !!d.affordabilitySnapshot },
  { key: 'reviewChecklist', label: 'Review', isCompleted: () => true },
  { key: 'summary', label: 'Summary', isCompleted: () => true },
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, formData, onSectionClick, flowSteps }) => {
  const [isSectionsExpanded, setIsSectionsExpanded] = useState(false);
  
  // Detect if this is Form1003 context by checking if flowSteps contains Form1003-specific components
  const isForm1003 = flowSteps && flowSteps.length > 0 && 
    (flowSteps[0]?.component?.name === 'Step1BorrowerInfo' || 
     flowSteps.some(step => {
       const name = step?.component?.name || '';
       return name.includes('Step1') || name.includes('Step2') || name.includes('Step3') || 
              name.includes('Step4') || name.includes('Step5') || name.includes('Step6') ||
              name.includes('Step7') || name.includes('Step8') || name.includes('BorrowerInfo') ||
              name.includes('FinancialInfo') || name.includes('PropertyInfo') || name.includes('Declarations');
     }));
  
  // Use step-based progress for Form1003, dynamic calculation for Prep4Loan
  const progressPercentage = isForm1003
    ? (totalSteps > 1
        ? Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100))
        : (currentStep > 0 ? 100 : 0))
    : (formData 
        ? Math.max(0, Math.min(100, calculateProgress(formData)))
        : (totalSteps > 1
            ? Math.max(0, Math.min(100, ((currentStep - 1) / (totalSteps - 1)) * 100))
            : (currentStep > 0 ? 100 : 0)));

  const completedSections = isForm1003
    ? Math.max(0, currentStep)
    : (formData 
        ? Math.max(0, sections.filter(s => s.isCompleted(formData)).length)
        : Math.max(0, currentStep));
  const totalSections = isForm1003 ? totalSteps : sections.length;

    // Map section keys to step component names for navigation
  const sectionToStepMap: Record<string, string> = {
    'goal': 'StepLoanPurpose',
    'propertyType': 'StepPropertyType',
    'propertyUse': 'StepPropertyUse',
    'primaryResidenceIntent': 'StepPrimaryResidenceConfirmation',
    'subjectProperty': 'StepSubjectProperty',
    'currentHousingStatus': 'StepCurrentHousingStatus',
    'employmentStatus': 'StepEmploymentStatus',
    'timeInJob': 'StepTimeInJob',
    'debts': 'StepDebtsLiabilities',
    'assets': 'StepAssetsFunds',
    'coBorrower': 'StepAddCoBorrower',
    'documents': 'StepPrepDocs',
    'dmvVerification': 'StepDMVAddressVerification',
    'affordabilitySnapshot': 'StepAffordabilitySnapshot',
    'reviewChecklist': 'StepReviewChecklist',
    'summary': 'StepPrep4LoanSummary',
  };

  // Find step index for a section by matching component name
  const getStepIndexForSection = (sectionKey: string): number | null => {
    if (!flowSteps) return null;
    const stepName = sectionToStepMap[sectionKey];
    if (!stepName) return null;
    const stepIndex = flowSteps.findIndex(step => step.component.name === stepName);
    return stepIndex >= 0 ? stepIndex : null;
  };

  const handleSectionClick = (sectionKey: string, index: number) => {
    if (onSectionClick) {
      const stepIndex = getStepIndexForSection(sectionKey);
      onSectionClick(sectionKey, stepIndex ?? index);
    }
  };

  return (
    <div className="w-full space-y-3 p-4 bg-secondary/50 rounded-lg border border-border">
      {/* Progress Header - Matching prep4loan style */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-xs sm:text-sm font-light tracking-tight text-gray-900">Application Progress</h3>
          <p className="text-[10px] sm:text-xs font-light leading-relaxed text-gray-800">Pre-Evaluation Requirements</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-base sm:text-lg font-light text-primary">{Math.round(progressPercentage)}%</div>
          <div className="text-[10px] sm:text-xs font-light text-gray-800">{completedSections}/{totalSections}</div>
        </div>
      </div>

      {/* Progress Bar - Matching prep4loan style */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Sections List - Collapsible for sidebar */}
      {formData && !isForm1003 && (
        <div>
          <button
            onClick={() => setIsSectionsExpanded(!isSectionsExpanded)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/50 transition-colors mb-1.5"
          >
            <span className="text-[10px] sm:text-xs font-light text-gray-900">
              {isSectionsExpanded ? 'Hide' : 'Show'} Sections ({completedSections}/{totalSections})
            </span>
            <ChevronDown 
              className={`h-3 w-3 text-muted-foreground transition-transform ${isSectionsExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {isSectionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1.5">
                  {sections.map((section, index) => {
                    const isCompleted = section.isCompleted(formData);
                    const stepIndex = getStepIndexForSection(section.key);
                    return (
            <motion.div
                        key={section.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSectionClick(section.key, stepIndex ?? index)}
                        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer touch-manipulation"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-[10px] sm:text-xs font-light flex-1 ${
                          isCompleted 
                            ? 'text-gray-700 line-through opacity-70' 
                            : 'text-gray-900'
                        }`}>
                          {section.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
          </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Completion Celebration - Matching prep4loan style */}
      {formData && progressPercentage === 100 && (
          <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-sm font-light text-gray-900">All requirements complete!</p>
          </motion.div>
        )}
    </div>
  );
};

export default ProgressBar;
