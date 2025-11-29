import React from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepRefinanceDetailsProps {
  data: { estimatedPropertyValue: number, loanAmount: number };
  onChange: (data: { estimatedPropertyValue?: number, loanAmount?: number }) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepRefinanceDetails: React.FC<StepRefinanceDetailsProps> = ({ data, onChange, onNext, onBack }) => {
  const isFormValid = data.estimatedPropertyValue > 0 && data.loanAmount > 0 && data.loanAmount <= data.estimatedPropertyValue;

  const formatNumber = (num: number) => {
    return num === 0 ? '' : num.toLocaleString('en-US');
  };

  const parseNumber = (str: string) => {
    return parseInt(str.replace(/,/g, ''), 10) || 0;
  };

  const handleValueChange = (field: 'estimatedPropertyValue' | 'loanAmount', value: string) => {
    onChange({ [field]: parseNumber(value) });
  };

  return (
    <div>
      <StepHeader
        title="Tell us about your property"
        subtitle="This will help us determine your refinance options."
      />
      <div className="space-y-4">
        <div>
          <label htmlFor="estimatedPropertyValue" className="block text-sm font-medium text-muted-foreground mb-1">Estimated Property Value</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-muted-foreground sm:text-lg">$</span>
            </div>
            <input
              id="estimatedPropertyValue"
              type="text"
              inputMode="numeric"
              placeholder="600,000"
              value={formatNumber(data.estimatedPropertyValue)}
              onChange={(e) => handleValueChange('estimatedPropertyValue', e.target.value)}
              className="w-full px-4 py-3 pl-8 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
              aria-label="Estimated Property Value"
            />
          </div>
        </div>
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-muted-foreground mb-1">Desired Loan Amount</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-muted-foreground sm:text-lg">$</span>
            </div>
            <input
              id="loanAmount"
              type="text"
              inputMode="numeric"
              placeholder="450,000"
              value={formatNumber(data.loanAmount)}
              onChange={(e) => handleValueChange('loanAmount', e.target.value)}
              className="w-full px-4 py-3 pl-8 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
              aria-label="Desired Loan Amount"
            />
          </div>
        </div>
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isFormValid} />
    </div>
  );
};

export default StepRefinanceDetails;