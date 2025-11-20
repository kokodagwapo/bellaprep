import React, { useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepContactProps {
  data: { email: string; phoneNumber: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepContact: React.FC<StepContactProps> = ({ data, onChange, onNext, onBack }) => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isPhoneValid = data.phoneNumber.length > 5;

  return (
    <div>
      <StepHeader 
        title="How can we reach you?"
        subtitle="We'll use this to send your results and get in touch."
      />
      <div className="space-y-4 mt-4 sm:mt-6">
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Email Address</label>
          <input
            ref={emailInputRef}
            type="email"
            id="email"
            placeholder="your.email@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-4 py-3 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
            style={{ fontSize: '16px' }}
            aria-label="Email Address"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="(555) 123-4567"
            value={data.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
            style={{ fontSize: '16px' }}
            aria-label="Phone Number"
            required
          />
        </div>
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isEmailValid || !isPhoneValid} nextLabel="Get My Summary"/>
    </div>
  );
};

export default StepContact;