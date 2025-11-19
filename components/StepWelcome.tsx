import React from 'react';
import StepNavigation from './StepNavigation';

interface StepWelcomeProps {
  onNext: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext }) => {
  return (
    <div className="text-center flex flex-col justify-center" style={{minHeight: '400px'}}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Discover Mortgage Possibilities</h1>
        <p className="text-muted-foreground text-lg mb-8">Just answer a few questions and you'll get real mortgage rates in minutes. It's that easy.</p>
      </div>
      <StepNavigation onNext={onNext} nextLabel="Get Started" />
    </div>
  );
};

export default StepWelcome;