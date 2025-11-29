import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Lightbulb, User, Users, Zap } from './icons';
import { optimizePrimaryBorrower, type PrimaryBorrowerRecommendation } from '../services/primaryBorrowerOptimization';
import type { FormData } from '../types';

interface StepPrimaryBorrowerOptimizationProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPrimaryBorrowerOptimization: React.FC<StepPrimaryBorrowerOptimizationProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [recommendation, setRecommendation] = useState<PrimaryBorrowerRecommendation | null>(null);
  const [selected, setSelected] = useState<FormData['primaryBorrowerOptimization']>(data.primaryBorrowerOptimization || {});

  useEffect(() => {
    if (data.coBorrower) {
      const rec = optimizePrimaryBorrower(data);
      setRecommendation(rec);
      if (!selected?.selected) {
        const newSelected = { selected: 'bellaDecide' as const, bellaRecommendation: rec.reasoning };
        setSelected(newSelected);
        onChange('primaryBorrowerOptimization', newSelected);
      }
    }
  }, [data]);

  const handleSelect = (value: 'me' | 'coBorrower' | 'bellaDecide') => {
    const updated = {
      selected: value,
      bellaRecommendation: value === 'bellaDecide' ? recommendation?.reasoning : undefined,
    };
    setSelected(updated);
    onChange('primaryBorrowerOptimization', updated);
  };

  const canProceed = selected?.selected !== undefined;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Primary Borrower Optimization"
        subtitle="Choose who should be the primary borrower"
      />
      
      <div className="space-y-6 mt-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1 space-y-2 text-sm text-blue-800">
              <p><strong>Bella's Insights:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>The primary borrower should usually be the one with the higher credit score</li>
                <li>Adding spouse helps only if income &gt; their debts</li>
                <li>Lenders use the LOWEST score between both</li>
                <li>Better primary = faster AUS approval + better rate</li>
              </ul>
            </div>
          </div>
        </div>

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 p-4 rounded-lg"
          >
            <div className="flex items-start">
              <Zap className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-2">
                  Bella's Recommendation: {recommendation.recommended === 'me' ? 'You' : 'Co-Borrower'}
                </p>
                <p className="text-sm text-green-800">{recommendation.reasoning}</p>
                <div className="mt-3 text-xs text-green-700 space-y-1">
                  <p><strong>Factors considered:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{recommendation.factors.creditScore}</li>
                    <li>{recommendation.factors.incomeToDebt}</li>
                    <li>{recommendation.factors.employmentStability}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <SelectionButton
            label="Make ME the primary borrower"
            icon={<User className="h-6 w-6" />}
            isSelected={selected?.selected === 'me'}
            onClick={() => handleSelect('me')}
          />
          <SelectionButton
            label="Make CO-BORROWER primary"
            icon={<Users className="h-6 w-6" />}
            isSelected={selected?.selected === 'coBorrower'}
            onClick={() => handleSelect('coBorrower')}
          />
          {recommendation && (
            <SelectionButton
              label="Let Bella Decide (AI selects optimal path)"
              icon={<Zap className="h-6 w-6" />}
              isSelected={selected?.selected === 'bellaDecide'}
              onClick={() => handleSelect('bellaDecide')}
            />
          )}
        </div>
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepPrimaryBorrowerOptimization;

