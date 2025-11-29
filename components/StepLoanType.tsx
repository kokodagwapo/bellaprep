import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Lightbulb, Shield, DollarSign, Star, Home, FileCheck, HelpCircle } from './icons';

// Loan Type Enum
export enum MortgageType {
  CONVENTIONAL = 'Conventional',
  FHA = 'FHA',
  VA = 'VA',
  USDA = 'USDA',
  JUMBO = 'Jumbo',
  OTHER = 'Other',
}

interface StepLoanTypeProps {
  data: { 
    mortgageType?: MortgageType | '';
    isMilitary?: boolean | null;
    isFirstTimeBuyer?: boolean | null;
    location?: string;
    purchasePrice?: number;
    loanAmount?: number;
    creditScore?: string;
  };
  onChange: (field: string, value: MortgageType | string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface LoanTypeOption {
  value: MortgageType;
  label: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
  eligibility?: string;
  bestFor?: string;
}

const loanTypeOptions: LoanTypeOption[] = [
  {
    value: MortgageType.CONVENTIONAL,
    label: 'Conventional',
    icon: <Home className="h-6 w-6" />,
    description: 'Standard mortgage not backed by a government agency',
    highlights: [
      'Down payment as low as 3%',
      'No upfront mortgage insurance',
      'PMI removable at 20% equity',
      'Flexible property types',
    ],
    eligibility: 'Credit score 620+, DTI typically under 43%',
    bestFor: 'Borrowers with good credit and stable income',
  },
  {
    value: MortgageType.FHA,
    label: 'FHA',
    icon: <Shield className="h-6 w-6" />,
    description: 'Government-insured loan with flexible requirements',
    highlights: [
      'Down payment as low as 3.5%',
      'Credit scores as low as 580',
      'Higher DTI ratios allowed',
      'Gift funds allowed for down payment',
    ],
    eligibility: 'Credit score 580+ for 3.5% down, 500-579 for 10% down',
    bestFor: 'First-time buyers or those with lower credit scores',
  },
  {
    value: MortgageType.VA,
    label: 'VA',
    icon: <Star className="h-6 w-6" />,
    description: 'For veterans, active military, and eligible spouses',
    highlights: [
      'No down payment required',
      'No PMI ever',
      'Competitive interest rates',
      'No prepayment penalty',
    ],
    eligibility: 'Must have Certificate of Eligibility (COE)',
    bestFor: 'Veterans and active-duty service members',
  },
  {
    value: MortgageType.USDA,
    label: 'USDA',
    icon: <FileCheck className="h-6 w-6" />,
    description: 'For rural and suburban home buyers',
    highlights: [
      'No down payment required',
      'Below-market interest rates',
      'Lower mortgage insurance',
      'Flexible credit guidelines',
    ],
    eligibility: 'Property in eligible rural area, income limits apply',
    bestFor: 'Buyers in rural areas with moderate income',
  },
  {
    value: MortgageType.JUMBO,
    label: 'Jumbo',
    icon: <DollarSign className="h-6 w-6" />,
    description: 'For loan amounts exceeding conforming limits',
    highlights: [
      'Finance high-value properties',
      'Loan amounts over $766,550',
      'Competitive rates available',
      'Various term options',
    ],
    eligibility: 'Higher credit score (700+), larger reserves required',
    bestFor: 'High-value property purchases',
  },
];

const StepLoanType: React.FC<StepLoanTypeProps> = ({ data, onChange, onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState<MortgageType | ''>(data.mortgageType || '');
  const [showDetails, setShowDetails] = useState<MortgageType | null>(null);

  // Determine recommended loan types based on user profile
  const getRecommendations = () => {
    const recommendations: MortgageType[] = [];
    
    // VA if military
    if (data.isMilitary) {
      recommendations.push(MortgageType.VA);
    }
    
    // FHA for first-time buyers or lower credit
    if (data.isFirstTimeBuyer || data.creditScore?.includes('Fair') || data.creditScore?.includes('Average')) {
      recommendations.push(MortgageType.FHA);
    }
    
    // Jumbo if high loan amount (2024 conforming limit is $766,550 in most areas)
    if (data.loanAmount && data.loanAmount > 766550) {
      recommendations.push(MortgageType.JUMBO);
    }
    
    // Conventional as default recommendation for good credit
    if (data.creditScore?.includes('Good') || data.creditScore?.includes('Excellent')) {
      recommendations.push(MortgageType.CONVENTIONAL);
    }
    
    // If no specific recommendations, suggest Conventional and FHA
    if (recommendations.length === 0) {
      recommendations.push(MortgageType.CONVENTIONAL, MortgageType.FHA);
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  const handleSelect = (value: MortgageType) => {
    setSelectedType(value);
    onChange('mortgageType', value);
  };

  const isComplete = selectedType !== '';

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="What type of mortgage are you looking for?" 
        subtitle="Select the loan program that best fits your needs"
      />

      {/* Bella's Recommendation */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-800">Bella's Recommendation</p>
              <p className="text-sm text-emerald-700 mt-1">
                Based on your profile, {recommendations.length > 1 ? 'these options' : 'this option'} may be a good fit:{' '}
                <span className="font-semibold">
                  {recommendations.map(r => r).join(' or ')}
                </span>
                {data.isMilitary && (
                  <span className="block mt-1 text-emerald-600">
                    ✓ As a veteran/military member, you may qualify for VA benefits!
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loan Type Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {loanTypeOptions.map((option, index) => {
          const isRecommended = recommendations.includes(option.value);
          const isSelected = selectedType === option.value;
          
          return (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative"
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Recommended
                </div>
              )}
              <button
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : isRecommended
                    ? 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400'
                    : 'border-border hover:border-primary/50 bg-background'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{option.label}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(showDetails === option.value ? null : option.value);
                  }}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <HelpCircle className="h-3 w-3" />
                  {showDetails === option.value ? 'Hide details' : 'Learn more'}
                </button>
              </button>
              
              {/* Expanded Details */}
              <AnimatePresence>
                {showDetails === option.value && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border text-xs space-y-2">
                      <div>
                        <p className="font-medium text-foreground">Key Benefits:</p>
                        <ul className="mt-1 space-y-1">
                          {option.highlights.map((h, i) => (
                            <li key={i} className="text-muted-foreground flex items-start gap-1">
                              <span className="text-primary">✓</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Eligibility:</p>
                        <p className="text-muted-foreground">{option.eligibility}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Best For:</p>
                        <p className="text-muted-foreground">{option.bestFor}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Not sure which to choose?</p>
            <p className="mt-1">
              Your loan officer can help determine the best option based on your complete financial picture. 
              Many borrowers compare multiple loan types during the application process.
            </p>
          </div>
        </div>
      </motion.div>

      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
    </div>
  );
};

export default StepLoanType;

