import React from 'react';
import { motion } from 'framer-motion';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
    <motion.h2 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-heading mb-2 sm:mb-3"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-sm sm:text-base md:text-lg text-muted-foreground px-2"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

interface SelectionButtonProps {
    label: string;
    icon?: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({ label, icon, isSelected, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full p-4 sm:p-6 border-2 rounded-xl sm:rounded-xl text-left transition-all duration-300 flex items-center gap-3 sm:gap-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative touch-manipulation min-h-[64px] sm:min-h-[auto] ${
                isSelected
                ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                : 'bg-card border-border hover:border-primary/30 hover:bg-primary/5 hover:shadow-md active:scale-[0.98]'
            }`}
            style={{ minHeight: '64px' }}
        >
            {icon && (
              <div className={`p-2 sm:p-3 rounded-lg transition-all duration-300 flex-shrink-0 ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}
            <span className={`font-semibold text-base sm:text-lg md:text-xl flex-1 transition-colors duration-300 ${
              isSelected ? 'text-primary' : 'text-foreground'
            }`}>
              {label}
            </span>
            <div className="flex-shrink-0 ml-1 sm:ml-2 pl-2 sm:pl-4 border-l border-border/50">
              <motion.div 
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'border-primary bg-primary shadow-md shadow-primary/30' 
                    : 'border-border bg-card hover:border-primary/50'
                }`}
                animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isSelected ? (
                  <motion.svg
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-transparent" />
                )}
              </motion.div>
            </div>
        </motion.button>
    )
};

export default StepHeader;
export { SelectionButton };