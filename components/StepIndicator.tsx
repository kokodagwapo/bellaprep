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
    <div className="w-full pb-3 px-2">
      <div className="flex items-start justify-center w-full py-3 sm:py-5 flex-wrap gap-1 sm:gap-2 md:gap-3">
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
                  className="relative w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 cursor-pointer touch-manipulation group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onStepClick && stepIndices && stepIndices[index] !== undefined && stepIndices[index] >= 0) {
                      onStepClick(stepIndices[index]);
                    }
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ pointerEvents: 'auto', minHeight: '48px', minWidth: '48px' }}
                  aria-label={`Go to step: ${label || `Step ${index + 1}`}`}
                >
                  {isCompleted ? (
                     <motion.div 
                       initial={{ scale: 0, rotate: -180 }} 
                       animate={{ scale: 1, rotate: 0 }} 
                       transition={{ type: "spring", stiffness: 200, damping: 15 }}
                       className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 via-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/40 ring-2 ring-green-400/30"
                     >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </motion.div>
                  ) : isActive ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-green-500 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shadow-xl shadow-green-500/30 ring-4 ring-green-500/20 relative overflow-visible"
                      >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-md"
                          />
                          {/* Pulsing ring */}
                          <motion.div
                            animate={{
                              scale: [1, 1.6, 1],
                              opacity: [0.6, 0, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-0 rounded-full border-2 border-green-400"
                          />
                          {/* Glow effect */}
                          <motion.div
                            animate={{
                              opacity: [0.4, 0.8, 0.4],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute -inset-1 rounded-full bg-green-400/30 blur-md"
                          />
                      </motion.div>
                  ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 group-hover:border-green-300 group-hover:bg-green-50 transition-all duration-300"></div>
                  )}
                </motion.button>
                <motion.p 
                  className={`text-[11px] sm:text-xs font-semibold leading-tight transition-all duration-300 px-1 ${isActive ? 'text-green-600 scale-105 font-bold' : isCompleted ? 'text-green-600' : 'text-muted-foreground group-hover:text-green-500'}`}
                  animate={isActive ? { y: [0, -2, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  key={`label-${index}-${label}`}
                >
                  {label || `Step ${index + 1}`}
                </motion.p>
              </div>
              
              {index < labels.length - 1 && (
                <div className="h-1 mt-5 sm:mt-6 relative bg-gradient-to-r from-gray-200 via-gray-200/80 to-gray-200 rounded-full overflow-hidden flex-shrink-0" style={{width: labels.length <= 4 ? '20px' : labels.length <= 6 ? '15px' : '12px', minWidth: labels.length > 6 ? '12px' : '15px'}}>
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : (isActive ? '50%' : '0%') }}
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
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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