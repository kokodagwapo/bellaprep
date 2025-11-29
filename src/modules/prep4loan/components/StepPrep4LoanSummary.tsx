import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { generateLoanSummary } from '../services/geminiService';
import type { FormData } from '../types';

interface StepPrep4LoanSummaryProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  onProceedToApplication?: () => void;
}

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
  
  // Determine loan type suggestion
  const loanTypeSuggestion = (() => {
    if (data.isMilitary) return 'VA Loan';
    if (data.isFirstTimeBuyer && (data.creditScore?.includes('640-699') || data.creditScore?.includes('580-639'))) {
      return 'FHA Loan';
    }
    return 'Conventional Loan';
  })();

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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium mb-1">Estimated Payment</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${estimatedPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-green-700 mt-1">per month</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium mb-1">Loan Type Suggestion</p>
                  <p className="text-2xl font-bold text-purple-900">{loanTypeSuggestion}</p>
                </div>
              </div>

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

