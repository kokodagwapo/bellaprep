import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { CheckCircle2, Circle } from './icons';
import type { FormData } from '../types';

interface StepReviewChecklistProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  onEditStep?: (stepIndex: number) => void;
}

const StepReviewChecklist: React.FC<StepReviewChecklistProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack,
  onEditStep 
}) => {
  const checklistItems = [
    {
      key: 'goal',
      label: 'Goal Selected',
      completed: !!data.goal,
      stepIndex: 1,
    },
    {
      key: 'propertyType',
      label: 'Property Type',
      completed: !!data.propertyType,
      stepIndex: 2,
    },
    {
      key: 'propertyUse',
      label: 'Occupancy',
      completed: !!data.propertyUse,
      stepIndex: 3,
    },
    {
      key: 'primaryResidenceIntent',
      label: 'Primary Residence Intent',
      completed: !!data.primaryResidenceIntent?.moveInWithin60Days && 
                  !!data.primaryResidenceIntent?.liveAtLeast12Months,
      stepIndex: 4,
    },
    {
      key: 'currentHousingStatus',
      label: 'Housing Status',
      completed: !!data.currentHousingStatus,
      stepIndex: 5,
    },
    {
      key: 'employment',
      label: 'Employment & 2-Yr History',
      completed: !!data.employmentStatus && !!data.timeInJob,
      stepIndex: 6,
    },
    {
      key: 'income',
      label: 'Income',
      completed: !!(data.income && data.income > 0),
      stepIndex: 7,
    },
    {
      key: 'debts',
      label: 'Debts',
      completed: !!(data.debts && (data.debts.none || Object.keys(data.debts).length > 1)),
      stepIndex: 8,
    },
    {
      key: 'assets',
      label: 'Assets',
      completed: !!(data.assets && (data.assets.skip || Object.keys(data.assets).length > 1)),
      stepIndex: 9,
    },
    {
      key: 'coBorrower',
      label: 'Co-Borrower',
      completed: data.coBorrower !== undefined || !data.coBorrower,
      stepIndex: 10,
    },
    {
      key: 'idVerified',
      label: 'ID Verified',
      completed: !!data.dmvVerification?.idVerified,
      stepIndex: 11,
    },
    {
      key: 'addressVerified',
      label: 'Address Verified',
      completed: !!data.dmvVerification?.addressVerified,
      stepIndex: 12,
    },
    {
      key: 'documents',
      label: 'Documents',
      completed: true, // Optional, so always true
      stepIndex: 13,
    },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

  const handleItemClick = (stepIndex: number) => {
    if (onEditStep) {
      onEditStep(stepIndex);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Review Checklist"
        subtitle="Review and edit any section as needed"
      />
      
      <div className="space-y-6 mt-6">
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-primary mb-1">
            {completedCount} of {totalCount} sections completed
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleItemClick(item.stepIndex)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                item.completed
                  ? 'bg-green-50 border-green-200 hover:border-green-300'
                  : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
              }`}
            >
              <div className="flex-shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${
                  item.completed ? 'text-green-900' : 'text-yellow-900'
                }`}>
                  {item.label}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.completed ? 'Complete' : 'Incomplete'}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Click on any item above to go back and edit that section.
          </p>
        </div>
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default StepReviewChecklist;

