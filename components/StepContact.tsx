import React, { useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { Lightbulb } from './icons';

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
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4">
        <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold">Bella's Insight:</span> We'll use this information to send you personalized loan options and keep you updated on your application progress. Make sure your email and phone number are current!
        </p>
      </div>
      
      <div className="space-y-3 mt-3 sm:mt-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
          <input
            ref={emailInputRef}
            type="email"
            id="email"
            placeholder="your.email@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[40px] sm:min-h-[42px]"
            style={{ fontSize: '16px' }}
            aria-label="Email Address"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="(555) 123-4567"
            value={data.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[40px] sm:min-h-[42px]"
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