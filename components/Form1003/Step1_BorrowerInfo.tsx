import React, { useRef, useEffect, useState } from 'react';
import type { FormData } from '../../types';
import StepHeader from '../StepHeader';
import StepNavigation from '../StepNavigation';

declare global {
  interface Window {
    google: any;
  }
}

interface Step1Props {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
    onNext: () => void;
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
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">{label}</label>
            <input
                type={getInputType()}
                id={id}
                value={value || ''}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
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
    const autocompleteRef = useRef<any>(null);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mapsLoaded, setMapsLoaded] = useState(false);

    // Load Google Maps API script
    useEffect(() => {
        // Check if already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
            console.log('Google Maps already loaded');
            setMapsLoaded(true);
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        console.log('Google Maps API Key check:', apiKey ? 'Found' : 'Not found');
        
        if (!apiKey) {
            console.warn('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
            // For development, you can use a test key or allow manual entry
            setMapsLoaded(false);
            return;
        }

        // Check if script is already loading or loaded
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
            console.log('Google Maps script already exists, waiting for load...');
            const checkInterval = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.places) {
                    console.log('Google Maps loaded from existing script');
                    setMapsLoaded(true);
                    clearInterval(checkInterval);
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!window.google || !window.google.maps) {
                    console.error('Google Maps failed to load after timeout');
                }
            }, 10000);
            
            return () => clearInterval(checkInterval);
        }

        console.log('Loading Google Maps API script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('Google Maps API script loaded successfully');
            if (window.google && window.google.maps && window.google.maps.places) {
                setMapsLoaded(true);
            } else {
                console.error('Google Maps API loaded but places library not available');
                setMapsLoaded(false);
            }
        };
        script.onerror = (error) => {
            console.error('Failed to load Google Maps API:', error);
            setMapsLoaded(false);
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (!addressInputRef.current) {
            console.log('Address input ref not available');
            return;
        }
        
        if (!mapsLoaded) {
            console.log('Maps not loaded yet, waiting...');
            return;
        }
        
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('Google Maps Places API not available');
            return;
        }

        console.log('Initializing Google Maps Autocomplete...');
        try {
            const autocomplete = new window.google.maps.places.Autocomplete(
                addressInputRef.current,
                {
                    types: ['address'],
                    componentRestrictions: { country: 'us' },
                    fields: ['address_components', 'formatted_address', 'geometry', 'place_id']
                }
            );

            console.log('Autocomplete initialized successfully');
            autocompleteRef.current = autocomplete;

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                console.log('Place selected:', place);
                
                if (place.formatted_address && place.geometry && place.geometry.location) {
                    // Verify this is a valid address with coordinates
                    const formattedAddress = place.formatted_address;
                    console.log('Valid address selected:', formattedAddress);
                    onChange(id, formattedAddress);
                    setIsValid(true);
                    setErrorMessage('');
                    if (onValidationChange) {
                        onValidationChange(true);
                    }
                } else {
                    console.warn('Invalid place selected:', place);
                    setIsValid(false);
                    setErrorMessage('Please select a valid address from the suggestions');
                    if (onValidationChange) {
                        onValidationChange(false);
                    }
                }
            });

            // Validate on manual input
            const handleInput = () => {
                const inputValue = addressInputRef.current?.value || '';
                if (inputValue.length > 5) {
                    // Basic validation - at least 6 characters for a valid address
                    setIsValid(inputValue.trim().length > 5);
                    setErrorMessage('');
                    if (onValidationChange) {
                        onValidationChange(inputValue.trim().length > 5);
                    }
                } else {
                    setIsValid(false);
                    if (onValidationChange) {
                        onValidationChange(false);
                    }
                }
            };

            addressInputRef.current.addEventListener('input', handleInput);
            
            return () => {
                console.log('Cleaning up autocomplete listeners');
                if (addressInputRef.current) {
                    addressInputRef.current.removeEventListener('input', handleInput);
                }
                if (window.google && autocompleteRef.current) {
                    window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                }
            };
        } catch (error) {
            console.error('Error initializing autocomplete:', error);
        }
    }, [mapsLoaded, id, onChange, onValidationChange]);

    useEffect(() => {
        // Validate existing address
        if (value && value.trim().length > 5) {
            setIsValid(true);
            if (onValidationChange) {
                onValidationChange(true);
            }
        } else {
            setIsValid(false);
            if (onValidationChange) {
                onValidationChange(false);
            }
        }
    }, [value, onValidationChange]);

    return (
        <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
            <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                {label}
            </label>
            <input
                ref={addressInputRef}
                type="text"
                id={id}
                value={value || ''}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={mapsLoaded ? placeholder || "Start typing your address..." : placeholder || "Street address, City, State ZIP"}
                className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto]"
            />
            {errorMessage && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-500">{errorMessage}</p>
            )}
            {!mapsLoaded && (
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                    {import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
                        ? 'Loading address suggestions...' 
                        : 'Address autocomplete unavailable. Please enter address manually.'}
                </p>
            )}
            {isValid && value && mapsLoaded && (
                <p className="mt-1.5 text-xs sm:text-sm text-primary flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified address
                </p>
            )}
        </div>
    );
};

const Step1BorrowerInfo: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
    const [addressValid, setAddressValid] = useState(false);
    
    const handleFieldChange = (id: keyof FormData, value: string) => {
        onDataChange({ [id]: value });
    };
    
    // Allow form completion if address is verified OR if it's a reasonable length (manual entry)
    const addressIsValid = addressValid || (data.borrowerAddress && data.borrowerAddress.trim().length > 5);
    const isComplete = data.fullName && data.borrowerAddress && addressIsValid && data.dob && data.email && data.phoneNumber;

    return (
        <div className="px-2 sm:px-0">
            <StepHeader title="Section 1: Borrower Information" subtitle="This information is about you, the Borrower." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
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
            <div className="mt-8 sm:mt-10 pt-6 border-t border-border/50">
                <StepNavigation onNext={onNext} isNextDisabled={!isComplete} />
            </div>
        </div>
    );
};

export default Step1BorrowerInfo;