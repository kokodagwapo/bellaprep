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
    <div className="w-full overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
      <div className="flex items-start justify-start sm:justify-center w-full min-w-max sm:min-w-0 py-3 sm:py-5">
        {labels.map((label, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center flex-shrink-0" style={{width: labels.length <= 4 ? `calc(100% / ${labels.length})` : '90px', minWidth: labels.length > 4 ? '90px' : 'auto'}}>
                <motion.div 
                  className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mb-3 sm:mb-4 cursor-pointer touch-manipulation group"
                  onClick={() => {
                    if (onStepClick && stepIndices && stepIndices[index] !== undefined) {
                      onStepClick(stepIndices[index]);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                     <motion.div 
                       initial={{ scale: 0, rotate: -180 }} 
                       animate={{ scale: 1, rotate: 0 }} 
                       transition={{ type: "spring", stiffness: 200, damping: 15 }}
                       className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/40 ring-2 ring-primary/20"
                     >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </motion.div>
                  ) : isActive ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-primary bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                      >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full shadow-sm"
                          />
                          {/* Pulsing ring */}
                          <motion.div
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-0 rounded-full border-2 border-primary"
                          />
                      </motion.div>
                  ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-muted to-muted/80 border-2 border-border group-hover:border-primary/30 transition-colors"></div>
                  )}
                </motion.div>
                <motion.p 
                  className={`text-[11px] sm:text-xs font-semibold leading-tight transition-all duration-300 px-1 ${isActive ? 'text-primary scale-105 font-bold' : isCompleted ? 'text-primary/90' : 'text-muted-foreground'}`}
                  animate={isActive ? { y: [0, -2, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {label}
                </motion.p>
              </div>
              
              {index < labels.length - 1 && (
                <div className="flex-1 h-1 mt-4 sm:mt-5 mx-2 sm:mx-3 relative bg-gradient-to-r from-border via-border/80 to-border rounded-full overflow-hidden min-w-[30px] sm:min-w-[40px]">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <motion.div
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
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