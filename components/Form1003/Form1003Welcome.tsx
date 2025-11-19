import React from 'react';
import { motion } from 'framer-motion';

interface Form1003WelcomeProps {
  onNext: () => void;
}

const Form1003Welcome: React.FC<Form1003WelcomeProps> = ({ onNext }) => {
  const handleClick = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="text-center flex flex-col justify-center items-center" style={{minHeight: '400px'}}>
      <div className="px-2">
        <motion.div 
          animate={{ opacity: 1, display: 'flex' }}
          className="flex flex-col items-center gap-2 mb-4 sm:mb-6"
        >
          <img 
            src={`${import.meta.env.BASE_URL}TeraTrans.png`}
            alt="TERAVERDE Logo" 
            className="w-auto h-auto max-w-[120px] sm:max-w-[140px] object-contain"
            style={{ maxHeight: '60px', width: 'auto', height: 'auto' }}
            onError={(e) => {
              console.error('Logo failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <motion.span
            animate={{ opacity: 1, display: 'flex' }}
            className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center whitespace-nowrap"
            style={{ color: '#6b7280' }}
          >
            Business Process Solutions
          </motion.span>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Uniform Residential Loan Application</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-2 sm:mb-3 px-2">Fannie Mae Form 1003</p>
        <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 px-2">Complete this comprehensive application to move forward with your mortgage. We'll guide you through each section step by step.</p>
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

export default Form1003Welcome;

