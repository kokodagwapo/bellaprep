import React from 'react';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ onNext, onBack, nextLabel = 'Continue', isNextDisabled = false }) => (
  <div className="mt-10">
    <div className="flex flex-col sm:flex-row-reverse gap-4">
      {onNext && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="w-full flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition duration-300 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          {nextLabel}
        </button>
      )}
      {onBack && (
          <button
            onClick={onBack}
            className="w-full flex-1 text-secondary-foreground font-medium py-3 px-6 rounded-lg bg-secondary hover:bg-secondary/80 transition duration-300 inline-flex items-center justify-center"
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