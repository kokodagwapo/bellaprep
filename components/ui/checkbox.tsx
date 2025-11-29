import React from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={cn(
            'w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20 border-gray-300 cursor-pointer',
            error && 'border-red-300',
            className
          )}
          {...props}
        />
        {label && (
          <span className={cn('text-sm font-light', error ? 'text-red-600' : 'text-foreground')}>
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-light">{error}</p>
      )}
    </div>
  );
};

