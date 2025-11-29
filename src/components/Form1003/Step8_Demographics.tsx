import React from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';

interface Step8Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step8Demographics: React.FC<Step8Props> = ({ data, onDataChange, onNext, onBack }) => {
    const handleEthnicityChange = (field: 'hispanicOrLatino' | 'notHispanicOrLatino' | 'declineToAnswer', value: boolean) => {
        onDataChange({
            ethnicity: {
                ...data.ethnicity,
                [field]: value,
                // Reset others if selecting one
                ...(field === 'hispanicOrLatino' && value ? { notHispanicOrLatino: false, declineToAnswer: false } : {}),
                ...(field === 'notHispanicOrLatino' && value ? { hispanicOrLatino: false, declineToAnswer: false } : {}),
                ...(field === 'declineToAnswer' && value ? { hispanicOrLatino: false, notHispanicOrLatino: false } : {})
            }
        });
    };

    const handleRaceChange = (field: 'americanIndianOrAlaskaNative' | 'asian' | 'blackOrAfricanAmerican' | 'nativeHawaiianOrPacificIslander' | 'white' | 'declineToAnswer', value: boolean) => {
        onDataChange({
            race: {
                ...data.race,
                [field]: value
            }
        });
    };

    // Demographics are optional - always allow progression
    return (
        <div className="px-2 sm:px-0">
            <StepHeader 
                title="Section 8: Demographic Information (Optional)" 
                subtitle="This information is collected for government monitoring purposes and is optional." 
            />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm">
                    <span className="font-semibold">Bella's Insight:</span> This demographic information is collected to help ensure fair lending practices and compliance with the Home Mortgage Disclosure Act (HMDA). Providing this information is completely optional and will not affect your loan application in any way.
                </p>
            </div>

            <div className="space-y-6 mt-6">
                {/* Ethnicity */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                        Ethnicity (Optional)
                    </h4>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.ethnicity?.hispanicOrLatino || false}
                                onChange={(e) => handleEthnicityChange('hispanicOrLatino', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">Hispanic or Latino</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.ethnicity?.notHispanicOrLatino || false}
                                onChange={(e) => handleEthnicityChange('notHispanicOrLatino', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">Not Hispanic or Latino</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.ethnicity?.declineToAnswer || false}
                                onChange={(e) => handleEthnicityChange('declineToAnswer', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">I do not wish to provide this information</span>
                        </label>
                    </div>
                </div>

                {/* Race */}
                <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                        Race (Optional - Select all that apply)
                    </h4>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.americanIndianOrAlaskaNative || false}
                                onChange={(e) => handleRaceChange('americanIndianOrAlaskaNative', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">American Indian or Alaska Native</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.asian || false}
                                onChange={(e) => handleRaceChange('asian', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">Asian</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.blackOrAfricanAmerican || false}
                                onChange={(e) => handleRaceChange('blackOrAfricanAmerican', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">Black or African American</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.nativeHawaiianOrPacificIslander || false}
                                onChange={(e) => handleRaceChange('nativeHawaiianOrPacificIslander', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">Native Hawaiian or Other Pacific Islander</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.white || false}
                                onChange={(e) => handleRaceChange('white', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">White</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.race?.declineToAnswer || false}
                                onChange={(e) => handleRaceChange('declineToAnswer', e.target.checked)}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm text-foreground">I do not wish to provide this information</span>
                        </label>
                    </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-400 p-3 text-gray-800 rounded-md">
                    <p className="text-xs">
                        <span className="font-semibold">Note:</span> This information is used for government monitoring purposes to ensure compliance with fair lending laws. Your response is voluntary and will not affect your loan application.
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} onBack={onBack} />
            </div>
        </div>
    );
};

export default Step8Demographics;

