import React from 'react';
import { motion } from 'framer-motion';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-4 sm:mb-8 md:mb-10 px-2">
    <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-heading mb-1.5 sm:mb-3">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
        {subtitle}
      </p>
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
        <button
            onClick={onClick}
            className={`w-full p-3 sm:p-6 border rounded-lg sm:rounded-xl text-left transition-all duration-200 flex items-center gap-3 sm:gap-4 focus:outline-none focus:ring-2 focus:ring-primary/50 relative touch-manipulation min-h-[56px] sm:min-h-[64px] ${
                isSelected
                ? 'bg-primary/5 border-primary border-2'
                : 'bg-white border-gray-300 hover:border-primary/50 active:bg-gray-50'
            }`}
        >
            {icon && (
              <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                isSelected 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-primary'
              }`}>
                <div className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}
            <span className={`font-semibold text-base sm:text-lg md:text-xl flex-1 ${
              isSelected ? 'text-primary' : 'text-gray-900'
            }`}>
              {label}
            </span>
            <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'border-primary bg-primary' 
                : 'border-gray-300 bg-white'
            }">
              {isSelected && (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
        </button>
    )
};

export default StepHeader;
export { SelectionButton };