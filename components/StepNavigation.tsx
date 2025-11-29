import React from 'react';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onNext, onBack, nextLabel = 'Continue', backLabel = 'Back', isNextDisabled = false }) => {
  return (
    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border/50">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto sm:flex-1 text-primary font-light py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg bg-white border-2 border-gray-300 hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md touch-manipulation min-h-[40px] sm:min-h-[42px] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </button>
      )}
        {onNext && (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full sm:w-auto sm:flex-1 bg-primary text-white font-light py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 text-sm sm:text-base touch-manipulation min-h-[40px] sm:min-h-[42px] shadow-md hover:shadow-lg"
          >
            {nextLabel}
          </button>
        )}
    </div>
  </div>
);
};

export default StepNavigation;