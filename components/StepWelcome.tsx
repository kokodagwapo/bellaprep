import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import StepNavigation from './StepNavigation';

interface StepWelcomeProps {
  onNext: () => void;
}

const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext }) => {
  const isProcessing = useRef<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isProcessing.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (onNext && typeof onNext === 'function') {
      isProcessing.current = true;
      onNext();
      // Reset after action completes
      setTimeout(() => {
        isProcessing.current = false;
      }, 500);
    }
  };

  const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (isProcessing.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (onNext && typeof onNext === 'function') {
      isProcessing.current = true;
      onNext();
      // Reset after action completes
      setTimeout(() => {
        isProcessing.current = false;
      }, 500);
    }
  };

  return (
    <div className="text-center flex flex-col justify-center items-center relative w-full" style={{minHeight: '400px', pointerEvents: 'auto', visibility: 'visible', opacity: 1, zIndex: 1}}>
      <div className="px-2 w-full">
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Discover Mortgage Possibilities</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 px-2">Just answer a few questions and you'll get real mortgage rates in minutes. It's that easy.</p>
      </div>
      <div className="px-4 sm:px-0 mt-4 sm:mt-6 w-full flex justify-center relative" style={{zIndex: 10, visibility: 'visible', opacity: 1, pointerEvents: 'auto'}}>
        <button
          onClick={handleClick}
          onTouchEnd={handleTouch}
          type="button"
          className="w-full sm:w-auto sm:min-w-[200px] bg-primary text-primary-foreground font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 active:bg-primary/85 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation min-h-[48px] sm:min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={!onNext}
          style={{ 
            pointerEvents: 'auto',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            position: 'relative',
            zIndex: 1000,
            visibility: 'visible',
            opacity: 1,
            display: 'block',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            isolation: 'isolate'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StepWelcome;