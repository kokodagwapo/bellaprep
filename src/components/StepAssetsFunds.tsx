import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Building, TrendingUp, Gift, Zap, Lightbulb } from './icons';
import type { FormData } from '../types';

interface StepAssetsFundsProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const assetOptions = [
  { key: 'bankAccount', label: 'Bank account', icon: <Building className="h-6 w-6" /> },
  { key: 'savings', label: 'Savings', icon: <Building className="h-6 w-6" /> },
  { key: 'retirement', label: 'Retirement', icon: <TrendingUp className="h-6 w-6" /> },
  { key: 'giftFunds', label: 'Gift funds', icon: <Gift className="h-6 w-6" /> },
  { key: 'crypto', label: 'Crypto / Other', icon: <Zap className="h-6 w-6" /> },
];

const StepAssetsFunds: React.FC<StepAssetsFundsProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [assets, setAssets] = useState<FormData['assets']>(data.assets || {});
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(
    new Set(assets ? Object.keys(assets).filter(key => key !== 'skip' && assets[key as keyof typeof assets] !== undefined) : [])
  );

  const handleAssetToggle = (key: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(key)) {
      newSelected.delete(key);
      const updated = { ...(assets || {}) };
      delete updated[key as keyof typeof updated];
      setAssets(updated);
      setSelectedAssets(newSelected);
      onChange('assets', updated);
    } else {
      newSelected.add(key);
      const updated = { ...(assets || {}), [key]: (assets?.[key as keyof typeof assets] as number) || 0, skip: false };
      setAssets(updated);
      setSelectedAssets(newSelected);
      onChange('assets', updated);
    }
  };

  const handleSkip = () => {
    setSelectedAssets(new Set());
    const updated = { skip: true };
    setAssets(updated);
    onChange('assets', updated);
  };

  const handleAmountChange = (key: string, value: number) => {
    const updated = { ...(assets || {}), [key]: value, skip: false };
    setAssets(updated);
    onChange('assets', updated);
  };

  const canProceed = assets?.skip || selectedAssets.size > 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Assets & Funds"
        subtitle="Tell us about your available funds and assets"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> Your assets and available funds help determine your down payment options and loan eligibility. Gift funds are allowed for down payments, but you'll need a gift letter from the donor!
        </p>
      </div>
      
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assetOptions.map((option) => (
            <SelectionButton
              key={option.key}
              label={option.label}
              icon={option.icon}
              isSelected={selectedAssets.has(option.key)}
              onClick={() => handleAssetToggle(option.key)}
            />
          ))}
          <SelectionButton
            label="Skip for now"
            isSelected={assets?.skip === true}
            onClick={handleSkip}
          />
        </div>

        {selectedAssets.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {Array.from(selectedAssets).map((key) => {
              const option = assetOptions.find(o => o.key === key);
              if (!option) return null;
              
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {option.label} - Balance
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={(assets?.[key as keyof typeof assets] as number) || 0}
                      onChange={(e) => handleAmountChange(key, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">$0</span>
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">
                          ${((assets?.[key as keyof typeof assets] as number) || 0).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">$1M+</span>
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

export default StepAssetsFunds;

