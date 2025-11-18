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
      <div className="space-y-4">
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-4 py-3 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
          aria-label="Email Address"
          required
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={data.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          className="w-full px-4 py-3 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
          aria-label="Phone Number"
          required
        />
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isEmailValid || !isPhoneValid} nextLabel="Get My Summary"/>
    </div>
  );
};

export default StepContact;