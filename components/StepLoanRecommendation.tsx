import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { 
  Lightbulb, 
  Shield, 
  DollarSign, 
  Star, 
  Home, 
  FileCheck, 
  Check, 
  X, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  AlertCircle
} from './icons';
import type { FormData, CreditScore } from '../types';

// Loan Type Enum
export enum MortgageType {
  CONVENTIONAL = 'Conventional',
  FHA = 'FHA',
  VA = 'VA',
  USDA = 'USDA',
  JUMBO = 'Jumbo',
}

// Amortization Type
export enum AmortizationType {
  FIXED = 'Fixed Rate',
  ARM_5_1 = '5/1 ARM',
  ARM_7_1 = '7/1 ARM',
  ARM_10_1 = '10/1 ARM',
}

// Loan Term
export enum LoanTerm {
  THIRTY_YEAR = '30-Year',
  TWENTY_YEAR = '20-Year',
  FIFTEEN_YEAR = '15-Year',
  TEN_YEAR = '10-Year',
}

interface LoanRecommendation {
  type: MortgageType;
  score: number; // 0-100 eligibility score
  isEligible: boolean;
  reasons: string[];
  warnings: string[];
  estimatedRate?: string;
  estimatedPayment?: number;
  downPaymentRequired?: number;
  monthlyMI?: number;
}

interface StepLoanRecommendationProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Helper to convert credit score enum to numeric value
const getCreditScoreValue = (score: CreditScore | string | undefined): number => {
  if (!score) return 650;
  if (score.includes('Excellent') || score.includes('740')) return 760;
  if (score.includes('Good') || score.includes('700')) return 720;
  if (score.includes('Average') || score.includes('640')) return 670;
  if (score.includes('Fair') || score.includes('580')) return 610;
  return 650;
};

// Calculate DTI from form data
const calculateDTI = (data: FormData): number => {
  const monthlyIncome = (data.income || 0) / 12;
  if (monthlyIncome === 0) return 35; // Default assumption
  
  const totalDebts = (
    (data.debts?.carLoan || 0) +
    (data.debts?.creditCards || 0) +
    (data.debts?.studentLoans || 0) +
    (data.debts?.personalLoans || 0) +
    (data.debts?.childSupport || 0)
  );
  
  // Estimate new housing payment (rough: 0.6% of loan amount)
  const estimatedHousingPayment = (data.loanAmount || data.purchasePrice * 0.8) * 0.006;
  
  return Math.round(((totalDebts + estimatedHousingPayment) / monthlyIncome) * 100);
};

// Calculate LTV
const calculateLTV = (data: FormData): number => {
  const propertyValue = data.purchasePrice || data.estimatedPropertyValue || 0;
  const loanAmount = data.loanAmount || (propertyValue - (data.downPayment || 0));
  if (propertyValue === 0) return 80;
  return Math.round((loanAmount / propertyValue) * 100);
};

