import React, { useEffect, useState } from 'react';
import { LoanPurpose, MortgageType } from '../../types';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb, Home, Shield, Star, FileCheck, DollarSign, Check } from '../icons';

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

const CurrencyField: React.FC<{ 
    label: string; 
    id: string; 
    value: number; 
    onChange: (value: number) => void;
    placeholder?: string;
    helperText?: string;
}> = ({ label, id, value, onChange, placeholder, helperText }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0);
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
                placeholder={placeholder}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
            />
            {helperText && <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>}
        </div>
    );
};

const NumberField: React.FC<{ 
    label: string; 
    id: string; 
    value: number; 
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}> = ({ label, id, value, onChange, min = 1, max = 4 }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">{label}</label>
            <select
                id={id}
                value={value || 1}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
            >
                {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Unit' : 'Units'}</option>
                ))}
            </select>
        </div>
    );
};

const loanTypeIcons: Record<string, React.ReactNode> = {
    [MortgageType.CONVENTIONAL]: <Home className="h-4 w-4" />,
    [MortgageType.FHA]: <Shield className="h-4 w-4" />,
    [MortgageType.VA]: <Star className="h-4 w-4" />,
    [MortgageType.USDA]: <FileCheck className="h-4 w-4" />,
    [MortgageType.JUMBO]: <DollarSign className="h-4 w-4" />,
};

