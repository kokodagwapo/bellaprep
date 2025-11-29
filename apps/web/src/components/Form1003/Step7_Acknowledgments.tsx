import React, { useState } from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';

interface Step7Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step7Acknowledgments: React.FC<Step7Props> = ({ data, onDataChange, onNext, onBack }) => {
    const [acknowledgments, setAcknowledgments] = useState({
        fairLending: false,
        privacy: false,
        accuracy: false,
        authorization: false
    });

    const handleAcknowledge = (key: keyof typeof acknowledgments) => {
        setAcknowledgments(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isComplete = 
        acknowledgments.fairLending &&
        acknowledgments.privacy &&
        acknowledgments.accuracy &&
        acknowledgments.authorization;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader 
                title="Section 7: Acknowledgments & Agreements" 
                subtitle="Please read and acknowledge the following agreements." 
            />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm">
                    <span className="font-semibold">Bella's Insight:</span> These acknowledgments are required by federal law to ensure you understand your rights and responsibilities. Please read each section carefully before proceeding.
                </p>
            </div>

            <div className="space-y-4 mt-6">
                {/* Fair Lending Acknowledgment */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                        Fair Lending Acknowledgment *
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                        The Equal Credit Opportunity Act prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age, because all or part of the applicant's income derives from any public assistance program, or because the applicant has in good faith exercised any right under the Consumer Credit Protection Act.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledgments.fairLending}
                            onChange={() => handleAcknowledge('fairLending')}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
                        />
                        <span className="text-xs sm:text-sm text-foreground">
                            I acknowledge that I have read and understand the Fair Lending Notice *
                        </span>
                    </label>
                </div>

                {/* Privacy Acknowledgment */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                        Privacy Notice Acknowledgment *
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                        We collect nonpublic personal information about you from applications and other forms, transactions with us, and credit reporting agencies. We do not disclose any nonpublic personal information about you to anyone, except as permitted by law. We restrict access to your personal information to those employees who need to know that information to provide products or services to you.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledgments.privacy}
                            onChange={() => handleAcknowledge('privacy')}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
                        />
                        <span className="text-xs sm:text-sm text-foreground">
                            I acknowledge that I have read and understand the Privacy Notice *
                        </span>
                    </label>
                </div>

                {/* Accuracy Acknowledgment */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                        Accuracy of Information *
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                        I understand that I am applying for a mortgage loan and that the information I have provided in this application is true and complete to the best of my knowledge. I understand that false statements or misrepresentations may result in denial of credit, revocation of credit, or civil and criminal penalties.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledgments.accuracy}
                            onChange={() => handleAcknowledge('accuracy')}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
                        />
                        <span className="text-xs sm:text-sm text-foreground">
                            I certify that all information provided is accurate and complete *
                        </span>
                    </label>
                </div>

                {/* Authorization Acknowledgment */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                        Authorization to Obtain Credit Report *
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                        I authorize the lender and its agents to obtain credit reports and verify information provided in this application. I understand that this authorization will remain in effect throughout the loan process and that credit reports may be obtained periodically.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledgments.authorization}
                            onChange={() => handleAcknowledge('authorization')}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
                        />
                        <span className="text-xs sm:text-sm text-foreground">
                            I authorize the lender to obtain my credit report and verify information *
                        </span>
                    </label>
                </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
            </div>
        </div>
    );
};

export default Step7Acknowledgments;

