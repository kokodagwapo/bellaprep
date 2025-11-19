import React from 'react';
import StepNavigation from './StepNavigation';

interface StepWelcomeProps {
  onNext: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext }) => {
  const handleClick = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="text-center flex flex-col justify-center items-center" style={{minHeight: '400px'}}>
      <div className="px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Discover Mortgage Possibilities</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-2">Just answer a few questions and you'll get real mortgage rates in minutes. It's that easy.</p>
      </div>
      <div className="px-4 sm:px-0 mt-4 sm:mt-6 w-full flex justify-center">
        <button
          onClick={handleClick}
          className="w-full sm:w-auto sm:min-w-[200px] bg-primary text-primary-foreground font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation min-h-[56px] sm:min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!onNext}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StepWelcome;