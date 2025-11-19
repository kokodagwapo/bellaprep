import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = totalSteps > 1
    ? ((currentStep - 1) / (totalSteps - 1)) * 100
    : (currentStep > 0 ? 100 : 0);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs sm:text-sm font-semibold text-foreground tracking-wide">Application Progress</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
          <span className="text-xs sm:text-sm font-bold text-primary">{currentStep}</span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">{totalSteps}</span>
        </div>
      </div>
      <div className="relative w-full">
        <div className="w-full bg-gradient-to-r from-muted via-muted/80 to-muted rounded-full h-3 sm:h-4 overflow-hidden shadow-inner border border-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary/95 to-primary shadow-lg relative overflow-hidden"
            style={{
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.5,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            {/* Glow effect */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary to-primary/50 blur-sm"
            />
          </motion.div>
        </div>
        {/* Progress percentage indicator */}
        {progressPercentage > 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-8 left-0 text-xs font-bold text-primary"
            style={{ left: `calc(${progressPercentage}% - 20px)` }}
          >
            {Math.round(progressPercentage)}%
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
