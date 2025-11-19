import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

interface Step1Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
}

const InputField: React.FC<{ label: string; id: keyof FormData; value: string | undefined; onChange: (id: keyof FormData, value: string) => void; fullWidth?: boolean; inputType?: string; placeholder?: string }> = ({ label, id, value, onChange, fullWidth = false, inputType = "text", placeholder }) => {
    const getInputType = () => {
        if (inputType) return inputType;
        if (id === 'email') return 'email';
        if (id === 'phoneNumber') return 'tel';
        if (id === 'dob') return 'text';
        return 'text';
    };
    
    return (
        <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">{label}</label>
            <input
                type={getInputType()}
                id={id}
                value={value || ''}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
            />
        </div>
    );
};

const Step1BorrowerInfo: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
    const handleFieldChange = (id: keyof FormData, value: string) => {
        onDataChange({ [id]: value });
    };
    
    const isComplete = data.fullName && data.borrowerAddress && data.dob && data.email && data.phoneNumber;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 1: Borrower Information" subtitle="This information is about you, the Borrower." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
                <InputField label="Full Legal Name" id="fullName" value={data.fullName} onChange={handleFieldChange} fullWidth placeholder="Enter your full legal name" />
                <InputField label="Current Home Address" id="borrowerAddress" value={data.borrowerAddress} onChange={handleFieldChange} fullWidth placeholder="Street address, City, State ZIP" />
                <InputField label="Date of Birth (MM/DD/YYYY)" id="dob" value={data.dob} onChange={handleFieldChange} placeholder="MM/DD/YYYY" />
                <InputField label="Email Address" id="email" value={data.email} onChange={handleFieldChange} inputType="email" placeholder="your.email@example.com" />
                <InputField label="Phone Number" id="phoneNumber" value={data.phoneNumber} onChange={handleFieldChange} inputType="tel" placeholder="(555) 123-4567" />
            </div>
            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} isNextDisabled={!isComplete} />
            </div>
        </div>
    );
};

export default Step1BorrowerInfo;