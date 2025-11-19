import React from 'react';
import { LoanPurpose } from '../../types';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

interface Step2Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const InputField: React.FC<{ label: string; id: keyof FormData; value: number; onChange: (id: keyof FormData, value: number) => void; }> = ({ label, id, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">{label}</label>
            <input
                type="text"
                inputMode="numeric"
                id={id}
                value={value > 0 ? `$${value.toLocaleString()}` : ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 bg-background border border-border rounded-lg sm:rounded-md shadow-sm text-sm sm:text-base text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
        </div>
    );
};

const Step2FinancialInfo: React.FC<Step2Props> = ({ data, onDataChange, onNext, onBack }) => {
    const handleFieldChange = (id: keyof FormData, value: number) => {
        onDataChange({ [id]: value });
    };

    const isPurchase = data.loanPurpose === LoanPurpose.PURCHASE;
    const isComplete = isPurchase 
        ? data.income && data.income > 0 && data.downPayment > 0
        : data.income && data.income > 0;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 2: Financial Information" subtitle="Details about your current income and assets." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
                <InputField label="Monthly Income (from W-2/Paystub)" id="income" value={data.income || 0} onChange={handleFieldChange} />
                {isPurchase && (
                    <InputField label="Estimated Down Payment" id="downPayment" value={data.downPayment} onChange={handleFieldChange} />
                )}
                 <InputField label="Loan Amount Requested" id="loanAmount" value={data.loanAmount} onChange={handleFieldChange} />
            </div>
            <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete}/>
        </div>
    );
};

export default Step2FinancialInfo;