// Analyze eligibility for each loan type
const analyzeLoanEligibility = (data: FormData): LoanRecommendation[] => {
  const creditScore = getCreditScoreValue(data.creditScore);
  const dti = calculateDTI(data);
  const ltv = calculateLTV(data);
  const loanAmount = data.loanAmount || (data.purchasePrice - (data.downPayment || 0));
  const propertyValue = data.purchasePrice || data.estimatedPropertyValue || 400000;
  
  // 2024 conforming loan limit (baseline - varies by county)
  const conformingLimit = 766550;
  
  const recommendations: LoanRecommendation[] = [];
  
  // ============ CONVENTIONAL ============
  const convReasons: string[] = [];
  const convWarnings: string[] = [];
  let convScore = 70;
  let convEligible = true;
  
  if (creditScore >= 740) {
    convScore += 15;
    convReasons.push('Excellent credit qualifies you for best rates');
  } else if (creditScore >= 700) {
    convScore += 10;
    convReasons.push('Good credit score meets requirements');
  } else if (creditScore >= 620) {
    convScore += 5;
    convReasons.push('Credit score meets minimum requirement');
  } else {
    convEligible = false;
    convWarnings.push('Credit score below 620 minimum');
  }
  
  if (dti <= 36) {
    convScore += 10;
    convReasons.push('Low DTI ratio is favorable');
  } else if (dti <= 43) {
    convScore += 5;
  } else if (dti <= 50) {
    convWarnings.push('DTI above 43% may require compensating factors');
  } else {
    convEligible = false;
    convWarnings.push('DTI too high for conventional');
  }
  
  if (ltv <= 80) {
    convScore += 10;
    convReasons.push('20%+ down payment = No PMI required');
  } else if (ltv <= 95) {
    convReasons.push('PMI required until 20% equity');
  } else if (ltv <= 97) {
    convReasons.push('3% down payment option available');
  } else {
    convWarnings.push('LTV exceeds 97% maximum');
  }
  
  if (loanAmount > conformingLimit) {
    convEligible = false;
    convWarnings.push('Loan amount exceeds conforming limit');
  }
  
  recommendations.push({
    type: MortgageType.CONVENTIONAL,
    score: Math.min(convScore, 100),
    isEligible: convEligible,
    reasons: convReasons,
    warnings: convWarnings,
    downPaymentRequired: propertyValue * 0.03,
    monthlyMI: ltv > 80 ? Math.round(loanAmount * 0.005 / 12) : 0,
  });
  
  // ============ FHA ============
  const fhaReasons: string[] = [];
  const fhaWarnings: string[] = [];
  let fhaScore = 65;
  let fhaEligible = true;
  
  if (creditScore >= 580) {
    fhaScore += 15;
    fhaReasons.push('3.5% down payment with your credit score');
  } else if (creditScore >= 500) {
    fhaScore += 5;
    fhaReasons.push('10% down payment required with this credit score');
    fhaWarnings.push('Credit score 500-579 requires 10% down');
  } else {
    fhaEligible = false;
    fhaWarnings.push('Credit score below 500 minimum');
  }
  
  if (dti <= 43) {
    fhaScore += 10;
  } else if (dti <= 50) {
    fhaScore += 5;
    fhaReasons.push('FHA allows higher DTI with compensating factors');
  } else if (dti <= 57) {
    fhaWarnings.push('DTI 50-57% requires strong compensating factors');
  } else {
    fhaEligible = false;
    fhaWarnings.push('DTI exceeds FHA maximum');
  }
  
  if (data.isFirstTimeBuyer) {
    fhaScore += 10;
    fhaReasons.push('Great option for first-time buyers');
  }
  
  // FHA loan limits vary by county, using baseline
  const fhaLimit = 498257; // 2024 floor
  if (loanAmount > fhaLimit * 1.5) { // Rough high-cost area check
    fhaWarnings.push('May exceed FHA loan limits for your area');
  }
  
  fhaReasons.push('Upfront MIP (1.75%) + Annual MIP required');
  
  recommendations.push({
    type: MortgageType.FHA,
    score: Math.min(fhaScore, 100),
    isEligible: fhaEligible,
    reasons: fhaReasons,
    warnings: fhaWarnings,
    downPaymentRequired: propertyValue * (creditScore >= 580 ? 0.035 : 0.10),
    monthlyMI: Math.round(loanAmount * 0.0055 / 12), // Approximate annual MIP
  });
  
  // ============ VA ============
  const vaReasons: string[] = [];
  const vaWarnings: string[] = [];
  let vaScore = 0;
  let vaEligible = false;
  
  if (data.isMilitary === true) {
    vaEligible = true;
    vaScore = 90;
    vaReasons.push('No down payment required');
    vaReasons.push('No monthly mortgage insurance');
    vaReasons.push('Competitive interest rates');
    vaReasons.push('More lenient credit requirements');
    
    if (creditScore >= 620) {
      vaScore += 5;
    } else {
      vaWarnings.push('Some lenders require 620+ credit');
    }
    
    if (dti <= 41) {
      vaScore += 5;
    } else {
      vaWarnings.push('DTI above 41% requires strong residual income');
    }
    
    vaReasons.push('VA funding fee can be financed into loan');
  } else {
    vaWarnings.push('VA loans require military service eligibility');
  }
  
  recommendations.push({
    type: MortgageType.VA,
    score: Math.min(vaScore, 100),
    isEligible: vaEligible,
    reasons: vaReasons,
    warnings: vaWarnings,
    downPaymentRequired: 0,
    monthlyMI: 0,
  });
  
  // ============ USDA ============
  const usdaReasons: string[] = [];
  const usdaWarnings: string[] = [];
  let usdaScore = 50;
  let usdaEligible = true;
  
  // USDA requires rural location - we'd need to verify
  usdaWarnings.push('Property must be in USDA-eligible rural area');
  usdaWarnings.push('Income limits apply based on area median income');
  
  if (creditScore >= 640) {
    usdaScore += 15;
    usdaReasons.push('Credit score meets USDA requirements');
  } else {
    usdaWarnings.push('Credit below 640 requires manual underwriting');
  }
  
  if (dti <= 41) {
    usdaScore += 10;
  } else {
    usdaWarnings.push('DTI above 41% requires compensating factors');
  }
  
  usdaReasons.push('No down payment required');
  usdaReasons.push('Lower mortgage insurance than FHA');
  
  recommendations.push({
    type: MortgageType.USDA,
    score: Math.min(usdaScore, 100),
    isEligible: usdaEligible,
    reasons: usdaReasons,
    warnings: usdaWarnings,
    downPaymentRequired: 0,
    monthlyMI: Math.round(loanAmount * 0.0035 / 12),
  });
  
  // ============ JUMBO ============
  const jumboReasons: string[] = [];
  const jumboWarnings: string[] = [];
  let jumboScore = 50;
  let jumboEligible = loanAmount > conformingLimit;
  
  if (loanAmount > conformingLimit) {
    jumboScore = 70;
    jumboReasons.push('Loan amount exceeds conforming limits');
    
    if (creditScore >= 700) {
      jumboScore += 15;
      jumboReasons.push('Credit score meets jumbo requirements');
    } else {
      jumboWarnings.push('Most jumbo lenders require 700+ credit');
    }
    
    if (ltv <= 80) {
      jumboScore += 10;
      jumboReasons.push('20%+ down payment is typical for jumbo');
    } else {
      jumboWarnings.push('Higher down payment usually required');
    }
    
    if (dti <= 43) {
      jumboScore += 5;
    } else {
      jumboWarnings.push('Jumbo loans typically require lower DTI');
    }
    
    jumboReasons.push('Larger cash reserves typically required');
  } else {
    jumboWarnings.push('Loan amount within conforming limits');
  }
  
  recommendations.push({
    type: MortgageType.JUMBO,
    score: Math.min(jumboScore, 100),
    isEligible: jumboEligible,
    reasons: jumboReasons,
    warnings: jumboWarnings,
    downPaymentRequired: propertyValue * 0.20,
    monthlyMI: 0,
  });
  
  // Sort by score (highest first)
  return recommendations.sort((a, b) => b.score - a.score);
};

