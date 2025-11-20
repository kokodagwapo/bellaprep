import React from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepPricingProps {
  data: { purchasePrice: number, downPayment: number };
  onChange: (data: { purchasePrice?: number, downPayment?: number }) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPricing: React.FC<StepPricingProps> = ({ data, onChange, onNext, onBack }) => {
  const isFormValid = data.purchasePrice > 0 && data.downPayment >= 0 && data.downPayment < data.purchasePrice;

  const formatNumber = (num: number) => {
    return num === 0 ? '' : num.toLocaleString('en-US');
  };

  const parseNumber = (str: string) => {
    return parseInt(str.replace(/,/g, ''), 10) || 0;
  };

  const handleValueChange = (field: 'purchasePrice' | 'downPayment', value: string) => {
    onChange({ [field]: parseNumber(value) });
  };

  return (
    <div className="px-2 sm:px-0">
      <StepHeader
        title="What is your estimated purchase price?"
      />
      <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        <div>
          <label htmlFor="purchasePrice" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Purchase Price</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
              <span className="text-muted-foreground text-base sm:text-lg">$</span>
            </div>
            <input
              id="purchasePrice"
              type="text"
              inputMode="numeric"
              placeholder="500,000"
              value={formatNumber(data.purchasePrice)}
              onChange={(e) => handleValueChange('purchasePrice', e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-3 pl-7 sm:pl-8 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
              style={{ fontSize: '16px' }}
              aria-label="Purchase Price"
            />
          </div>
        </div>
        <div>
          <label htmlFor="downPayment" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Down Payment</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
              <span className="text-muted-foreground text-base sm:text-lg">$</span>
            </div>
            <input
              id="downPayment"
              type="text"
              inputMode="numeric"
              placeholder="100,000"
              value={formatNumber(data.downPayment)}
              onChange={(e) => handleValueChange('downPayment', e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-3 pl-7 sm:pl-8 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
              style={{ fontSize: '16px' }}
              aria-label="Down Payment"
            />
          </div>
        </div>
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isFormValid} />
    </div>
  );
};

export default StepPricing;