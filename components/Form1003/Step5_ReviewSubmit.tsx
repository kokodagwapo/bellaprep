import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

interface Step5Props {
    data: FormData;
    onBack: () => void;
}

const Step5ReviewSubmit: React.FC<Step5Props> = ({ data, onBack }) => {
    const handleSubmit = () => {
        alert("Application submitted successfully! (This is a demo)");
        // Here you would typically send the data to a backend server.
    };

    return (
        <div className="text-center">
            <StepHeader
                title="Review & Submit Your Application"
                subtitle="You have completed all the steps. Please review your information before final submission."
            />
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
                        className="w-full flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        Submit Application
                    </button>
                    <button
                        onClick={onBack}
                        className="w-full flex-1 text-secondary-foreground font-medium py-3 px-6 rounded-lg bg-secondary hover:bg-secondary/80 transition duration-300 inline-flex items-center justify-center"
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