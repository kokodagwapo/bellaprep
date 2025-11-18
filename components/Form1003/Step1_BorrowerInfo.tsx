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
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">{label}</label>
        <input
            type="text"
            id={id}
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm sm:text-sm text-foreground focus:ring-primary focus:border-primary"
        />
    </div>
);

const Step1BorrowerInfo: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
    const handleFieldChange = (id: keyof FormData, value: string) => {
        onDataChange({ [id]: value });
    };
    
    const isComplete = data.fullName && data.borrowerAddress && data.dob && data.email && data.phoneNumber;

    return (
        <div>
            <StepHeader title="Section 1: Borrower Information" subtitle="This information is about you, the Borrower." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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