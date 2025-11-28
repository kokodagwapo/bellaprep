import React from 'react';
import { motion } from 'framer-motion';

interface StepHeaderProps {
  title: string;
  subtitle?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-3 sm:mb-5 md:mb-6 px-2">
    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-tight text-foreground mb-1 sm:mb-2">
      {title}
    </h2>
    {subtitle && (
      <p className="text-xs sm:text-sm md:text-base px-2 font-light leading-relaxed" style={{ color: '#6b7280' }}>
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
            className={`w-full p-2 sm:p-3 border rounded-lg text-left transition-all duration-200 flex items-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-primary/50 relative touch-manipulation min-h-[44px] sm:min-h-[48px] ${
                isSelected
                ? 'bg-primary/10 border-primary border-2 shadow-md shadow-primary/20'
                : 'bg-white border-gray-300 hover:border-primary/50 hover:bg-gray-50 active:bg-gray-100'
            }`}
        >
            {icon && (
              <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 transition-colors ${
                isSelected 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-gray-100 text-primary'
              }`}>
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}
            <span className={`font-light text-sm sm:text-base md:text-lg flex-1 transition-colors break-words ${
              isSelected ? 'text-primary' : 'text-gray-900'
            }`}>
              {label}
            </span>
            <div className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected 
                ? 'border-primary bg-primary shadow-sm scale-110' 
                : 'border-gray-300 bg-white'
            }`}>
              {isSelected && (
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
        </button>
    )
};

export default StepHeader;
export { SelectionButton };