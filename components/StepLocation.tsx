import React, { useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepLocationProps {
  data: { location: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepLocation: React.FC<StepLocationProps> = ({ data, onChange, onNext, onBack }) => {
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    locationInputRef.current?.focus();
  }, []);

  const isLocationValid = data.location.includes(',');

  return (
    <div>
      <StepHeader 
        title="In what city and state are you looking to purchase?"
      />
      <input
        ref={locationInputRef}
        type="text"
        placeholder="City, ST"
        value={data.location}
        onChange={(e) => onChange('location', e.target.value)}
        className="w-full px-4 py-3 text-lg border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200"
        aria-label="City and State"
        required
      />
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isLocationValid} />
    </div>
  );
};

export default StepLocation;