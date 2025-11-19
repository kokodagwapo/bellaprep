import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { SelectionButton } from '../StepHeader';

interface Step4Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const DeclarationQuestion: React.FC<{
    question: string;
    field: keyof FormData;
    value: boolean | null;
    onChange: (field: keyof FormData, value: boolean) => void;
}> = ({ question, field, value, onChange }) => (
    <div className="py-3 sm:py-4 border-b border-border last:border-b-0">
        <p className="text-sm sm:text-base font-medium text-foreground mb-2 sm:mb-3">{question}</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 sm:mt-3">
            <SelectionButton
                label="Yes"
                isSelected={value === true}
                onClick={() => onChange(field, true)}
            />
            <SelectionButton
                label="No"
                isSelected={value === false}
                onClick={() => onChange(field, false)}
            />
        </div>
    </div>
);

const Step4Declarations: React.FC<Step4Props> = ({ data, onDataChange, onNext, onBack }) => {
    const handleFieldChange = (field: keyof FormData, value: boolean) => {
        onDataChange({ [field]: value });
    };

    const isComplete = data.isFirstTimeBuyer !== null && data.isMilitary !== null;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 4: Declarations" subtitle="Please answer the following questions." />
            <div className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4">
                <DeclarationQuestion
                    question="Are you a first-time homebuyer?"
                    field="isFirstTimeBuyer"
                    value={data.isFirstTimeBuyer}
                    onChange={handleFieldChange}
                />
                <DeclarationQuestion
                    question="Have you or your deceased spouse ever served in the US Military?"
                    field="isMilitary"
                    value={data.isMilitary}
                    onChange={handleFieldChange}
                />
            </div>
            <StepNavigation onNext={onNext} onBack={onBack} nextLabel="Review & Submit" isNextDisabled={!isComplete}/>
        </div>
    );
};

export default Step4Declarations;