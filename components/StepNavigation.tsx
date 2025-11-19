import React from 'react';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onNext, onBack, nextLabel = 'Continue', isNextDisabled = false }) => (
  <div className="mt-6 sm:mt-8 md:mt-10">
    <div className="flex flex-col-reverse sm:flex-row-reverse gap-3 sm:gap-4">
      {onNext && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="w-full sm:w-auto sm:flex-1 bg-primary text-primary-foreground font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-primary/90 transition duration-300 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring text-sm sm:text-base"
        >
          {nextLabel}
        </button>
      )}
      {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto sm:flex-1 text-primary-foreground font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 transition duration-300 inline-flex items-center justify-center text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
      )}
    </div>
  </div>
);

export default StepNavigation;