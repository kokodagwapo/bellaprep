import React from 'react';
import StepNavigation from './StepNavigation';

interface StepWelcomeProps {
  onNext: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext }) => {
  return (
    <div className="text-center flex flex-col justify-center" style={{minHeight: '300px'}}>
      <div className="px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Discover Mortgage Possibilities</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-2">Just answer a few questions and you'll get real mortgage rates in minutes. It's that easy.</p>
      </div>
      <div className="px-4 sm:px-0 mt-4 sm:mt-6">
        {onNext && (
          <button
            onClick={onNext}
            className="w-full sm:w-auto sm:min-w-[200px] mx-auto bg-primary text-primary-foreground font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default StepWelcome;