import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { CreditCard, Car, GraduationCap, FileText, Users, Lightbulb } from './icons';
import type { FormData } from '../types';

interface StepDebtsLiabilitiesProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const debtOptions = [
  { key: 'carLoan', label: 'Car loan', icon: <Car className="h-6 w-6" /> },
  { key: 'creditCards', label: 'Credit cards', icon: <CreditCard className="h-6 w-6" /> },
  { key: 'studentLoans', label: 'Student loans', icon: <GraduationCap className="h-6 w-6" /> },
  { key: 'personalLoans', label: 'Personal loans', icon: <FileText className="h-6 w-6" /> },
  { key: 'childSupport', label: 'Child support / alimony', icon: <Users className="h-6 w-6" /> },
];

const StepDebtsLiabilities: React.FC<StepDebtsLiabilitiesProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [debts, setDebts] = useState<FormData['debts']>(data.debts || {});
  const [selectedDebts, setSelectedDebts] = useState<Set<string>>(
    new Set(debts ? Object.keys(debts).filter(key => key !== 'none' && debts[key as keyof typeof debts] !== undefined) : [])
  );

  const handleDebtToggle = (key: string) => {
    const newSelected = new Set(selectedDebts);
    if (newSelected.has(key)) {
      newSelected.delete(key);
      const updated = { ...(debts || {}) };
      delete updated[key as keyof typeof updated];
      updated.none = newSelected.size === 0;
      setDebts(updated);
      setSelectedDebts(newSelected);
      onChange('debts', updated);
    } else {
      newSelected.add(key);
      const updated = { ...(debts || {}), [key]: (debts?.[key as keyof typeof debts] as number) || 0, none: false };
      setDebts(updated);
      setSelectedDebts(newSelected);
      onChange('debts', updated);
    }
  };

  const handleNone = () => {
    setSelectedDebts(new Set());
    const updated = { none: true };
    setDebts(updated);
    onChange('debts', updated);
  };

  const handleAmountChange = (key: string, value: number) => {
    const updated = { ...(debts || {}), [key]: value, none: false };
    setDebts(updated);
    onChange('debts', updated);
  };

  const canProceed = debts?.none || selectedDebts.size > 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Debts & Liabilities"
        subtitle="Do you have any of the following?"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> Lenders consider your debt-to-income (DTI) ratio when evaluating your loan application. Be honest about all your debts - this helps us find the best loan options for you!
        </p>
      </div>
      
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {debtOptions.map((option) => (
            <SelectionButton
              key={option.key}
              label={option.label}
              icon={option.icon}
              isSelected={selectedDebts.has(option.key)}
              onClick={() => handleDebtToggle(option.key)}
            />
          ))}
          <SelectionButton
            label="None"
            isSelected={debts?.none === true}
            onClick={handleNone}
          />
        </div>

        {selectedDebts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {Array.from(selectedDebts).map((key) => {
              const option = debtOptions.find(o => o.key === key);
              if (!option) return null;
              
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {option.label} - Monthly Payment
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={(debts?.[key as keyof typeof debts] as number) || 0}
                      onChange={(e) => handleAmountChange(key, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">$0</span>
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">
                          ${((debts?.[key as keyof typeof debts] as number) || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                      <span className="text-sm text-muted-foreground">$5,000</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepDebtsLiabilities;

