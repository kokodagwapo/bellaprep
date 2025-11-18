import React from 'react';
import { LoanPurpose } from '../../types';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

interface Step3Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const ReadOnlyField: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div>
        <p className="block text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-md font-semibold text-foreground">{value || 'Not provided'}</p>
    </div>
);

const InputField: React.FC<{ label: string; id: keyof FormData; value: number; onChange: (id: keyof FormData, value: number) => void; }> = ({ label, id, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">{label}</label>
            <input
                type="text"
                inputMode="numeric"
                id={id}
                value={value > 0 ? `$${value.toLocaleString()}` : ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm sm:text-sm text-foreground focus:ring-primary focus:border-primary"
            />
        </div>
    );
};


const Step3PropertyInfo: React.FC<Step3Props> = ({ data, onDataChange, onNext, onBack }) => {
    const isPurchase = data.loanPurpose === LoanPurpose.PURCHASE;

    const handleFieldChange = (id: keyof FormData, value: number) => {
        onDataChange({ [id]: value });
    };

    return (
        <div>
            <StepHeader title="Section 3: Property Information" subtitle="Details about the property you are financing." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                <ReadOnlyField label="Loan Purpose" value={data.loanPurpose} />
                <ReadOnlyField label="Property Type" value={data.propertyType} />
                <ReadOnlyField label="Intended Property Use" value={data.propertyUse} />
                <ReadOnlyField label="Property Location (City, State)" value={data.location} />
                {isPurchase ? (
                    <InputField label="Purchase Price" id="purchasePrice" value={data.purchasePrice} onChange={handleFieldChange} />
                ) : (
                    <InputField label="Estimated Property Value" id="estimatedPropertyValue" value={data.estimatedPropertyValue} onChange={handleFieldChange} />
                )}
            </div>
            <StepNavigation onNext={onNext} onBack={onBack} />
        </div>
    );
};

export default Step3PropertyInfo;