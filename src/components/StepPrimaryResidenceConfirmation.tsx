import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Lightbulb, AlertCircle } from './icons';
import type { FormData } from '../types';

interface StepPrimaryResidenceConfirmationProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPrimaryResidenceConfirmation: React.FC<StepPrimaryResidenceConfirmationProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const intent = data.primaryResidenceIntent || {};

  const handleChange = (field: 'moveInWithin60Days' | 'liveAtLeast12Months', value: boolean) => {
    onChange('primaryResidenceIntent', {
      ...intent,
      [field]: value
    });
  };

  const canProceed = intent.moveInWithin60Days !== undefined && intent.liveAtLeast12Months !== undefined;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Primary Residence Occupancy Confirmation"
        subtitle="Please confirm your intentions for this property"
      />
      
      <div className="space-y-6 mt-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                <strong>Fannie Mae & Freddie Mac rules require this for primary homes.</strong> You must intend to move in within 60 days and live there for at least 12 months.
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 p-4 rounded-lg"
          >
            <p className="text-sm text-blue-900">
              These requirements are part of the government-sponsored enterprise (GSE) guidelines. 
              If you answer "No" to either question, you may need to apply for a different loan type 
              (such as an investment property loan) which may have different terms and requirements.
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Do you intend to move into the property within 60 days of closing?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <SelectionButton
                label="Yes"
                isSelected={intent.moveInWithin60Days === true}
                onClick={() => handleChange('moveInWithin60Days', true)}
              />
              <SelectionButton
                label="No"
                isSelected={intent.moveInWithin60Days === false}
                onClick={() => handleChange('moveInWithin60Days', false)}
              />
            </div>
            {intent.moveInWithin60Days === false && (
              <p className="mt-2 text-sm text-red-600">⚠️ This may affect your loan eligibility</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Do you intend to live in the home as your primary residence for at least 12 months?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <SelectionButton
                label="Yes"
                isSelected={intent.liveAtLeast12Months === true}
                onClick={() => handleChange('liveAtLeast12Months', true)}
              />
              <SelectionButton
                label="No"
                isSelected={intent.liveAtLeast12Months === false}
                onClick={() => handleChange('liveAtLeast12Months', false)}
              />
            </div>
            {intent.liveAtLeast12Months === false && (
              <p className="mt-2 text-sm text-red-600">⚠️ This may affect your loan eligibility</p>
            )}
          </div>
        </div>
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepPrimaryResidenceConfirmation;

