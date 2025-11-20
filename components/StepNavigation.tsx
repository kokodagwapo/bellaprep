import React from 'react';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onNext, onBack, nextLabel = 'Continue', isNextDisabled = false }) => {
  return (
    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto sm:flex-1 text-primary font-medium py-3 px-6 rounded-lg sm:rounded-xl bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md touch-manipulation min-h-[48px] sm:min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
      )}
        {onNext && (
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full sm:w-auto sm:flex-1 bg-primary text-white font-semibold py-3 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl hover:bg-primary/90 active:bg-primary/95 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50 text-base touch-manipulation min-h-[48px] sm:min-h-[44px]"
          >
            {nextLabel}
          </button>
        )}
    </div>
  </div>
);
};

export default StepNavigation;