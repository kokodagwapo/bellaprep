import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { generateLoanSummary } from '../services/geminiService';
import type { FormData } from '../types';
import { MortgageType, LoanPurpose } from '../types';
import { Home, Shield, Star, FileCheck, DollarSign, Check, Sparkles } from './icons';

interface StepPrep4LoanSummaryProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  onProceedToApplication?: () => void;
}

const loanTypeIcons: Record<string, React.ReactNode> = {
  [MortgageType.CONVENTIONAL]: <Home className="h-6 w-6" />,
  [MortgageType.FHA]: <Shield className="h-6 w-6" />,
  [MortgageType.VA]: <Star className="h-6 w-6" />,
  [MortgageType.USDA]: <FileCheck className="h-6 w-6" />,
  [MortgageType.JUMBO]: <DollarSign className="h-6 w-6" />,
};

const loanTypeDescriptions: Record<string, string> = {
  [MortgageType.CONVENTIONAL]: 'Standard mortgage with competitive rates',
  [MortgageType.FHA]: 'Government-backed with flexible requirements',
  [MortgageType.VA]: 'No down payment for veterans',
  [MortgageType.USDA]: 'Zero down for rural properties',
  [MortgageType.JUMBO]: 'For high-value properties',
};

const StepPrep4LoanSummary: React.FC<StepPrep4LoanSummaryProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack,
  onProceedToApplication 
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        const summaryText = await generateLoanSummary(data);
        setSummary(summaryText);
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary('Thank you for completing your pre-evaluation! Based on the information you provided, you\'re in a great position to move forward.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateSummary();
  }, [data]);

  const approvalStrength = data.affordabilitySnapshot?.approvalStrengthScore || 0;
  const primaryBorrowerRec = data.primaryBorrowerOptimization?.bellaRecommendation || 
    (data.primaryBorrowerOptimization?.selected === 'me' ? 'You are the primary borrower.' : 
     data.primaryBorrowerOptimization?.selected === 'coBorrower' ? 'Co-borrower is the primary.' : 
     'No recommendation available.');
  const estimatedPayment = data.affordabilitySnapshot?.newEstimatedPayment || 0;
  
  // Get the selected mortgage type or fallback to suggestion
  const selectedMortgageType = data.mortgageType || (() => {
    if (data.isMilitary) return MortgageType.VA;
    if (data.isFirstTimeBuyer && (data.creditScore?.includes('640-699') || data.creditScore?.includes('580-639'))) {
      return MortgageType.FHA;
    }
    return MortgageType.CONVENTIONAL;
  })();

  // Calculate key metrics
  const propertyValue = data.loanPurpose === LoanPurpose.PURCHASE 
    ? (data.purchasePrice || data.subjectProperty?.value || 0)
    : (data.estimatedPropertyValue || data.subjectProperty?.value || 0);
  const loanAmount = data.loanAmount || (propertyValue - (data.downPayment || 0));
  const ltv = propertyValue > 0 ? Math.round((loanAmount / propertyValue) * 100) : 0;
  const monthlyIncome = (data.income || 0) / 12;
  const totalDebts = (data.debts?.carLoan || 0) + (data.debts?.creditCards || 0) + 
                     (data.debts?.studentLoans || 0) + (data.debts?.personalLoans || 0) + 
                     (data.debts?.childSupport || 0);
  const estimatedDTI = monthlyIncome > 0 ? Math.round(((totalDebts + estimatedPayment) / monthlyIncome) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Prep4Loan Summary"
        subtitle="Your pre-evaluation is complete!"
      />
      
      <div className="space-y-6 mt-6">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <p className="text-lg text-foreground">Generating your summary...</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-primary to-green-600 p-6 rounded-lg text-center">
                <p className="text-sm text-white/90 font-medium mb-2">Approval Strength</p>
                <p className="text-5xl font-bold text-white mb-2">{approvalStrength}</p>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${approvalStrength}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">Best Primary Borrower Suggestion</p>
                <p className="text-sm text-blue-800">{primaryBorrowerRec}</p>
              </div>

              {/* Loan Type Card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {loanTypeIcons[selectedMortgageType] && (
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {loanTypeIcons[selectedMortgageType]}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{selectedMortgageType}</p>
                      {data.mortgageType && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{loanTypeDescriptions[selectedMortgageType]}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-background/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">${(loanAmount / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">Loan Amt</p>
                  </div>
                  <div className="p-2 bg-background/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{ltv}%</p>
                    <p className="text-[10px] text-muted-foreground">LTV</p>
                  </div>
                  <div className="p-2 bg-background/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{estimatedDTI}%</p>
                    <p className="text-[10px] text-muted-foreground">DTI</p>
                  </div>
                  <div className="p-2 bg-background/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">${(estimatedPayment / 1).toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground">Est. Pmt</p>
                  </div>
                </div>
                {data.loanTerm && (
                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    {data.loanTerm} • {data.amortizationType || 'Fixed Rate'}
                  </div>
                )}
              </div>

              {/* Loan Type Benefits */}
              {selectedMortgageType && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <p className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4" /> Why {selectedMortgageType}?
                  </p>
                  <ul className="space-y-1 text-xs text-emerald-800">
                    {selectedMortgageType === MortgageType.VA && (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> No down payment required</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> No monthly mortgage insurance</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Competitive interest rates</li>
                      </>
                    )}
                    {selectedMortgageType === MortgageType.FHA && (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Low 3.5% down payment</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Flexible credit requirements</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Great for first-time buyers</li>
                      </>
                    )}
                    {selectedMortgageType === MortgageType.CONVENTIONAL && (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> PMI removable at 20% equity</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> No upfront funding fee</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Various term options</li>
                      </>
                    )}
                    {selectedMortgageType === MortgageType.USDA && (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> 100% financing available</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Lower mortgage insurance</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Below-market rates</li>
                      </>
                    )}
                    {selectedMortgageType === MortgageType.JUMBO && (
                      <>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Finance high-value homes</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Competitive rates available</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Flexible terms</li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <p className="font-semibold text-foreground mb-3">What To Expect Next</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Complete the full URLA Form 1003 application</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Submit required documents for verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Receive loan estimate and final approval</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Close on your new home!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="font-semibold text-yellow-900 mb-3">Required Documents</p>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Driver's License or State ID</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>W-2 Forms (last 2 years)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paystubs (covering 30-day period)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Bank Statements (last 3 months)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                <p className="font-semibold text-primary mb-3">Bella Voice Summary</p>
                <p className="text-sm text-foreground leading-relaxed">{summary}</p>
              </div>
            </motion.div>

            {onProceedToApplication && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onProceedToApplication}
                className="w-full bg-gradient-to-r from-primary via-primary to-green-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-600 hover:via-primary hover:to-primary transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-primary/40 shadow-lg hover:shadow-xl text-lg"
              >
                Apply Now → Prefill URLA 1003
              </motion.button>
            )}
          </>
        )}
      </div>

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default StepPrep4LoanSummary;

