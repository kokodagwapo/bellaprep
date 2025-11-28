import React, { useEffect } from 'react';
import { LoanPurpose } from '../../types';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';

interface Step3Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const ReadOnlyField: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div>
        <p className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="mt-1 text-sm sm:text-base font-semibold text-foreground">{value || 'Not provided'}</p>
    </div>
);

const InputField: React.FC<{ label: string; id: keyof FormData; value: number; onChange: (id: keyof FormData, value: number) => void; }> = ({ label, id, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">{label}</label>
            <input
                type="text"
                inputMode="numeric"
                id={id}
                value={value > 0 ? `$${value.toLocaleString()}` : ''}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
            />
        </div>
    );
};


const Step3PropertyInfo: React.FC<Step3Props> = ({ data, onDataChange, onNext, onBack }) => {
    const isPurchase = data.loanPurpose === LoanPurpose.PURCHASE;

    const handleFieldChange = (id: keyof FormData, value: number) => {
        onDataChange({ [id]: value });
    };

    // Backward compatibility: Map Prep4Loan property data
    useEffect(() => {
        // Map subjectProperty to purchasePrice/estimatedPropertyValue
        if (data.subjectProperty?.value && !data.purchasePrice && !data.estimatedPropertyValue) {
            if (isPurchase) {
                onDataChange({ purchasePrice: data.subjectProperty.value });
            } else {
                onDataChange({ estimatedPropertyValue: data.subjectProperty.value });
            }
        }
        // Map subjectProperty address to location
        if (data.subjectProperty?.address && !data.location) {
            const addr = data.subjectProperty.address;
            if (addr.city && addr.state) {
                onDataChange({ location: `${addr.city}, ${addr.state}` });
            }
        }
    }, [data.subjectProperty, isPurchase, onDataChange]);

    const isComplete = isPurchase 
        ? data.purchasePrice && data.purchasePrice > 0
        : data.estimatedPropertyValue && data.estimatedPropertyValue > 0;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 3: Property Information" subtitle="Details about the property you are financing." />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4">
                <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold">Bella's Insight:</span> Most of this information was pre-filled from your Prep4Loan evaluation! You can update any fields if needed. The property value helps lenders determine the loan-to-value (LTV) ratio.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <ReadOnlyField label="Loan Purpose" value={data.loanPurpose} />
                <ReadOnlyField label="Property Type" value={data.propertyType} />
                <ReadOnlyField label="Intended Property Use" value={data.propertyUse} />
                <ReadOnlyField label="Property Location (City, State)" value={data.location} />
                {isPurchase ? (
                    <InputField label="Purchase Price" id="purchasePrice" value={data.purchasePrice || 0} onChange={handleFieldChange} />
                ) : (
                    <InputField label="Estimated Property Value" id="estimatedPropertyValue" value={data.estimatedPropertyValue || 0} onChange={handleFieldChange} />
                )}
            </div>

            {/* LTV Insight for purchase */}
            {isPurchase && data.purchasePrice && data.downPayment && data.purchasePrice > 0 && (
                <div className="mt-4 bg-primary/10 border-l-4 border-primary p-3 text-primary rounded-md flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs">
                        <span className="font-semibold">Loan-to-Value (LTV):</span> With a ${data.downPayment.toLocaleString()} down payment on a ${data.purchasePrice.toLocaleString()} home, your LTV is {Math.round(((data.purchasePrice - data.downPayment) / data.purchasePrice) * 100)}%. Lower LTV often means better rates!
                    </p>
                </div>
            )}

            <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
        </div>
    );
};

export default Step3PropertyInfo;