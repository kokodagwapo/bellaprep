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
          className="w-full sm:w-auto sm:flex-1 bg-primary text-primary-foreground font-bold py-3.5 sm:py-3 px-8 sm:px-8 rounded-xl sm:rounded-xl hover:bg-primary/90 transition duration-300 disabled:bg-primary/60 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-base sm:text-base shadow-md hover:shadow-lg touch-manipulation min-h-[52px] sm:min-h-[48px] relative overflow-hidden group"
        >
          <span className="relative z-10">{nextLabel}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        </button>
      )}
      {onBack && (
          <button
            onClick={onBack}
            className="w-full sm:w-auto sm:flex-1 text-primary-foreground font-medium py-3 sm:py-3 px-6 sm:px-6 rounded-xl sm:rounded-xl bg-primary hover:bg-primary/90 transition duration-300 inline-flex items-center justify-center text-base sm:text-base shadow-sm hover:shadow-md touch-manipulation min-h-[48px] sm:min-h-[48px]"
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