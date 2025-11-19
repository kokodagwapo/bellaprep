import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  labels: string[];
  currentStepIndex: number;
  onStepClick?: (stepIndex: number) => void;
  stepIndices?: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ labels, currentStepIndex, onStepClick, stepIndices }) => {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-2 px-2">
      <div className="flex items-start justify-start sm:justify-center w-full min-w-max sm:min-w-0 py-2 sm:py-4">
        {labels.map((label, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center flex-shrink-0" style={{width: labels.length <= 4 ? `calc(100% / ${labels.length})` : '80px', minWidth: labels.length > 4 ? '80px' : 'auto'}}>
                <div 
                  className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mb-2 sm:mb-3 cursor-pointer touch-manipulation"
                  onClick={() => {
                    if (onStepClick && stepIndices && stepIndices[index] !== undefined) {
                      onStepClick(stepIndices[index]);
                    }
                  }}
                >
                  {isCompleted ? (
                     <motion.div 
                       initial={{ scale: 0 }} 
                       animate={{ scale: 1 }} 
                       className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                     >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </motion.div>
                  ) : isActive ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center shadow-md shadow-primary/20"
                      >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"
                          />
                      </motion.div>
                  ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                  )}
                </div>
                <p className={`text-[10px] sm:text-xs font-semibold leading-tight transition-all duration-300 px-0.5 ${isActive ? 'text-primary scale-105' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>{label}</p>
              </div>
              
              {index < labels.length - 1 && (
                <div className="flex-1 h-0.5 mt-3 sm:mt-4 mx-1 sm:mx-2 relative bg-gray-300 rounded-full overflow-hidden min-w-[20px] sm:min-w-[30px]">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
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