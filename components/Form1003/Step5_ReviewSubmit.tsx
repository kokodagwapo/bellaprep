import React, { useState } from 'react';
import type { FormData } from '../../types';
import { LoanPurpose, MortgageType } from '../../types';
import StepHeader from '../StepHeader';
import { Lightbulb, CheckCircle2, Home, Shield, Star, FileCheck, DollarSign, ChevronDown, ChevronUp, User, Briefcase } from '../icons';

interface Step5Props {
    data: FormData;
    onBack: () => void;
}

const loanTypeIcons: Record<string, React.ReactNode> = {
    [MortgageType.CONVENTIONAL]: <Home className="h-5 w-5" />,
    [MortgageType.FHA]: <Shield className="h-5 w-5" />,
    [MortgageType.VA]: <Star className="h-5 w-5" />,
    [MortgageType.USDA]: <FileCheck className="h-5 w-5" />,
    [MortgageType.JUMBO]: <DollarSign className="h-5 w-5" />,
};

const SummarySection: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="border border-border rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-primary">{icon}</span>
                    <span className="font-medium text-foreground text-sm">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {isOpen && (
                <div className="p-3 border-t border-border bg-background">
                    {children}
                </div>
            )}
        </div>
    );
};

const SummaryRow: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-b-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground text-right max-w-[60%]">{value || '—'}</span>
    </div>
);

