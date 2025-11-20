import React, { useEffect } from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { SelectionButton } from '../StepHeader';
import { Lightbulb } from '../icons';

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

    // Backward compatibility: Data should already be set from Prep4Loan
    // No need to pre-fill as these are user declarations

    const isComplete = 
        data.isFirstTimeBuyer !== null && 
        data.isMilitary !== null &&
        data.willOccupyAsPrimary !== null &&
        data.ownershipInterestInLast3Years !== null &&
        data.familyRelationshipWithSeller !== null &&
        data.borrowingUndisclosedMoney !== null &&
        data.applyingForOtherMortgage !== null &&
        data.applyingForNewCredit !== null &&
        data.isCoSigner !== null &&
        data.outstandingJudgments !== null &&
        data.delinquentOnFederalDebt !== null &&
        data.partyToLawsuit !== null &&
        data.conveyedTitleInLieuOfForeclosure !== null &&
        data.preForeclosureSale !== null &&
        data.propertyForeclosed !== null &&
        data.declaredBankruptcy !== null;

    // Determine if user qualifies for special programs
    const qualifiesForFirstTimeBuyer = data.isFirstTimeBuyer === true;
    const qualifiesForVA = data.isMilitary === true;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 4: Declarations" subtitle="Please answer the following questions." />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm">
                    <span className="font-semibold">Bella's Insight:</span> These declarations help determine if you qualify for special loan programs. First-time homebuyers may qualify for down payment assistance, and military service members may be eligible for VA loans with no down payment required!
                </p>
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4">
                {/* Property and Money Declarations */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Property and Money</h3>
                    <DeclarationQuestion
                        question="Will you occupy the property as your primary residence?"
                        field="willOccupyAsPrimary"
                        value={data.willOccupyAsPrimary ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Have you had an ownership interest in a property in the last 3 years?"
                        field="ownershipInterestInLast3Years"
                        value={data.ownershipInterestInLast3Years ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Do you have a family relationship with the seller?"
                        field="familyRelationshipWithSeller"
                        value={data.familyRelationshipWithSeller ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Are you borrowing any money that will not be disclosed on this application?"
                        field="borrowingUndisclosedMoney"
                        value={data.borrowingUndisclosedMoney ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Are you applying for any other mortgage loans?"
                        field="applyingForOtherMortgage"
                        value={data.applyingForOtherMortgage ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Are you applying for any new credit?"
                        field="applyingForNewCredit"
                        value={data.applyingForNewCredit ?? null}
                        onChange={handleFieldChange}
                    />
                </div>

                {/* Financial Declarations */}
                <div className="mb-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Financial History</h3>
                    <DeclarationQuestion
                        question="Are you a co-signer or co-maker on any note?"
                        field="isCoSigner"
                        value={data.isCoSigner ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Do you have any outstanding judgments?"
                        field="outstandingJudgments"
                        value={data.outstandingJudgments ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Are you delinquent on any federal debt?"
                        field="delinquentOnFederalDebt"
                        value={data.delinquentOnFederalDebt ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Are you a party to a lawsuit?"
                        field="partyToLawsuit"
                        value={data.partyToLawsuit ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Have you conveyed title in lieu of foreclosure in the past 7 years?"
                        field="conveyedTitleInLieuOfForeclosure"
                        value={data.conveyedTitleInLieuOfForeclosure ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Have you had a pre-foreclosure sale in the past 7 years?"
                        field="preForeclosureSale"
                        value={data.preForeclosureSale ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Have you had a property foreclosed in the past 7 years?"
                        field="propertyForeclosed"
                        value={data.propertyForeclosed ?? null}
                        onChange={handleFieldChange}
                    />
                    <DeclarationQuestion
                        question="Have you declared bankruptcy in the past 7 years?"
                        field="declaredBankruptcy"
                        value={data.declaredBankruptcy ?? null}
                        onChange={handleFieldChange}
                    />
                </div>

                {/* First-Time Buyer and Military */}
                <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Program Eligibility</h3>
                <DeclarationQuestion
                    question="Are you a first-time homebuyer?"
                    field="isFirstTimeBuyer"
                        value={data.isFirstTimeBuyer ?? null}
                    onChange={handleFieldChange}
                />
                    {qualifiesForFirstTimeBuyer && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-3 text-green-800 rounded-md flex items-start gap-2 -mt-2 mb-4">
                            <Lightbulb className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs">
                                <span className="font-semibold">Great news!</span> As a first-time homebuyer, you may qualify for special programs like FHA loans with lower down payments (as low as 3.5%) or state/local down payment assistance programs.
                            </p>
                        </div>
                    )}
                <DeclarationQuestion
                    question="Have you or your deceased spouse ever served in the US Military?"
                    field="isMilitary"
                        value={data.isMilitary ?? null}
                    onChange={handleFieldChange}
                />
                    {qualifiesForVA && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-3 text-green-800 rounded-md flex items-start gap-2 -mt-2">
                            <Lightbulb className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs">
                                <span className="font-semibold">Thank you for your service!</span> You may qualify for a VA loan, which typically requires no down payment and has competitive interest rates. VA loans also don't require private mortgage insurance (PMI).
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <StepNavigation onNext={onNext} onBack={onBack} nextLabel="Review & Submit" isNextDisabled={!isComplete}/>
        </div>
    );
};

export default Step4Declarations;