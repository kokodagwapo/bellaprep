import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

interface Step1Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
}

const InputField: React.FC<{ label: string; id: keyof FormData; value: string | undefined; onChange: (id: keyof FormData, value: string) => void; fullWidth?: boolean }> = ({ label, id, value, onChange, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
        <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <input
            type="text"
            id={id}
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            className="mt-1 block w-full px-3 py-2.5 sm:py-2 bg-background border border-border rounded-lg sm:rounded-md shadow-sm text-sm sm:text-base text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
    </div>
);

const Step1BorrowerInfo: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
    const handleFieldChange = (id: keyof FormData, value: string) => {
        onDataChange({ [id]: value });
    };
    
    const isComplete = data.fullName && data.borrowerAddress && data.dob && data.email && data.phoneNumber;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 1: Borrower Information" subtitle="This information is about you, the Borrower." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
                <InputField label="Full Legal Name" id="fullName" value={data.fullName} onChange={handleFieldChange} fullWidth />
                <InputField label="Current Home Address" id="borrowerAddress" value={data.borrowerAddress} onChange={handleFieldChange} fullWidth />
                <InputField label="Date of Birth (MM/DD/YYYY)" id="dob" value={data.dob} onChange={handleFieldChange} />
                <InputField label="Email Address" id="email" value={data.email} onChange={handleFieldChange} />
                <InputField label="Phone Number" id="phoneNumber" value={data.phoneNumber} onChange={handleFieldChange} />
            </div>
            <StepNavigation onNext={onNext} isNextDisabled={!isComplete} />
        </div>
    );
};

export default Step1BorrowerInfo;