const Step5ReviewSubmit: React.FC<Step5Props> = ({ data, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    // Calculate key metrics
    const propertyValue = data.loanPurpose === LoanPurpose.PURCHASE 
        ? (data.purchasePrice || 0) 
        : (data.estimatedPropertyValue || 0);
    const loanAmount = data.loanAmount || (propertyValue - (data.downPayment || 0));
    const ltv = propertyValue > 0 ? Math.round((loanAmount / propertyValue) * 100) : 0;
    const monthlyIncome = (data.income || 0) / 12;
    const totalDebts = (data.debts?.carLoan || 0) + (data.debts?.creditCards || 0) + 
                       (data.debts?.studentLoans || 0) + (data.debts?.personalLoans || 0) + 
                       (data.debts?.childSupport || 0);
    const estimatedPayment = loanAmount * 0.006; // Rough estimate
    const estimatedDTI = monthlyIncome > 0 ? Math.round(((totalDebts + estimatedPayment) / monthlyIncome) * 100) : 0;

    // Check form completeness
    const isFormComplete = 
        !!data.fullName && 
        !!data.borrowerAddress && 
        !!data.dob && 
        !!data.email && 
        !!data.phoneNumber &&
        !!data.income && data.income > 0 &&
        loanAmount > 0 &&
        propertyValue > 0 &&
        data.isFirstTimeBuyer !== null &&
        data.isMilitary !== null;

    const checklist = [
        { label: 'Loan Type Selected', complete: !!data.mortgageType },
        { label: 'Borrower Information', complete: !!(data.fullName && data.borrowerAddress && data.dob && data.email && data.phoneNumber) },
        { label: 'Employment & Income', complete: !!(data.income && data.income > 0) },
        { label: 'Assets & Liabilities', complete: !!(data.assets || data.debts) },
        { label: 'Property Information', complete: !!(data.propertyType && data.propertyUse && propertyValue > 0) },
        { label: 'Declarations', complete: data.isFirstTimeBuyer !== null && data.isMilitary !== null },
    ];

    const completedCount = checklist.filter(c => c.complete).length;
    const completionPercent = Math.round((completedCount / checklist.length) * 100);

    if (isSubmitted) {
        return (
            <div className="text-center px-2 sm:px-0 py-8">
                <div className="mx-auto w-24 h-24 flex items-center justify-center bg-emerald-100 rounded-full mb-6">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Thank you, {data.fullName?.split(' ')[0] || 'borrower'}! Your {data.mortgageType || 'loan'} application has been received. 
                    A loan officer will review your application and contact you within 1-2 business days.
                </p>
                <div className="bg-muted/50 rounded-xl p-4 max-w-sm mx-auto text-left">
                    <p className="text-xs font-semibold text-foreground mb-2">Application Reference</p>
                    <p className="text-sm font-mono text-primary">BLP-{Date.now().toString(36).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-2">Save this number for your records</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-2 sm:px-0">
            <StepHeader
                title="Review & Submit"
                subtitle="Review your application summary before submitting"
            />
            
            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Application Completeness</span>
                    <span className={`font-medium ${completionPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {completionPercent}%
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${completionPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>

            {/* Loan Summary Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    {data.mortgageType && loanTypeIcons[data.mortgageType] && (
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {loanTypeIcons[data.mortgageType]}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-foreground">{data.mortgageType || 'Loan'} Application</p>
                        <p className="text-xs text-muted-foreground">{data.loanPurpose}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">${(loanAmount / 1000).toFixed(0)}K</p>
                        <p className="text-[10px] text-muted-foreground">Loan Amount</p>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">{ltv}%</p>
                        <p className="text-[10px] text-muted-foreground">LTV</p>
                    </div>
                    <div className="text-center p-2 bg-background/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">{estimatedDTI}%</p>
                        <p className="text-[10px] text-muted-foreground">Est. DTI</p>
                    </div>
                </div>
            </div>

            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 text-blue-800 rounded-md flex items-start gap-2 mb-4 text-left">
                <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                    <span className="font-semibold">Bella:</span> {isFormComplete 
                        ? `Great work! Your ${data.mortgageType || 'loan'} application looks complete. With ${ltv}% LTV and estimated ${estimatedDTI}% DTI, you're in a good position!`
                        : "Almost there! Complete the missing sections to submit your application."}
                </p>
            </div>

            {/* Expandable Summary Sections */}
            <div className="space-y-2 mb-6">
                <SummarySection title="Borrower Information" icon={<User className="h-4 w-4" />} defaultOpen>
                    <SummaryRow label="Full Name" value={data.fullName} />
                    <SummaryRow label="Email" value={data.email} />
                    <SummaryRow label="Phone" value={data.phoneNumber} />
                    <SummaryRow label="Date of Birth" value={data.dob} />
                    <SummaryRow label="Address" value={data.borrowerAddress} />
                    <SummaryRow label="Citizenship" value={data.citizenship} />
                    <SummaryRow label="Marital Status" value={data.maritalStatus} />
                </SummarySection>

                <SummarySection title="Employment & Income" icon={<Briefcase className="h-4 w-4" />}>
                    <SummaryRow label="Employment Status" value={data.employmentStatus} />
                    <SummaryRow label="Employer" value={data.currentEmployment?.employerName} />
                    <SummaryRow label="Position" value={data.currentEmployment?.position} />
                    <SummaryRow label="Annual Income" value={data.income ? `$${data.income.toLocaleString()}` : undefined} />
                </SummarySection>

                <SummarySection title="Property & Loan" icon={<Home className="h-4 w-4" />}>
                    <SummaryRow label="Loan Type" value={data.mortgageType} />
                    <SummaryRow label="Loan Purpose" value={data.loanPurpose} />
                    <SummaryRow label="Property Type" value={data.propertyType} />
                    <SummaryRow label="Property Use" value={data.propertyUse} />
                    <SummaryRow label="Property Value" value={propertyValue > 0 ? `$${propertyValue.toLocaleString()}` : undefined} />
                    <SummaryRow label="Loan Amount" value={loanAmount > 0 ? `$${loanAmount.toLocaleString()}` : undefined} />
                    {data.downPayment && <SummaryRow label="Down Payment" value={`$${data.downPayment.toLocaleString()}`} />}
                    <SummaryRow label="Loan Term" value={data.loanTerm} />
                    <SummaryRow label="Rate Type" value={data.amortizationType} />
                </SummarySection>

                <SummarySection title="Declarations" icon={<FileCheck className="h-4 w-4" />}>
                    <SummaryRow label="First-Time Buyer" value={data.isFirstTimeBuyer === true ? 'Yes' : data.isFirstTimeBuyer === false ? 'No' : undefined} />
                    <SummaryRow label="Military Service" value={data.isMilitary === true ? 'Yes' : data.isMilitary === false ? 'No' : undefined} />
                    <SummaryRow label="Will Occupy as Primary" value={data.willOccupyAsPrimary === true ? 'Yes' : data.willOccupyAsPrimary === false ? 'No' : undefined} />
                </SummarySection>
            </div>

            {/* Completion Checklist */}
            <div className="bg-muted/30 rounded-xl p-3 mb-6">
                <h3 className="text-xs font-semibold text-foreground mb-2">Application Checklist</h3>
                <div className="grid grid-cols-2 gap-1">
                    {checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {item.complete ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span className={`text-xs ${item.complete ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legal Text */}
            <p className="text-[10px] text-muted-foreground text-center mb-4">
                By clicking "Submit Application", you certify that all information provided is accurate to the best of your knowledge 
                and authorize the lender to verify the information provided.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormComplete || isSubmitting}
                    className="w-full flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring shadow-lg hover:shadow-xl text-base touch-manipulation min-h-[48px] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </button>
                <button
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="w-full flex-1 text-primary font-medium py-3 px-6 rounded-xl bg-white border-2 border-gray-300 hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md touch-manipulation min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>
        </div>
    );
};

export default Step5ReviewSubmit;