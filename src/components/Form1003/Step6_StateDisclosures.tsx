import React, { useMemo } from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';

interface Step6Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

// State-specific disclosure requirements
const STATE_DISCLOSURES: Record<string, {
    name: string;
    disclosures: Array<{ title: string; content: string; required: boolean }>;
}> = {
    'CA': {
        name: 'California',
        disclosures: [
            {
                title: 'California Addendum to Loan Estimate',
                content: 'California requires a signed addendum to the Loan Estimate for all mortgage transactions. This disclosure outlines state-specific terms and conditions.',
                required: true
            },
            {
                title: 'Mortgage Loan Disclosure Statement',
                content: 'Required for all mortgage transactions in California. Discloses loan terms, fees, and borrower rights.',
                required: true
            },
            {
                title: 'California Fair Lending Notice',
                content: 'Informs borrowers of their rights under California fair lending laws and protections against discrimination.',
                required: true
            },
            {
                title: 'Hazard Insurance Disclosure',
                content: 'Required for purchase transactions. Explains hazard insurance requirements and borrower options.',
                required: true
            }
        ]
    },
    'TX': {
        name: 'Texas',
        disclosures: [
            {
                title: 'Texas Mortgage Company Disclosure',
                content: 'Required disclosure about the mortgage company and consumer complaint recovery fund.',
                required: true
            },
            {
                title: '12-Day Notice (Cash-Out Only)',
                content: 'For Texas cash-out refinances, this notice must be provided no later than 12 days before closing.',
                required: false // Conditional
            },
            {
                title: 'Non-Borrower Spouse Disclosure',
                content: 'Required for cash-out refinances when spouse is not a borrower.',
                required: false // Conditional
            }
        ]
    },
    'FL': {
        name: 'Florida',
        disclosures: [
            {
                title: 'Anti-Coercion Notice',
                content: 'Choice of Insurance disclosure - borrowers have the right to choose their insurance provider.',
                required: true
            },
            {
                title: 'Notice to Purchaser',
                content: 'Required for purchase transactions only. Provides important information about the property purchase.',
                required: false // Conditional
            }
        ]
    },
    'NY': {
        name: 'New York',
        disclosures: [
            {
                title: 'NY Mortgage Banker/Broker Disclosure',
                content: 'Required disclosure about the mortgage banker or broker license and regulatory information.',
                required: true
            }
        ]
    }
};

const Step6StateDisclosures: React.FC<Step6Props> = ({ data, onDataChange, onNext, onBack }) => {
    // Determine property state from location or property address
    const propertyState = useMemo(() => {
        if (data.propertyAddress?.state) {
            return data.propertyAddress.state.toUpperCase();
        }
        if (data.location) {
            const match = data.location.match(/,?\s*([A-Z]{2})\s*$/);
            if (match) return match[1].toUpperCase();
        }
        if (data.subjectProperty?.address?.state) {
            return data.subjectProperty.address.state.toUpperCase();
        }
        return null;
    }, [data.propertyAddress, data.location, data.subjectProperty]);

    const stateDisclosures = propertyState ? STATE_DISCLOSURES[propertyState] : null;
    const [acknowledgedDisclosures, setAcknowledgedDisclosures] = React.useState<Record<string, boolean>>({});

    const handleAcknowledge = (disclosureTitle: string) => {
        setAcknowledgedDisclosures(prev => ({
            ...prev,
            [disclosureTitle]: !prev[disclosureTitle]
        }));
    };

    const requiredDisclosures = stateDisclosures?.disclosures.filter(d => d.required) || [];
    const isComplete = requiredDisclosures.length > 0 
        ? requiredDisclosures.every(d => acknowledgedDisclosures[d.title] === true)
        : true; // If no state-specific disclosures, allow progression

    return (
        <div className="px-2 sm:px-0">
            <StepHeader 
                title="Section 6: State-Specific Disclosures" 
                subtitle="Please review and acknowledge the required disclosures for your state." 
            />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm">
                    <span className="font-semibold">Bella's Insight:</span> Each state has specific disclosure requirements to protect borrowers. These disclosures ensure you understand your rights and obligations under state law. Please read each disclosure carefully before acknowledging.
                </p>
            </div>

            {!propertyState ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded-md">
                    <p className="text-sm">
                        <span className="font-semibold">Note:</span> We couldn't determine your property state from the information provided. Please ensure your property address is complete. If you're applying in a state with specific disclosure requirements, your loan officer will provide these disclosures separately.
                    </p>
                </div>
            ) : !stateDisclosures ? (
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 text-gray-800 rounded-md">
                    <p className="text-sm">
                        <span className="font-semibold">No Additional State Disclosures Required:</span> Based on your property location ({propertyState}), there are no additional state-specific disclosures required beyond the standard federal disclosures.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-primary/10 p-3 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-primary">
                            Property State: {stateDisclosures.name} ({propertyState})
                        </p>
                    </div>

                    {stateDisclosures.disclosures.map((disclosure, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-foreground mb-2">
                                        {disclosure.title}
                                        {disclosure.required && <span className="text-red-600 ml-1">*</span>}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        {disclosure.content}
                                    </p>
                                </div>
                            </div>
                            
                            {disclosure.required && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acknowledgedDisclosures[disclosure.title] || false}
                                        onChange={() => handleAcknowledge(disclosure.title)}
                                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                    />
                                    <span className="text-xs sm:text-sm text-foreground">
                                        I acknowledge that I have read and understand this disclosure *
                                    </span>
                                </label>
                            )}
                        </div>
                    ))}

                    {/* General Federal Disclosures */}
                    <div className="border border-border rounded-lg p-4 mt-6">
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                            Federal Disclosures (All States)
                        </h4>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p>• Fair Lending Notice - You have the right to fair and equal treatment in lending</p>
                            <p>• Privacy Notice - How we collect, use, and protect your personal information</p>
                            <p>• Equal Credit Opportunity Act - Protection against credit discrimination</p>
                            <p>• Truth in Lending Act - Disclosure of loan terms and costs</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
            </div>
        </div>
    );
};

export default Step6StateDisclosures;

