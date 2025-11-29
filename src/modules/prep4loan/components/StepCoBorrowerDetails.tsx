import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { Home, CreditCard, Car, GraduationCap, FileText, Users } from './icons';
import type { FormData, CoBorrowerInfo } from '../types';
import { CreditScore } from '../types';

interface StepCoBorrowerDetailsProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const creditScoreOptions: CreditScore[] = [
  CreditScore.EXCELLENT,
  CreditScore.GOOD,
  CreditScore.AVERAGE,
  CreditScore.FAIR,
];

const StepCoBorrowerDetails: React.FC<StepCoBorrowerDetailsProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [coBorrower, setCoBorrower] = useState<CoBorrowerInfo>(data.coBorrower || {});
  const [debts, setDebts] = useState(coBorrower.debts || {});

  const handleChange = (field: keyof CoBorrowerInfo, value: any) => {
    const updated = { ...coBorrower, [field]: value };
    setCoBorrower(updated);
    onChange('coBorrower', updated);
  };

  const handleDebtChange = (key: string, value: number) => {
    const updatedDebts = { ...debts, [key]: value };
    setDebts(updatedDebts);
    handleChange('debts', updatedDebts);
  };

  const handleAssetChange = (key: string, value: number) => {
    const updatedAssets = { ...coBorrower.assets, [key]: value };
    handleChange('assets', updatedAssets);
  };

  const canProceed = coBorrower.relationship && 
    coBorrower.willLiveInHome !== undefined &&
    coBorrower.housingStatus &&
    coBorrower.income && coBorrower.income > 0 &&
    coBorrower.estimatedCreditScore;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Co-Borrower Details"
        subtitle="Tell us about your co-borrower"
      />
      
      <div className="space-y-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Relationship *
          </label>
          <select
            value={coBorrower.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Partner">Partner</option>
            <option value="Parent">Parent</option>
            <option value="Child">Child</option>
            <option value="Sibling">Sibling</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Will they live in the home? *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleChange('willLiveInHome', true)}
              className={`px-4 py-3 border rounded-lg font-medium ${
                coBorrower.willLiveInHome === true
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleChange('willLiveInHome', false)}
              className={`px-4 py-3 border rounded-lg font-medium ${
                coBorrower.willLiveInHome === false
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-gray-300'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Housing Status *
          </label>
          <select
            value={coBorrower.housingStatus || ''}
            onChange={(e) => handleChange('housingStatus', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select status</option>
            <option value="Rent">Rent</option>
            <option value="Own With Mortgage">Own With Mortgage</option>
            <option value="Own Free & Clear">Own Free & Clear</option>
            <option value="Live With Family">Live With Family</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Monthly Income *
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="50000"
              step="100"
              value={coBorrower.income || 0}
              onChange={(e) => handleChange('income', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">$0</span>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  ${(coBorrower.income || 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <span className="text-sm text-muted-foreground">$50,000</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Debts (Monthly Payments)
          </label>
          <div className="space-y-3">
            {['carLoan', 'creditCards', 'studentLoans', 'personalLoans', 'childSupport'].map((debtType) => (
              <div key={debtType} className="flex items-center gap-3">
                <label className="flex-1 text-sm text-foreground capitalize">
                  {debtType.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={debts[debtType as keyof typeof debts] || ''}
                  onChange={(e) => handleDebtChange(debtType, Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estimated Credit Score *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {creditScoreOptions.map((score) => (
              <button
                key={score}
                onClick={() => handleChange('estimatedCreditScore', score)}
                className={`px-4 py-3 border rounded-lg text-sm font-medium ${
                  coBorrower.estimatedCreditScore === score
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-300 hover:border-primary'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Assets (Optional)
          </label>
          <div className="space-y-3">
            {['bankAccount', 'savings', 'retirement', 'giftFunds', 'crypto'].map((assetType) => (
              <div key={assetType} className="flex items-center gap-3">
                <label className="flex-1 text-sm text-foreground capitalize">
                  {assetType.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={coBorrower.assets?.[assetType as keyof typeof coBorrower.assets] || ''}
                  onChange={(e) => handleAssetChange(assetType, Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepCoBorrowerDetails;

