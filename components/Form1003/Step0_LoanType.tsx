import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { 
  Lightbulb, 
  Shield, 
  DollarSign, 
  Star, 
  Home, 
  FileCheck, 
  Check, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  Edit2,
  HelpCircle
} from '../icons';
import type { FormData } from '../../types';
import { MortgageType, AmortizationType, LoanTerm, CreditScore } from '../../types';

interface Step0LoanTypeProps {
  data: FormData;
  onDataChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

interface LoanTypeInfo {
  type: MortgageType;
  label: string;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
  eligibility: string;
}

const loanTypeInfo: LoanTypeInfo[] = [
  {
    type: MortgageType.CONVENTIONAL,
    label: 'Conventional',
    icon: <Home className="h-5 w-5" />,
    description: 'Standard mortgage not backed by a government agency',
    highlights: [
      'Down payment as low as 3%',
      'No upfront mortgage insurance',
      'PMI removable at 20% equity',
    ],
    eligibility: 'Credit score 620+, DTI typically under 43%',
  },
  {
    type: MortgageType.FHA,
    label: 'FHA',
    icon: <Shield className="h-5 w-5" />,
    description: 'Government-insured loan with flexible requirements',
    highlights: [
      'Down payment as low as 3.5%',
      'Credit scores as low as 580',
      'Higher DTI ratios allowed',
    ],
    eligibility: 'Credit score 580+ for 3.5% down',
  },
  {
    type: MortgageType.VA,
    label: 'VA',
    icon: <Star className="h-5 w-5" />,
    description: 'For veterans, active military, and eligible spouses',
    highlights: [
      'No down payment required',
      'No PMI ever',
      'Competitive interest rates',
    ],
    eligibility: 'Must have Certificate of Eligibility (COE)',
  },
  {
    type: MortgageType.USDA,
    label: 'USDA',
    icon: <FileCheck className="h-5 w-5" />,
    description: 'For rural and suburban home buyers',
    highlights: [
      'No down payment required',
      'Below-market interest rates',
      'Lower mortgage insurance',
    ],
    eligibility: 'Property in eligible rural area, income limits apply',
  },
  {
    type: MortgageType.JUMBO,
    label: 'Jumbo',
    icon: <DollarSign className="h-5 w-5" />,
    description: 'For loan amounts exceeding conforming limits',
    highlights: [
      'Finance high-value properties',
      'Loan amounts over $766,550',
      'Various term options',
    ],
    eligibility: 'Higher credit score (700+), larger reserves required',
  },
];

// Helper to get credit score value
const getCreditScoreValue = (score: CreditScore | string | undefined): number => {
  if (!score) return 650;
  if (score.includes('Excellent') || score.includes('740')) return 760;
  if (score.includes('Good') || score.includes('700')) return 720;
  if (score.includes('Average') || score.includes('640')) return 670;
  if (score.includes('Fair') || score.includes('580')) return 610;
  return 650;
};

// Analyze and recommend loan types based on available data
const getRecommendations = (data: FormData): MortgageType[] => {
  const recommendations: MortgageType[] = [];
  const creditScore = getCreditScoreValue(data.creditScore);
  const loanAmount = data.loanAmount || (data.purchasePrice - (data.downPayment || 0));
  const conformingLimit = 766550;
  
  // VA if military
  if (data.isMilitary === true) {
    recommendations.push(MortgageType.VA);
  }
  
  // Jumbo if high loan amount
  if (loanAmount > conformingLimit) {
    recommendations.push(MortgageType.JUMBO);
  }
  
  // FHA for first-time buyers or lower credit
  if (data.isFirstTimeBuyer === true || creditScore < 680) {
    recommendations.push(MortgageType.FHA);
  }
  
  // Conventional for good credit
  if (creditScore >= 680 && loanAmount <= conformingLimit) {
    recommendations.push(MortgageType.CONVENTIONAL);
  }
  
  // USDA as an option (would need location verification)
  if (loanAmount <= conformingLimit && !recommendations.includes(MortgageType.VA)) {
    recommendations.push(MortgageType.USDA);
  }
  
  // Default to Conventional and FHA if no specific recommendations
  if (recommendations.length === 0) {
    recommendations.push(MortgageType.CONVENTIONAL, MortgageType.FHA);
  }
  
  return [...new Set(recommendations)]; // Remove duplicates
};

const Step0LoanType: React.FC<Step0LoanTypeProps> = ({ data, onDataChange, onNext, onBack }) => {
  // Check if loan type was pre-selected from Prep4Loan
  const hasPreselectedType = data.mortgageType && data.loanTypeSource === 'prep4loan';
  
  const [selectedType, setSelectedType] = useState<MortgageType | ''>(data.mortgageType || '');
  const [isEditing, setIsEditing] = useState(!hasPreselectedType);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<LoanTerm>(data.loanTerm || LoanTerm.THIRTY_YEAR);
  const [selectedAmortization, setSelectedAmortization] = useState<AmortizationType>(
    data.amortizationType || AmortizationType.FIXED
  );
  
  const recommendations = useMemo(() => getRecommendations(data), [data]);
  
  // Get info for current selection
  const currentTypeInfo = loanTypeInfo.find(l => l.type === selectedType);
  const preselectedInfo = loanTypeInfo.find(l => l.type === data.mortgageType);

  const handleSelectType = (type: MortgageType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    onDataChange({
      mortgageType: selectedType as MortgageType,
      loanTerm: selectedTerm,
      amortizationType: selectedAmortization,
      loanTypeSource: hasPreselectedType ? 'prep4loan' : 'urla1003',
    });
    onNext();
  };

  const isComplete = selectedType !== '';

  // Pre-selected confirmation view
  if (hasPreselectedType && !isEditing && preselectedInfo) {
    return (
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
        <StepHeader 
          title="Your Loan Type" 
          subtitle="Based on your Prep4Loan evaluation"
        />

        {/* Prep4Loan Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-800">Recommended by Bella</p>
              <p className="text-sm text-emerald-700 mt-1">
                Based on your credit profile, income, and goals from Prep4Loan
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selected Loan Type Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl border-2 border-primary bg-primary/5 mb-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              {preselectedInfo.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">{preselectedInfo.label}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Selected
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{preselectedInfo.description}</p>
              
              <div className="mt-3 space-y-1">
                {preselectedInfo.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loan Terms Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground">Loan Term</p>
            <p className="font-semibold text-foreground">{data.loanTerm || '30 Years'}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground">Rate Type</p>
            <p className="font-semibold text-foreground">{data.amortizationType || 'Fixed Rate'}</p>
          </div>
        </div>

        {/* Change Option */}
        <button
          onClick={() => {
            setIsEditing(true);
            setSelectedType(data.mortgageType || '');
          }}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-2 mb-4 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          Change loan type
        </button>

        <StepNavigation 
          onNext={handleContinue} 
          onBack={onBack} 
          isNextDisabled={false}
          nextLabel="Continue to Application"
        />
      </div>
    );
  }

  // Selection view (for direct Home Journey access or editing)
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Select Your Loan Type" 
        subtitle="Choose the mortgage program that fits your needs"
      />

      {/* Recommendations based on available data */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 mb-4"
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Bella's suggestion:</span>{' '}
                {data.isMilitary === true 
                  ? 'As a veteran/military member, VA may offer the best benefits!' 
                  : data.isFirstTimeBuyer === true
                  ? 'As a first-time buyer, FHA or Conventional with low down payment could work well.'
                  : 'Based on your profile, these options may fit well.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loan Type Options */}
      <div className="space-y-3">
        {loanTypeInfo.slice(0, showAllOptions ? undefined : 3).map((loan, index) => {
          const isRecommended = recommendations.includes(loan.type);
          const isSelected = selectedType === loan.type;
          
          return (
            <motion.button
              key={loan.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectType(loan.type)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : isRecommended
                  ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-400'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {loan.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{loan.label}</h4>
                    {isRecommended && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Suggested
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{loan.description}</p>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2 border-t border-border/50"
                    >
                      <ul className="space-y-1">
                        {loan.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                            <Check className="h-3 w-3 text-emerald-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 italic">{loan.eligibility}</p>
                    </motion.div>
                  )}
                </div>
                
                {isSelected && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Show More/Less */}
      {loanTypeInfo.length > 3 && (
        <button
          onClick={() => setShowAllOptions(!showAllOptions)}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground py-3 mt-2"
        >
          {showAllOptions ? (
            <>Show less <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Show more options <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      )}

      {/* Loan Terms Selection */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 pt-5 border-t border-border"
        >
          <h4 className="font-medium text-foreground mb-3">Loan Terms</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Loan Term */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Term Length</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value as LoanTerm)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value={LoanTerm.THIRTY_YEAR}>30 Years</option>
                <option value={LoanTerm.TWENTY_FIVE_YEAR}>25 Years</option>
                <option value={LoanTerm.TWENTY_YEAR}>20 Years</option>
                <option value={LoanTerm.FIFTEEN_YEAR}>15 Years</option>
                <option value={LoanTerm.TEN_YEAR}>10 Years</option>
              </select>
            </div>
            
            {/* Rate Type */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Rate Type</label>
              <select
                value={selectedAmortization}
                onChange={(e) => setSelectedAmortization(e.target.value as AmortizationType)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value={AmortizationType.FIXED}>Fixed Rate</option>
                <option value={AmortizationType.ARM_5_1}>5/1 ARM</option>
                <option value={AmortizationType.ARM_7_1}>7/1 ARM</option>
                <option value={AmortizationType.ARM_10_1}>10/1 ARM</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-3 bg-muted/50 rounded-lg flex items-start gap-2"
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Not sure which to choose? Your loan officer will help confirm the best option based on your complete application.
        </p>
      </motion.div>

      <StepNavigation 
        onNext={handleContinue} 
        onBack={hasPreselectedType ? () => setIsEditing(false) : onBack} 
        isNextDisabled={!isComplete}
        backLabel={hasPreselectedType ? 'Cancel' : 'Back'}
      />
    </div>
  );
};

export default Step0LoanType;

