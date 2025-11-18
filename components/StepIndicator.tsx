import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  labels: string[];
  currentStepIndex: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ labels, currentStepIndex }) => {
  return (
    <div className="flex items-start justify-center w-full px-2 py-4">
      {labels.map((label, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center text-center flex-shrink-0" style={{width: `calc(100% / ${labels.length})`}}>
              <div className="relative w-8 h-8 flex items-center justify-center mb-3">
                {isCompleted ? (
                   <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }} 
                     className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                   >
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                   </motion.div>
                ) : isActive ? (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center shadow-md shadow-primary/20"
                    >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-primary rounded-full"
                        />
                    </motion.div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300"></div>
                )}
              </div>
              <p className={`text-xs font-semibold leading-tight transition-all duration-300 ${isActive ? 'text-primary scale-105' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>{label}</p>
            </div>
            
            {index < labels.length - 1 && (
              <div className="flex-1 h-0.5 mt-4 mx-2 relative bg-gray-300 rounded-full overflow-hidden">
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
  );
};

export default StepIndicator;