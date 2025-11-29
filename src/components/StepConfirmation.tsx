import React from 'react';
import Confetti from './Confetti';

interface StepConfirmationProps {
  isLoading: boolean;
  result: string;
  onProceed: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" role="status" aria-label="Loading"></div>
  </div>
);

const StepConfirmation: React.FC<StepConfirmationProps> = ({ isLoading, result, onProceed }) => {
  return (
    <div className="text-center py-4 relative overflow-hidden">
      {!isLoading && <Confetti />}
      {isLoading ? (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Finding the best rates for you...</h2>
          <p className="text-muted-foreground text-lg mb-8">Our AI is analyzing your profile to generate a personalized summary.</p>
          <LoadingSpinner />
        </>
      ) : (
        <>
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full mb-5">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Pre-evaluation Complete!</h2>
          <p className="text-muted-foreground text-lg mb-6">Here is your personalized summary.</p>
          <div className="mt-8 text-left text-card-foreground leading-relaxed bg-secondary/50 p-6 rounded-lg border border-border">
            <h3 className="font-bold text-lg text-foreground mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Your Mortgage Summary
            </h3>
            {result ? (
              result.split('\n').map((line, index) => <p key={index} className="mb-2 last:mb-0">{line}</p>)
            ) : (
              <p>We've received your application and will be in touch shortly.</p>
            )}
          </div>
          <div className="mt-8">
            <button
              onClick={onProceed}
              className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-3 px-10 rounded-lg hover:bg-primary/90 transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring animate-pulse-strong"
            >
              APPLY NOW
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StepConfirmation;