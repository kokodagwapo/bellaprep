import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { FormData, EmploymentInfo } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';
import { MapPin } from 'lucide-react';
import { AddressAutofill } from '@mapbox/search-js-react';

interface Step2bProps {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step2bEmploymentDetails: React.FC<Step2bProps> = ({ data, onDataChange, onNext, onBack }) => {
    const [mapboxLoaded, setMapboxLoaded] = useState(false);

    // Initialize Mapbox
    useEffect(() => {
        const apiKey = import.meta.env.VITE_MAPBOX_API_KEY || '';
        if (apiKey) {
            setMapboxLoaded(true);
        } else {
            console.warn('Mapbox API key not found. Please set VITE_MAPBOX_API_KEY in your environment variables.');
            setMapboxLoaded(false);
        }
    }, []);

    // Backward compatibility: Map from Prep4Loan employment data
    useEffect(() => {
        if (data.employmentStatus && !data.currentEmployment) {
            const employment: EmploymentInfo = {
                employerName: '',
                employerAddress: {
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                position: '',
                startDate: '',
                monthlyIncome: {
                    base: data.income || 0
                },
                isSelfEmployed: data.employmentStatus === 'Self-Employed',
                isBusinessOwner: data.employmentStatus === 'Self-Employed'
            };
            onDataChange({ currentEmployment: employment });
        }
    }, [data.employmentStatus, data.income, onDataChange]);

    const handleEmploymentChange = (field: keyof EmploymentInfo, value: any) => {
        onDataChange({
            currentEmployment: {
                ...data.currentEmployment,
                [field]: value
            } as EmploymentInfo
        });
    };

    const handleAddressChange = (field: string, value: string) => {
        onDataChange({
            currentEmployment: {
                ...data.currentEmployment,
                employerAddress: {
                    ...data.currentEmployment?.employerAddress,
                    [field]: value
                }
            } as EmploymentInfo
        });
    };

    const isSelfEmployed = data.currentEmployment?.isSelfEmployed || data.employmentStatus === 'Self-Employed';
    
    // Calculate total months from current employment
    const calculateTotalMonths = (): number => {
        if (data.currentEmployment?.yearsInLineOfWork !== undefined && data.currentEmployment?.monthsInLineOfWork !== undefined) {
            return (data.currentEmployment.yearsInLineOfWork * 12) + data.currentEmployment.monthsInLineOfWork;
        }
        // Fallback: calculate from start date if available
        if (data.currentEmployment?.startDate) {
            const startDate = new Date(data.currentEmployment.startDate);
            const today = new Date();
            const monthsDiff = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
            return Math.max(0, monthsDiff);
        }
        // Fallback: use timeInJob from Prep4Loan
        if (data.timeInJob === 'Less than 1 year') return 6; // Estimate
        if (data.timeInJob === '1-2 years') return 18; // Estimate
        if (data.timeInJob === 'More than 2 years') return 30; // Estimate
        return 0;
    };

    const totalMonths = calculateTotalMonths();
    const needsPreviousEmployment = totalMonths < 24;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader 
                title="Section 2b: Employment Details" 
                subtitle="Detailed information about your current employment and income." 
            />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm">
                    <span className="font-semibold">Bella's Insight:</span> Lenders require a total of <strong>24 months of work history</strong>. If your current employment is less than 24 months, we'll need information about your previous employment to complete the requirement. Jobs don't need to be the same or continuous. For self-employed borrowers, tax returns are usually required.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
                {/* Employer Name */}
                <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        {isSelfEmployed ? 'Business Name' : 'Employer Name'} *
                    </label>
                    <input
                        type="text"
                        value={data.currentEmployment?.employerName || ''}
                        onChange={(e) => handleEmploymentChange('employerName', e.target.value)}
                        placeholder={isSelfEmployed ? 'Your business name' : 'Company name'}
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    />
                </div>

                {/* Position/Title */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        Position / Job Title *
                    </label>
                    <input
                        type="text"
                        value={data.currentEmployment?.position || ''}
                        onChange={(e) => handleEmploymentChange('position', e.target.value)}
                        placeholder="e.g., Software Engineer, Manager"
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    />
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        Employment Start Date *
                    </label>
                    <input
                        type="date"
                        value={data.currentEmployment?.startDate || ''}
                        onChange={(e) => handleEmploymentChange('startDate', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    />
                </div>

                {/* Years in Line of Work */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        Years in This Job *
                    </label>
                    <select
                        value={data.currentEmployment?.yearsInLineOfWork || ''}
                        onChange={(e) => handleEmploymentChange('yearsInLineOfWork', parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    >
                        <option value="">Select...</option>
                        {Array.from({ length: 20 }, (_, i) => (
                            <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
                        ))}
                    </select>
                </div>

                {/* Months in Line of Work */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        Additional Months *
                    </label>
                    <select
                        value={data.currentEmployment?.monthsInLineOfWork || ''}
                        onChange={(e) => handleEmploymentChange('monthsInLineOfWork', parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    >
                        <option value="">Select...</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{i} {i === 1 ? 'month' : 'months'}</option>
                        ))}
                    </select>
                </div>

                {/* Total Months Display */}
                {totalMonths > 0 && (
                    <div className="sm:col-span-2">
                        <div className={`p-3 rounded-lg border ${
                            totalMonths < 24 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-green-50 border-green-200'
                        }`}>
                            <p className="text-sm font-medium text-black">
                                Total Employment History: <span className={totalMonths < 24 ? 'text-yellow-700' : 'text-green-700'}>{totalMonths} months</span>
                                {totalMonths < 24 && <span className="text-yellow-700 ml-2">(Prior employment required)</span>}
                            </p>
                        </div>
                    </div>
                )}

                {/* Monthly Income */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                        Gross Monthly Income *
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.currentEmployment?.monthlyIncome?.base ? `$${data.currentEmployment.monthlyIncome.base.toLocaleString()}` : ''}
                        onChange={(e) => {
                            const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                            handleEmploymentChange('monthlyIncome', { base: value });
                        }}
                        className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                    />
                </div>

                {/* Employer Address */}
                <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Employer Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <div className="relative rounded-xl sm:rounded-lg overflow-hidden ring-1 ring-border/50 shadow-md hover:shadow-lg transition-all duration-300">
                                {mapboxLoaded ? (
                                    <AddressAutofill
                                        accessToken={import.meta.env.VITE_MAPBOX_API_KEY || ''}
                                        onRetrieve={async (res: any) => {
                                            const feature = res.features[0];
                                            if (feature) {
                                                const properties = feature.properties || {};
                                                const context = feature.context || [];
                                                
                                                // Extract address components
                                                const street = properties.address_line || properties.name || '';
                                                let city = '';
                                                let state = '';
                                                let zip = '';
                                                
                                                // Extract from context
                                                context.forEach((item: any) => {
                                                    if (item.id?.startsWith('place')) {
                                                        city = item.text || '';
                                                    }
                                                    if (item.id?.startsWith('region')) {
                                                        state = item.short_code?.replace('US-', '') || '';
                                                    }
                                                    if (item.id?.startsWith('postcode')) {
                                                        zip = item.text || '';
                                                    }
                                                });
                                                
                                                // Auto-populate all fields
                                                handleAddressChange('street', street);
                                                if (city) handleAddressChange('city', city);
                                                if (state) handleAddressChange('state', state);
                                                if (zip) handleAddressChange('zip', zip);
                                            }
                                        }}
                                        options={{
                                            country: 'US',
                                            language: 'en'
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={data.currentEmployment?.employerAddress?.street || ''}
                                            onChange={(e) => handleAddressChange('street', e.target.value)}
                                            placeholder="Start typing your address..."
                                            className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
                                            autoComplete="address-line1"
                                        />
                                    </AddressAutofill>
                                ) : (
                                    <input
                                        type="text"
                                        value={data.currentEmployment?.employerAddress?.street || ''}
                                        onChange={(e) => handleAddressChange('street', e.target.value)}
                                        placeholder="Start typing your address..."
                                        className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
                                        autoComplete="address-line1"
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="relative rounded-xl sm:rounded-lg overflow-hidden ring-1 ring-border/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <input
                                    type="text"
                                    value={data.currentEmployment?.employerAddress?.city || ''}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    placeholder="City"
                                    className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative rounded-xl sm:rounded-lg overflow-hidden ring-1 ring-border/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <input
                                    type="text"
                                    value={data.currentEmployment?.employerAddress?.state || ''}
                                    onChange={(e) => handleAddressChange('state', e.target.value.toUpperCase().slice(0, 2))}
                                    placeholder="State"
                                    maxLength={2}
                                    className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px] uppercase"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative rounded-xl sm:rounded-lg overflow-hidden ring-1 ring-border/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.currentEmployment?.employerAddress?.zip || ''}
                                    onChange={async (e) => {
                                        // Allow only digits, limit to 5 characters
                                        const zip = e.target.value.replace(/\D/g, '').slice(0, 5);
                                        handleAddressChange('zip', zip);
                                        // Auto-fill city/state from ZIP when 5 digits entered and verify with Mapbox
                                        if (zip.length === 5) {
                                            try {
                                                const { getCityStateFromZip } = await import('../../services/addressVerificationService');
                                                const cityState = await getCityStateFromZip(zip);
                                                if (cityState) {
                                                    handleAddressChange('city', cityState.city);
                                                    handleAddressChange('state', cityState.state);
                                                }
                                            } catch (error) {
                                                console.error('Error verifying ZIP code with Mapbox:', error);
                                            }
                                        }
                                    }}
                                    placeholder="ZIP Code"
                                    maxLength={5}
                                    minLength={5}
                                    className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Previous Employment (Required if < 24 months) */}
            {needsPreviousEmployment && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-border"
                >
                    <div className="mb-4">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">
                            [6B] Prior Employment (Required - Total months &lt; 24)
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                            Please provide your previous job information.
                        </p>
                        
                        {/* Tooltip */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-blue-800 rounded-md flex items-start gap-2 mb-4">
                            <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs">
                                <span className="font-semibold">Important:</span> Lenders require a total of <strong>24 months of work history</strong>. Jobs do <strong>not</strong> need to be the same or continuous.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Previous Employer Name (Optional) */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Previous Employer Name <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={data.priorEmployment?.employerName || ''}
                                onChange={(e) => onDataChange({
                                    priorEmployment: { ...data.priorEmployment, employerName: e.target.value }
                                })}
                                placeholder="Company name (optional)"
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            />
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Job Type *
                            </label>
                            <input
                                type="text"
                                value={data.priorEmployment?.jobType || ''}
                                onChange={(e) => onDataChange({
                                    priorEmployment: { ...data.priorEmployment, jobType: e.target.value }
                                })}
                                placeholder="e.g., Manager, Engineer"
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            />
                        </div>

                        {/* Years Worked (Dropdown) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Years Worked *
                            </label>
                            <select
                                value={data.priorEmployment?.timeInPreviousJob?.split(' ')[0] || ''}
                                onChange={(e) => {
                                    const years = parseInt(e.target.value) || 0;
                                    const months = data.priorEmployment?.timeInPreviousJob?.includes('months') 
                                        ? parseInt(data.priorEmployment.timeInPreviousJob.split('months')[0].split(' ').pop() || '0') || 0
                                        : 0;
                                    onDataChange({
                                        priorEmployment: { 
                                            ...data.priorEmployment, 
                                            timeInPreviousJob: `${years} years ${months} months`.trim()
                                        }
                                    });
                                }}
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            >
                                <option value="">Select years...</option>
                                {Array.from({ length: 20 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Months Worked (Dropdown) */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                                Additional Months *
                            </label>
                            <select
                                value={(() => {
                                    const timeStr = data.priorEmployment?.timeInPreviousJob || '';
                                    const monthsMatch = timeStr.match(/(\d+)\s*months?/);
                                    return monthsMatch ? monthsMatch[1] : '';
                                })()}
                                onChange={(e) => {
                                    const months = parseInt(e.target.value) || 0;
                                    const years = data.priorEmployment?.timeInPreviousJob?.match(/(\d+)\s*years?/)?.[1] || '0';
                                    onDataChange({
                                        priorEmployment: { 
                                            ...data.priorEmployment, 
                                            timeInPreviousJob: `${years} years ${months} months`.trim()
                                        }
                                    });
                                }}
                                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
                            >
                                <option value="">Select months...</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>{i} {i === 1 ? 'month' : 'months'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Total Months Calculation Display */}
                        {(() => {
                            const prevYears = parseInt(data.priorEmployment?.timeInPreviousJob?.match(/(\d+)\s*years?/)?.[1] || '0') || 0;
                            const prevMonths = parseInt(data.priorEmployment?.timeInPreviousJob?.match(/(\d+)\s*months?/)?.[1] || '0') || 0;
                            const prevTotalMonths = (prevYears * 12) + prevMonths;
                            const combinedTotal = totalMonths + prevTotalMonths;
                            
                            return combinedTotal > 0 && (
                                <div className="sm:col-span-2">
                                    <div className={`p-3 rounded-lg border ${
                                        combinedTotal < 24 
                                            ? 'bg-yellow-50 border-yellow-200' 
                                            : 'bg-green-50 border-green-200'
                                    }`}>
                                        <p className="text-sm font-medium text-black">
                                            Combined Employment History: <span className={combinedTotal < 24 ? 'text-yellow-700' : 'text-green-700'}>{combinedTotal} months</span>
                                            {combinedTotal < 24 && <span className="text-yellow-700 ml-2">(Need {24 - combinedTotal} more months)</span>}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </motion.div>
            )}

            {/* Self-Employment Note */}
            {isSelfEmployed && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800 rounded-md flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs">
                        <span className="font-semibold">Note:</span> Self-employed borrowers typically need to provide 2 years of tax returns and may need additional documentation such as profit & loss statements.
                    </p>
                </div>
            )}

            {/* Calculate if prior employment is complete */}
            {(() => {
                const isPriorEmploymentComplete = (): boolean => {
                    if (!needsPreviousEmployment) return true;
                    
                    const prevYears = parseInt(data.priorEmployment?.timeInPreviousJob?.match(/(\d+)\s*years?/)?.[1] || '0') || 0;
                    const prevMonths = parseInt(data.priorEmployment?.timeInPreviousJob?.match(/(\d+)\s*months?/)?.[1] || '0') || 0;
                    const prevTotalMonths = (prevYears * 12) + prevMonths;
                    const combinedTotal = totalMonths + prevTotalMonths;
                    
                    // Need at least 24 months total, and prior employment must have job type and duration
                    return combinedTotal >= 24 && !!data.priorEmployment?.jobType && prevTotalMonths > 0;
                };

                const isComplete = 
                    !!data.currentEmployment?.employerName &&
                    !!data.currentEmployment?.position &&
                    !!data.currentEmployment?.startDate &&
                    !!data.currentEmployment?.monthlyIncome?.base &&
                    data.currentEmployment.monthlyIncome.base > 0 &&
                    data.currentEmployment?.yearsInLineOfWork !== undefined &&
                    data.currentEmployment?.monthsInLineOfWork !== undefined &&
                    isPriorEmploymentComplete();

                return (
                    <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                        <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
                    </div>
                );
            })()}
        </div>
    );
};

export default Step2bEmploymentDetails;

