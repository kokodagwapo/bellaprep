import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';
import { Lightbulb } from '../icons';
import { AddressAutofill } from '@mapbox/search-js-react';
import AddressSatelliteView, { AddressDetails } from '../ui/AddressSatelliteView';
import { MapPin, Eye } from 'lucide-react';


interface Step1Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack?: () => void;
}

const InputField: React.FC<{ label: string; id: keyof FormData; value: string | undefined; onChange: (id: keyof FormData, value: string) => void; fullWidth?: boolean; inputType?: string; placeholder?: string }> = ({ label, id, value, onChange, fullWidth = false, inputType = "text", placeholder }) => {
    const getInputType = () => {
        if (inputType) return inputType;
        if (id === 'email') return 'email';
        if (id === 'phoneNumber') return 'tel';
        if (id === 'dob') return 'text';
        return 'text';
    };
    
    return (
        <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
            <label htmlFor={id} className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
            <input
                type={getInputType()}
                id={id}
                value={value || ''}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full px-3 py-2 sm:py-2.5 bg-background border border-border rounded-lg shadow-sm text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[40px] sm:min-h-[42px]"
            />
        </div>
    );
};

const AddressInput: React.FC<{ 
    label: string; 
    id: keyof FormData; 
    value: string | undefined; 
    onChange: (id: keyof FormData, value: string) => void; 
    fullWidth?: boolean; 
    placeholder?: string;
    onValidationChange?: (isValid: boolean) => void;
}> = ({ label, id, value, onChange, fullWidth = false, placeholder, onValidationChange }) => {
    const addressInputRef = useRef<HTMLInputElement>(null);
    const isVerifiedRef = useRef(false);
    const [isVerified, setIsVerified] = useState(false);
    const [mapboxLoaded, setMapboxLoaded] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressPreview, setAddressPreview] = useState<AddressDetails | null>(null);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    // Initialize Mapbox
    useEffect(() => {
        const apiKey = import.meta.env.VITE_MAPBOX_API_KEY || '';
        if (apiKey && apiKey.trim().length > 0) {
            setMapboxLoaded(true);
            console.log('✅ Mapbox API key loaded successfully');
        } else {
            console.error('❌ Mapbox API key not found. Please set VITE_MAPBOX_API_KEY in your environment variables.');
            console.log('Environment check:', {
                hasKey: !!import.meta.env.VITE_MAPBOX_API_KEY,
                keyLength: import.meta.env.VITE_MAPBOX_API_KEY?.length || 0,
                keyPrefix: import.meta.env.VITE_MAPBOX_API_KEY?.substring(0, 10) || 'N/A'
            });
            setMapboxLoaded(false);
        }
    }, []);

    // Handle Mapbox address retrieval - improved to extract all address components and show preview modal
    const handleRetrieve = async (res: any) => {
        const feature = res.features[0];
        if (feature) {
            const properties = feature.properties || {};
            const context = feature.context || [];
            const coordinates = feature.geometry?.coordinates || [];
            
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
            
            // Build full formatted address - ensure it's never empty
            let formattedAddress = properties.full_address || properties.place_name || '';
            
            // If no full_address, build from components
            if (!formattedAddress) {
                const parts = [];
                if (street) parts.push(street);
                if (city) parts.push(city);
                if (state) parts.push(state);
                if (zip) parts.push(zip);
                formattedAddress = parts.join(', ');
            }
            
            // Fallback: use the feature's text/name if still empty
            if (!formattedAddress || formattedAddress.trim() === '') {
                formattedAddress = feature.text || feature.place_name || properties.name || properties.address_line || '';
            }
            
            // Ensure we have a valid address before proceeding
            if (!formattedAddress || formattedAddress.trim() === '') {
                console.warn('No address found in Mapbox response');
                return; // Don't clear the field if we can't extract an address
            }
            
            // Update the field immediately with the formatted address (before verification)
            onChange(id, formattedAddress.trim());
            
            // Verify address with Mapbox
            try {
                const { verifyAddress } = await import('../../services/addressVerificationService');
                const verification = await verifyAddress({
                    street,
                    city,
                    state,
                    zip
                });
                
                // Prepare address details for modal
                const verifiedFullAddress = verification.isValid && verification.normalizedAddress
                    ? `${verification.normalizedAddress.street}, ${verification.normalizedAddress.city}, ${verification.normalizedAddress.state} ${verification.normalizedAddress.zip}`
                    : formattedAddress;
                
                const addressDetails: AddressDetails = {
                    street: verification.normalizedAddress?.street || street,
                    city: verification.normalizedAddress?.city || city,
                    state: verification.normalizedAddress?.state || state,
                    zip: verification.normalizedAddress?.zip || zip,
                    fullAddress: verifiedFullAddress,
                    coordinates: coordinates.length >= 2 ? {
                        longitude: coordinates[0],
                        latitude: coordinates[1]
                    } : undefined,
                    verified: verification.isValid
                };
                
                // Update with verified address if different
                if (verification.isValid && verification.normalizedAddress) {
                    onChange(id, verifiedFullAddress);
                }
                
                // Store address details for modal (don't show automatically)
                setAddressPreview(addressDetails);
                
                    isVerifiedRef.current = true;
                    setIsVerified(true);
                    if (onValidationChange) {
                        onValidationChange(true);
                    }
                
                // Show verification message if address is verified
                if (verification.isValid) {
                    setShowVerificationMessage(true);
                    // Auto-hide verification message after 8 seconds
                    setTimeout(() => {
                        setShowVerificationMessage(false);
                    }, 8000);
                } else {
                    setShowVerificationMessage(false);
                }
            } catch (error) {
                console.error('Error verifying address:', error);
                // Address is already set above, store for modal (don't show automatically)
                const addressDetails: AddressDetails = {
                    street,
                    city,
                    state,
                    zip,
                    fullAddress: formattedAddress,
                    coordinates: coordinates.length >= 2 ? {
                        longitude: coordinates[0],
                        latitude: coordinates[1]
                    } : undefined,
                    verified: false
                };
                setAddressPreview(addressDetails);
                
                isVerifiedRef.current = true;
                setIsVerified(true);
                    if (onValidationChange) {
                    onValidationChange(true);
                }
            }
        }
    };

    // Validate address on value change
    useEffect(() => {
        const isValid = value ? value.trim().length > 5 : false;
        if (!isVerified && onValidationChange) {
            onValidationChange(isValid);
        }
    }, [value, isVerified, onValidationChange]);

    return (
        <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
            <label htmlFor={id} className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {label}
            </label>
            <div className="relative group">
                {/* Enhanced input container with gradient border effect */}
                <div className={`relative rounded-xl sm:rounded-lg overflow-hidden transition-all duration-300 ${
                    isVerified 
                        ? 'ring-2 ring-green-400/50 shadow-lg shadow-green-100/50' 
                        : 'ring-1 ring-border/50 shadow-md hover:shadow-lg'
                } ${value && value.trim().length > 0 ? 'ring-primary/30' : ''}`}>
                    {mapboxLoaded ? (
                        <AddressAutofill
                            accessToken={import.meta.env.VITE_MAPBOX_API_KEY || ''}
                            onRetrieve={handleRetrieve}
                            options={{
                                country: 'US',
                                language: 'en'
                            }}
                        >
                            <input
                                ref={addressInputRef}
                                type="text"
                                id={id}
                                name={`${id} address-search`}
                                value={value || ''}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    onChange(id, newValue);
                                    // Reset verification when manually editing (only if it was verified)
                                    if (isVerifiedRef.current) {
                                        isVerifiedRef.current = false;
                                        setIsVerified(false);
                                        setAddressPreview(null); // Clear stored address when manually editing
                                        setShowVerificationMessage(false);
                                    }
                                }}
                                placeholder={placeholder || "Start typing your address (e.g., 123 Main St, City, State ZIP)"}
                                className="block w-full px-3 py-2 sm:py-2.5 bg-gradient-to-br from-white to-gray-50/50 border-0 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[40px] sm:min-h-[42px] pr-12"
                                autoComplete="new-password"
                                data-lpignore="true"
                                aria-autocomplete="list"
                                aria-controls={`${id}-ResultsList`}
                            />
                        </AddressAutofill>
                    ) : (
                <input
                    ref={addressInputRef}
                    type="text"
                    id={id}
                    value={value || ''}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        onChange(id, newValue);
                        // Reset verification when manually editing (only if it was verified)
                        if (isVerifiedRef.current) {
                            isVerifiedRef.current = false;
                            setIsVerified(false);
                                    setAddressPreview(null); // Clear stored address when manually editing
                                    setShowVerificationMessage(false); // Hide verification message
                        }
                    }}
                            placeholder={placeholder || "Start typing your address..."}
                            className="block w-full px-4 py-3.5 sm:px-4 sm:py-3 bg-gradient-to-br from-white to-gray-50/50 border-0 text-base sm:text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px] pr-14"
                    autoComplete="address-line1"
                />
                    )}
                    {/* Beautiful icon button with enhanced styling - Hidden for now */}
                    {false && (
                        <button
                            type="button"
                            onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // If addressPreview exists, use it; otherwise, geocode the current address
                            if (addressPreview && addressPreview.coordinates) {
                                setShowAddressModal(true);
                            } else {
                                // Show loading state
                                const button = e.currentTarget;
                                const originalContent = button.innerHTML;
                                button.disabled = true;
                                button.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>';
                                
                                try {
                                    // Try to get coordinates using Mapbox Geocoding API first (faster)
                                    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
                                    let coordinates: { longitude: number; latitude: number } | undefined;
                                    let street = '';
                                    let city = '';
                                    let state = '';
                                    let zip = '';
                                    
                                    if (apiKey) {
                                        try {
                                            const geocodeResponse = await fetch(
                                                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value || '')}.json?access_token=${apiKey}&country=US&limit=1&types=address`
                                            );
                                            const geocodeData = await geocodeResponse.json();
                                            
                                            if (geocodeData.features && geocodeData.features.length > 0) {
                                                const feature = geocodeData.features[0];
                                                const coords = feature.geometry?.coordinates;
                                                if (coords && coords.length >= 2) {
                                                    coordinates = {
                                                        longitude: coords[0],
                                                        latitude: coords[1]
                                                    };
                                                }
                                                
                                                // Extract address components from geocoded result
                                                const properties = feature.properties || {};
                                                const context = feature.context || [];
                                                
                                                street = properties.address_line || properties.name || (value ? value.split(',')[0] : '') || value || '';
                                                
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
                                            }
                                        } catch (geocodeError) {
                                            console.warn('Could not geocode address for map:', geocodeError);
                                        }
                                    }
                                    
                                    // Verify address with Mapbox if we have components
                                    let verified = false;
                                    if (street || city || state || zip) {
                                        try {
                                            const { verifyAddress } = await import('../../services/addressVerificationService');
                                            const verification = await verifyAddress({
                                                street: street || value,
                                                city,
                                                state,
                                                zip
                                            });
                                            
                                            if (verification.isValid && verification.normalizedAddress) {
                                                street = verification.normalizedAddress.street || street;
                                                city = verification.normalizedAddress.city || city;
                                                state = verification.normalizedAddress.state || state;
                                                zip = verification.normalizedAddress.zip || zip;
                                                verified = true;
                                            }
                                        } catch (verifyError) {
                                            console.warn('Could not verify address:', verifyError);
                                        }
                                    }
                                    
                                    const fullAddress = street && city && state && zip
                                        ? `${street}, ${city}, ${state} ${zip}`
                                        : (value || '');
                                    
                                    const addressDetails: AddressDetails = {
                                        street: street || (value ? value.split(',')[0] : '') || value || '',
                                        city: city || '',
                                        state: state || '',
                                        zip: zip || '',
                                        fullAddress: fullAddress,
                                        coordinates: coordinates,
                                        verified: verified
                                    };
                                    
                                    setAddressPreview(addressDetails);
                                    setShowAddressModal(true);
                                } catch (error) {
                                    console.error('Error processing address:', error);
                                    // Still show modal with basic address info
                                    const addressDetails: AddressDetails = {
                                        street: (value ? value.split(',')[0] : '') || value || '',
                                        city: '',
                                        state: '',
                                        zip: '',
                                        fullAddress: value,
                                        coordinates: undefined,
                                        verified: false
                                    };
                                    setAddressPreview(addressDetails);
                                    setShowAddressModal(true);
                                } finally {
                                    // Restore button state
                                    button.disabled = false;
                                    button.innerHTML = originalContent;
                                }
                            }
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/15 to-primary/20 hover:from-primary/20 hover:via-primary/25 hover:to-primary/30 text-primary shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-primary/20"
                        aria-label="View and confirm address"
                        title="View and confirm address on map"
                    >
                        <Eye className="h-5 w-5 drop-shadow-sm" />
                    </button>
                    )}
                    {/* Verified checkmark badge */}
                    {isVerified && !addressPreview && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
                {/* Enhanced verification message */}
                {showVerificationMessage && isVerified && value && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start gap-2"
                    >
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                        <div className="flex-1">
                            <p className="font-semibold text-green-900 mb-1">Address Verified ✓</p>
                            <p className="text-green-700">Address verified and correct. Please double-check to ensure accuracy.</p>
                        </div>
                    </motion.div>
                )}
            </div>
            
            {/* Inline Satellite View */}
            <AddressSatelliteView
                address={addressPreview}
                isVisible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onConfirm={() => {
                    // Address is already set in handleRetrieve, just close view
                    if (addressPreview?.fullAddress) {
                        onChange(id, addressPreview.fullAddress);
                    }
                    setShowAddressModal(false);
                }}
            />
        </div>
    );
};

const Step1BorrowerInfo: React.FC<Step1Props> = ({ data, onDataChange, onNext, onBack }) => {
    const [addressValid, setAddressValid] = useState(false);
    
    const handleFieldChange = (id: keyof FormData, value: string) => {
        onDataChange({ [id]: value });
    };
    
    // Allow form completion if address is verified OR if it's a reasonable length (manual entry)
    const addressIsValid = addressValid || (data.borrowerAddress && data.borrowerAddress.trim().length > 5);
    const isComplete = data.fullName && data.borrowerAddress && addressIsValid && data.dob && data.email && data.phoneNumber;

    // Backward compatibility: Pre-fill from Prep4Loan data if available
    useEffect(() => {
        if (!data.fullName && data.fullName === undefined) {
            // Could check for other name fields if they exist
        }
        // Address is already handled by borrowerAddress field
    }, [data]);

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 1: Borrower Information" subtitle="This information is about you, the Borrower." />
            
            {/* Bella's Insight */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 sm:p-3 text-blue-800 rounded-md flex items-start gap-2 sm:gap-2.5 mt-3 mb-4">
                <Lightbulb className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold">Bella's Insight:</span> Make sure to use your full legal name exactly as it appears on your government-issued ID. This helps prevent delays during verification!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <InputField label="Full Legal Name" id="fullName" value={data.fullName} onChange={handleFieldChange} fullWidth placeholder="Enter your full legal name" />
                <AddressInput 
                    label="Current Home Address" 
                    id="borrowerAddress" 
                    value={data.borrowerAddress} 
                    onChange={handleFieldChange} 
                    fullWidth 
                    placeholder="Street address, City, State ZIP"
                    onValidationChange={setAddressValid}
                />
                <InputField label="Date of Birth (MM/DD/YYYY)" id="dob" value={data.dob} onChange={handleFieldChange} placeholder="MM/DD/YYYY" />
                <InputField label="Email Address" id="email" value={data.email} onChange={handleFieldChange} inputType="email" placeholder="your.email@example.com" />
                <InputField label="Phone Number" id="phoneNumber" value={data.phoneNumber} onChange={handleFieldChange} inputType="tel" placeholder="(555) 123-4567" />
            </div>

            {/* Address verification tip */}
            {addressValid && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-3 text-green-800 rounded-md flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs">
                        <span className="font-semibold">Great!</span> Your address has been verified. This will speed up your application processing.
                    </p>
                </div>
            )}

            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isComplete} />
            </div>
        </div>
    );
};

export default Step1BorrowerInfo;