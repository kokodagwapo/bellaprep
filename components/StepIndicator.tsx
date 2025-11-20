import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  labels: string[];
  currentStepIndex: number;
  onStepClick?: (stepIndex: number) => void;
  stepIndices?: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ labels, currentStepIndex, onStepClick, stepIndices }) => {
  const getStepWidth = () => {
    if (labels.length <= 4) return '100%';
    if (labels.length <= 6) return 'auto';
    return 'auto';
  };

  return (
    <div className="w-full pb-2 sm:pb-3 px-2">
      <div className="flex items-start justify-center w-full py-2 sm:py-5 flex-wrap gap-1 sm:gap-2 md:gap-3">
        {labels.map((label, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={index}>
              <div 
                className="flex flex-col items-center text-center flex-shrink-0" 
                style={{
                  width: labels.length <= 4 ? `calc((100% - ${(labels.length - 1) * 8}px) / ${labels.length})` : 'auto',
                  minWidth: labels.length > 4 ? '60px' : 'auto',
                  maxWidth: labels.length > 4 ? '100px' : 'none'
                }}
              >
                <motion.button 
                  className="relative w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center mb-2 sm:mb-4 cursor-pointer touch-manipulation group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onStepClick && stepIndices && stepIndices[index] !== undefined && stepIndices[index] >= 0) {
                      onStepClick(stepIndices[index]);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ pointerEvents: 'auto', minHeight: '32px', minWidth: '32px' }}
                  aria-label={`Go to step: ${label || `Step ${index + 1}`}`}
                >
                  {isCompleted ? (
                     <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                  ) : isActive ? (
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                          <div className="w-3 h-3 sm:w-5 sm:h-5 bg-primary rounded-full" />
                      </div>
                  ) : (
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-100 border border-gray-300"></div>
                  )}
                </motion.button>
                <p 
                  className={`text-[10px] sm:text-xs font-medium leading-tight px-1 ${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : 'text-gray-400'}`}
                >
                  {label || `Step ${index + 1}`}
                </p>
              </div>
              
              {index < labels.length - 1 && (
                <div className="h-0.5 sm:h-1 mt-4 sm:mt-6 relative bg-gray-200 rounded-full flex-shrink-0" style={{width: labels.length <= 4 ? '12px' : labels.length <= 6 ? '10px' : '8px', minWidth: labels.length > 6 ? '8px' : '10px'}}>
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : (isActive ? '50%' : '0%') }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;