const loanTypeIcons: Record<MortgageType, React.ReactNode> = {
  [MortgageType.CONVENTIONAL]: <Home className="h-6 w-6" />,
  [MortgageType.FHA]: <Shield className="h-6 w-6" />,
  [MortgageType.VA]: <Star className="h-6 w-6" />,
  [MortgageType.USDA]: <FileCheck className="h-6 w-6" />,
  [MortgageType.JUMBO]: <DollarSign className="h-6 w-6" />,
};

const StepLoanRecommendation: React.FC<StepLoanRecommendationProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const recommendations = useMemo(() => analyzeLoanEligibility(data), [data]);
  const [selectedType, setSelectedType] = useState<MortgageType | ''>(data.mortgageType as MortgageType || '');
  const [expandedType, setExpandedType] = useState<MortgageType | null>(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  const topRecommendation = recommendations[0];
  const eligibleOptions = recommendations.filter(r => r.isEligible && r.score >= 50);
  const creditScore = getCreditScoreValue(data.creditScore);
  const dti = calculateDTI(data);
  const ltv = calculateLTV(data);

  const handleSelect = (type: MortgageType) => {
    setSelectedType(type);
    onChange('mortgageType', type);
    
    // Also set recommended term and rate type, and mark source as prep4loan
    onChange('loanTerm', LoanTerm.THIRTY_YEAR);
    onChange('amortizationType', AmortizationType.FIXED);
    onChange('loanTypeSource', 'prep4loan');
  };

  const isComplete = selectedType !== '';

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Bella's Loan Recommendation" 
        subtitle="Based on your profile, here's what we recommend"
      />

      {/* Your Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/50 rounded-xl p-4 mb-4 grid grid-cols-3 gap-4 text-center"
      >
        <div>
          <p className="text-xs text-muted-foreground">Credit Score</p>
          <p className="text-lg font-bold text-foreground">{data.creditScore || '~650'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Est. DTI</p>
          <p className="text-lg font-bold text-foreground">{dti}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">LTV</p>
          <p className="text-lg font-bold text-foreground">{ltv}%</p>
        </div>
      </motion.div>

      {/* Top Recommendation */}
      {topRecommendation && topRecommendation.isEligible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative p-5 rounded-2xl border-2 mb-4 cursor-pointer transition-all ${
            selectedType === topRecommendation.type
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-400'
          }`}
          onClick={() => handleSelect(topRecommendation.type)}
        >
          <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Best Match
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              {loanTypeIcons[topRecommendation.type]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">{topRecommendation.type}</h3>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {topRecommendation.score}% match
                </span>
              </div>
              
              <div className="mt-3 space-y-1">
                {topRecommendation.reasons.slice(0, 3).map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
              
              {topRecommendation.warnings.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-200">
                  {topRecommendation.warnings.slice(0, 2).map((warning, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-amber-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-right">
              {selectedType === topRecommendation.type && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Other Eligible Options */}
      {eligibleOptions.length > 1 && (
        <>
          <button
            onClick={() => setShowAllOptions(!showAllOptions)}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2 mb-3"
          >
            {showAllOptions ? 'Hide' : 'Show'} {eligibleOptions.length - 1} other option{eligibleOptions.length > 2 ? 's' : ''}
            {showAllOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          <AnimatePresence>
            {showAllOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {eligibleOptions.slice(1).map((rec, index) => (
                  <motion.div
                    key={rec.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedType === rec.type
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                    onClick={() => handleSelect(rec.type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedType === rec.type ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {loanTypeIcons[rec.type]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{rec.type}</h4>
                          <p className="text-xs text-muted-foreground">{rec.score}% match</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedType(expandedType === rec.type ? null : rec.type);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        {expandedType === rec.type ? 'Less' : 'Details'}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {expandedType === rec.type && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-border text-sm space-y-1"
                        >
                          {rec.reasons.map((r, i) => (
                            <div key={i} className="flex items-center gap-2 text-muted-foreground">
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span>{r}</span>
                            </div>
                          ))}
                          {rec.warnings.map((w, i) => (
                            <div key={i} className="flex items-center gap-2 text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              <span>{w}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
      >
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">This is a preliminary recommendation</p>
          <p className="mt-1">
            Your loan officer will confirm the best option during your full application. 
            Rates and terms are subject to final underwriting approval.
          </p>
        </div>
      </motion.div>

      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
    </div>
  );
};

export default StepLoanRecommendation;