const Step3PropertyInfo: React.FC<Step3Props> = ({ data, onDataChange, onNext, onBack }) => {
    const isPurchase = data.loanPurpose === LoanPurpose.PURCHASE;
    const isRefinance = data.loanPurpose === LoanPurpose.REFINANCE;
    const [showRefinanceDetails, setShowRefinanceDetails] = useState(isRefinance);

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
        // Set default number of units if not set
        if (!data.numberOfUnits) {
            onDataChange({ numberOfUnits: 1 });
        }
    }, [data.subjectProperty, isPurchase, onDataChange, data.numberOfUnits, data.location]);

    // Calculate LTV
    const propertyValue = isPurchase ? (data.purchasePrice || 0) : (data.estimatedPropertyValue || 0);
    const loanAmount = data.loanAmount || (propertyValue - (data.downPayment || 0));
    const ltv = propertyValue > 0 ? Math.round((loanAmount / propertyValue) * 100) : 0;

    const isComplete = isPurchase 
        ? data.purchasePrice && data.purchasePrice > 0 && data.downPayment !== undefined
        : data.estimatedPropertyValue && data.estimatedPropertyValue > 0;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 3: Property & Loan Information" subtitle="Details about the property and your loan." />
            
            {/* Loan Type Badge */}
            {data.mortgageType && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        {loanTypeIcons[data.mortgageType] || <Home className="h-4 w-4" />}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Selected Loan Type</p>
                        <p className="font-semibold text-foreground">{data.mortgageType}</p>
                    </div>
                    {data.loanTypeSource === 'prep4loan' && (
                        <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            Bella's Recommendation
                        </span>
                    )}
                </div>
            )}

            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mb-4">
                <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold">Bella's Insight:</span> {isPurchase 
                        ? "Your loan-to-value (LTV) ratio affects your rate and whether you need mortgage insurance. Aim for 20% down to avoid PMI on conventional loans!"
                        : "For refinancing, we'll need details about your current mortgage to calculate potential savings."
                    }
                </p>
            </div>

            {/* Property Details */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <ReadOnlyField label="Property Type" value={data.propertyType} />
                    <ReadOnlyField label="Intended Use" value={data.propertyUse} />
                    <ReadOnlyField label="Location" value={data.location || data.subjectProperty?.address?.fullAddress} />
                    <NumberField 
                        label="Number of Units" 
                        id="numberOfUnits"
                        value={data.numberOfUnits || 1}
                        onChange={(value) => onDataChange({ numberOfUnits: value })}
                        min={1}
                        max={4}
                    />
                </div>
            </div>

            {/* Loan Details */}
            <div className="mb-6 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Loan Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <ReadOnlyField label="Loan Purpose" value={data.loanPurpose} />
                    
                    {isPurchase ? (
                        <>
                            <CurrencyField 
                                label="Purchase Price" 
                                id="purchasePrice"
                                value={data.purchasePrice || 0}
                                onChange={(value) => onDataChange({ purchasePrice: value })}
                                placeholder="Enter purchase price"
                            />
                            <CurrencyField 
                                label="Down Payment" 
                                id="downPayment"
                                value={data.downPayment || 0}
                                onChange={(value) => onDataChange({ downPayment: value })}
                                helperText={data.purchasePrice ? `${Math.round((data.downPayment || 0) / data.purchasePrice * 100)}% of purchase price` : undefined}
                            />
                            <CurrencyField 
                                label="Loan Amount" 
                                id="loanAmount"
                                value={loanAmount}
                                onChange={(value) => onDataChange({ loanAmount: value })}
                                helperText="Purchase price minus down payment"
                            />
                        </>
                    ) : (
                        <>
                            <CurrencyField 
                                label="Estimated Property Value" 
                                id="estimatedPropertyValue"
                                value={data.estimatedPropertyValue || 0}
                                onChange={(value) => onDataChange({ estimatedPropertyValue: value })}
                                placeholder="Current market value"
                            />
                            <CurrencyField 
                                label="Requested Loan Amount" 
                                id="loanAmount"
                                value={data.loanAmount || 0}
                                onChange={(value) => onDataChange({ loanAmount: value })}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Refinance Details */}
            {isRefinance && (
                <div className="mb-6 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Current Mortgage Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <CurrencyField 
                            label="Current Loan Balance" 
                            id="currentLoanBalance"
                            value={data.currentLoanBalance || 0}
                            onChange={(value) => onDataChange({ currentLoanBalance: value })}
                            helperText="Remaining balance on your mortgage"
                        />
                        <CurrencyField 
                            label="Current Monthly Payment" 
                            id="currentMonthlyPayment"
                            value={data.currentMonthlyPayment || 0}
                            onChange={(value) => onDataChange({ currentMonthlyPayment: value })}
                            helperText="Principal & Interest only"
                        />
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Current Interest Rate
                            </label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={data.currentInterestRate || ''}
                                onChange={(e) => onDataChange({ currentInterestRate: parseFloat(e.target.value) || 0 })}
                                placeholder="e.g., 6.5"
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Annual percentage rate (%)</p>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Refinance Purpose
                            </label>
                            <select
                                value={data.refinancePurpose || ''}
                                onChange={(e) => onDataChange({ refinancePurpose: e.target.value as FormData['refinancePurpose'] })}
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            >
                                <option value="">Select purpose</option>
                                <option value="lower_rate">Lower Interest Rate</option>
                                <option value="lower_payment">Lower Monthly Payment</option>
                                <option value="cash_out">Cash-Out</option>
                                <option value="shorten_term">Shorten Loan Term</option>
                                <option value="remove_pmi">Remove PMI</option>
                                <option value="debt_consolidation">Debt Consolidation</option>
                            </select>
                        </div>
                        {data.refinancePurpose === 'cash_out' && (
                            <CurrencyField 
                                label="Cash-Out Amount" 
                                id="cashOutAmount"
                                value={data.cashOutAmount || 0}
                                onChange={(value) => onDataChange({ cashOutAmount: value })}
                                helperText="Amount you want to receive in cash"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* LTV Insight */}
            {propertyValue > 0 && loanAmount > 0 && (
                <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
                    ltv <= 80 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                        : ltv <= 95 
                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    <Lightbulb className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                        ltv <= 80 ? 'text-emerald-600' : ltv <= 95 ? 'text-amber-600' : 'text-red-600'
                    }`} />
                    <div className="text-xs">
                        <p className="font-semibold">
                            Loan-to-Value (LTV): {ltv}%
                        </p>
                        <p className="mt-0.5">
                            {ltv <= 80 
                                ? "Excellent! You qualify for no PMI on conventional loans."
                                : ltv <= 95 
                                ? "You may need Private Mortgage Insurance (PMI) until you reach 20% equity."
                                : "High LTV - consider a larger down payment for better rates."
                            }
                        </p>
                        {data.mortgageType === MortgageType.FHA && ltv > 80 && (
                            <p className="mt-1 flex items-center gap-1">
                                <Check className="h-3 w-3" /> FHA loans allow up to 96.5% LTV with mortgage insurance.
                            </p>
                        )}
                        {data.mortgageType === MortgageType.VA && (
                            <p className="mt-1 flex items-center gap-1">
                                <Check className="h-3 w-3" /> VA loans allow 100% financing with no PMI required!
                            </p>
                        )}
                    </div>
                </div>
            )}

            <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
        </div>
    );
};

export default Step3PropertyInfo;