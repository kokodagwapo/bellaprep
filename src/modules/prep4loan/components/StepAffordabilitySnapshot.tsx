import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import Confetti from './Confetti';
import type { FormData, AffordabilityData } from '../types';

interface StepAffordabilitySnapshotProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAffordabilitySnapshot: React.FC<StepAffordabilitySnapshotProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [snapshot, setSnapshot] = useState<AffordabilityData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Calculate affordability metrics
    const calculateSnapshot = (): AffordabilityData => {
      // Current housing expense
      const currentHousingExpense = 
        data.currentHousingDetails?.rentAmount || 
        data.currentHousingDetails?.piti || 
        0;

      // New estimated payment (simplified calculation)
      // In production, this would use actual mortgage calculator
      const loanAmount = data.loanAmount || data.purchasePrice || 0;
      const interestRate = 0.065; // 6.5% example rate
      const loanTerm = 30; // 30 years
      const monthlyRate = interestRate / 12;
      const numPayments = loanTerm * 12;
      
      let newEstimatedPayment = 0;
      if (loanAmount > 0) {
        newEstimatedPayment = loanAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
          (Math.pow(1 + monthlyRate, numPayments) - 1);
        // Add estimated taxes and insurance (simplified)
        newEstimatedPayment += (loanAmount * 0.01) / 12; // ~1% annual property tax
        newEstimatedPayment += 150; // Estimated insurance
      }

      // Total housing obligation
      const totalHousingObligation = newEstimatedPayment;

      // Calculate DTI (Debt-to-Income)
      const monthlyIncome = data.income || 0;
      const monthlyDebts = data.debts ? Object.entries(data.debts).reduce((sum, [key, val]) => {
        if (key === 'none') return sum;
        if (typeof val === 'number') return sum + val;
        return sum;
      }, 0) : 0;
      
      const totalMonthlyObligations = (totalHousingObligation || 0) + monthlyDebts;
      const dtiRatio = monthlyIncome > 0 ? (totalMonthlyObligations / monthlyIncome) * 100 : 0;

      // DTI Band
      let estimatedDTIBand: 'Low' | 'Moderate' | 'High' = 'Low';
      if (dtiRatio > 43) {
        estimatedDTIBand = 'High';
      } else if (dtiRatio > 36) {
        estimatedDTIBand = 'Moderate';
      }

      // Approval Strength Score (0-100)
      let approvalStrengthScore = 50; // Base score
      
      // Credit score impact
      if (data.creditScore?.includes('740+')) approvalStrengthScore += 25;
      else if (data.creditScore?.includes('700-739')) approvalStrengthScore += 15;
      else if (data.creditScore?.includes('640-699')) approvalStrengthScore += 5;
      
      // DTI impact
      if (dtiRatio < 36) approvalStrengthScore += 15;
      else if (dtiRatio < 43) approvalStrengthScore += 5;
      else approvalStrengthScore -= 10;
      
      // Employment stability
      if (data.timeInJob === 'More than 2 years') approvalStrengthScore += 10;
      else if (data.timeInJob === '1-2 years') approvalStrengthScore += 5;
      
      // Assets
      const totalAssets = data.assets ? Object.entries(data.assets).reduce((sum, [key, val]) => {
        if (key === 'skip') return sum;
        if (typeof val === 'number') return sum + val;
        return sum;
      }, 0) : 0;
      if (totalAssets > (loanAmount || 0) * 0.2) approvalStrengthScore += 10;
      
      approvalStrengthScore = Math.min(100, Math.max(0, approvalStrengthScore));

      return {
        currentHousingExpense,
        newEstimatedPayment,
        totalHousingObligation,
        estimatedDTIBand,
        approvalStrengthScore,
      };
    };

    const calculated = calculateSnapshot();
    setSnapshot(calculated);
    onChange('affordabilitySnapshot', calculated);
    
    // Show confetti if score is good
    if (calculated.approvalStrengthScore && calculated.approvalStrengthScore >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [data]);

  if (!snapshot) {
    return (
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
        <StepHeader title="Calculating Affordability..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 relative">
      {showConfetti && <Confetti />}
      
      <StepHeader 
        title="Affordability Snapshot"
        subtitle="Great job — you're nearly done!"
      />
      
      <div className="space-y-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium mb-2">Current Housing Expense</p>
            <p className="text-3xl font-bold text-blue-900">
              ${snapshot.currentHousingExpense?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-blue-700 mt-1">per month</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium mb-2">New Estimated Payment</p>
            <p className="text-3xl font-bold text-green-900">
              ${snapshot.newEstimatedPayment?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}
            </p>
            <p className="text-xs text-green-700 mt-1">per month</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-2">Total Housing Obligation</p>
            <p className="text-3xl font-bold text-purple-900">
              ${snapshot.totalHousingObligation?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}
            </p>
            <p className="text-xs text-purple-700 mt-1">per month</p>
          </div>

          <div className={`p-6 rounded-lg border ${
            snapshot.estimatedDTIBand === 'Low' 
              ? 'bg-green-50 border-green-200'
              : snapshot.estimatedDTIBand === 'Moderate'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className="text-sm font-medium mb-2" style={{
              color: snapshot.estimatedDTIBand === 'Low' ? '#065f46' : snapshot.estimatedDTIBand === 'Moderate' ? '#92400e' : '#991b1b'
            }}>
              Estimated DTI Band
            </p>
            <p className="text-3xl font-bold" style={{
              color: snapshot.estimatedDTIBand === 'Low' ? '#047857' : snapshot.estimatedDTIBand === 'Moderate' ? '#b45309' : '#dc2626'
            }}>
              {snapshot.estimatedDTIBand}
            </p>
            <p className="text-xs mt-1" style={{
              color: snapshot.estimatedDTIBand === 'Low' ? '#047857' : snapshot.estimatedDTIBand === 'Moderate' ? '#b45309' : '#dc2626'
            }}>
              Debt-to-Income Ratio
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary to-green-600 p-8 rounded-lg text-center"
        >
          <p className="text-sm text-white/90 font-medium mb-2">Approval Strength Score</p>
          <div className="relative inline-block">
            <div className="text-6xl font-bold text-white mb-2">
              {snapshot.approvalStrengthScore || 0}
            </div>
            <div className="w-48 h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${snapshot.approvalStrengthScore || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
          <p className="text-sm text-white/80 mt-4">
            {(snapshot.approvalStrengthScore || 0) >= 80 
              ? 'Excellent! You have a strong application.' 
              : (snapshot.approvalStrengthScore || 0) >= 60
              ? 'Good! Your application looks solid.'
              : 'Fair. Consider improving credit or reducing debt.'}
          </p>
        </motion.div>
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default StepAffordabilitySnapshot;

