import React, {useEffect, useRef} from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepLoanAmountProps {
  data: { loanAmount: number };
  onChange: (data: { loanAmount?: number }) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepBorrowAmount: React.FC<StepLoanAmountProps> = ({ data, onChange, onNext, onBack }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isFormValid = data.loanAmount > 0;

  const formatNumber = (num: number) => {
    return num === 0 ? '' : num.toLocaleString('en-US');
  };

  const parseNumber = (str: string) => {
    return parseInt(str.replace(/,/g, ''), 10) || 0;
  };

  const handleValueChange = (field: 'loanAmount', value: string) => {
    onChange({ [field]: parseNumber(value) });
  };

  return (
    <div>
      <StepHeader
        title="Confirm your loan amount"
        subtitle="We've calculated this based on your purchase price and down payment. You can adjust it if needed."
      />
      <div className="space-y-4">
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-muted-foreground mb-1">Loan Amount</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-muted-foreground sm:text-lg">$</span>
            </div>
            <input
              ref={inputRef}
              id="loanAmount"
              type="text"
              inputMode="numeric"
              placeholder="400,000"
              value={formatNumber(data.loanAmount)}
              onChange={(e) => handleValueChange('loanAmount', e.target.value)}
              className="w-full px-4 py-3 pl-8 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
              style={{ fontSize: '16px' }}
              aria-label="Loan Amount"
            />
          </div>
        </div>
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isFormValid} />
    </div>
  );
};

export default StepBorrowAmount;