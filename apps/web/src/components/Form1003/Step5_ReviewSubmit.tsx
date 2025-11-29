import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb, CheckCircle2 } from '../icons';

interface Step5Props {
    data: FormData;
    onBack: () => void;
}

const Step5ReviewSubmit: React.FC<Step5Props> = ({ data, onBack }) => {
    const handleSubmit = () => {
        alert("Application submitted successfully! (This is a demo)");
        // Here you would typically send the data to a backend server.
    };

    // Check form completeness
    const isFormComplete = 
        !!data.fullName && 
        !!data.borrowerAddress && 
        !!data.dob && 
        !!data.email && 
        !!data.phoneNumber &&
        !!data.income && data.income > 0 &&
        !!data.loanAmount && data.loanAmount > 0 &&
        (data.goal === 'Refinance My Mortgage' ? !!data.estimatedPropertyValue : !!data.purchasePrice) &&
        data.isFirstTimeBuyer !== null &&
        data.isMilitary !== null;

    return (
        <div className="text-center px-2 sm:px-0">
            <StepHeader
                title="Review & Submit Your Application"
                subtitle="You have completed all the steps. Please review your information before final submission."
            />
            
            {/* Bella's Final Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4 text-left">
                <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold mb-1.5">Bella's Final Check:</p>
                    <p className="text-xs sm:text-sm leading-relaxed">
                        {isFormComplete 
                            ? "Everything looks great! Your application is complete and ready to submit. After submission, a loan officer will review your application and contact you within 1-2 business days."
                            : "Almost there! Please make sure all required fields are filled out before submitting. This helps ensure a smooth review process."}
                    </p>
                </div>
            </div>

            {/* Completion Checklist */}
            <div className="mt-6 mb-8 text-left max-w-2xl mx-auto">
                <h3 className="text-sm font-semibold text-foreground mb-4">Application Checklist:</h3>
                <div className="space-y-2">
                    {[
                        { label: 'Borrower Information', complete: !!(data.fullName && data.borrowerAddress && data.dob && data.email && data.phoneNumber) },
                        { label: 'Financial Information', complete: !!(data.income && data.income > 0 && data.loanAmount && data.loanAmount > 0) },
                        { label: 'Property Information', complete: !!(data.propertyType && data.propertyUse && (data.purchasePrice || data.estimatedPropertyValue)) },
                        { label: 'Declarations', complete: data.isFirstTimeBuyer !== null && data.isMilitary !== null },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {item.complete ? (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${item.complete ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 mx-auto w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full">
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <p className="mt-6 text-muted-foreground">
                By clicking "Submit Application", you are confirming that all information provided is accurate to the best of your knowledge.
            </p>
            <div className="mt-10">
                <div className="flex flex-col sm:flex-row-reverse gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormComplete}
                        className="w-full flex-1 bg-primary text-primary-foreground font-bold py-3 sm:py-3 px-6 rounded-xl sm:rounded-xl hover:bg-primary/90 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring shadow-lg hover:shadow-xl text-base sm:text-base touch-manipulation min-h-[48px] sm:min-h-[44px] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Submit Application
                    </button>
                    <button
                        onClick={onBack}
                        className="w-full flex-1 text-primary font-medium py-3 sm:py-3 px-6 rounded-xl sm:rounded-xl bg-white border-2 border-gray-300 hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md touch-manipulation min-h-[48px] sm:min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Declarations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step5ReviewSubmit;