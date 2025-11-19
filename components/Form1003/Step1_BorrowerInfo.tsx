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
    const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [addressDetails, setAddressDetails] = useState<{
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    } | null>(null);

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
                setIsLoading(true);
                const place = autocomplete.getPlace();
                console.log('Place selected:', place);
                
                if (place.formatted_address && place.geometry && place.geometry.location) {
                    // Extract address components
                    const components: any = {};
                    if (place.address_components) {
                        place.address_components.forEach((component: any) => {
                            if (component.types.includes('street_number') || component.types.includes('route')) {
                                components.street = components.street 
                                    ? `${components.street} ${component.long_name}`
                                    : component.long_name;
                            }
                            if (component.types.includes('locality')) {
                                components.city = component.long_name;
                            }
                            if (component.types.includes('administrative_area_level_1')) {
                                components.state = component.short_name;
                            }
                            if (component.types.includes('postal_code')) {
                                components.zip = component.long_name;
                            }
                        });
                    }
                    
                    // Verify this is a valid address with coordinates
                    const formattedAddress = place.formatted_address;
                    console.log('Valid address selected:', formattedAddress);
                    onChange(id, formattedAddress);
                    setIsValid(true);
                    setErrorMessage('');
                    setAddressDetails(components);
                    if (onValidationChange) {
                        onValidationChange(true);
                    }
                } else {
                    console.warn('Invalid place selected:', place);
                    setIsValid(false);
                    setErrorMessage('Please select a valid address from the suggestions');
                    setAddressDetails(null);
                    if (onValidationChange) {
                        onValidationChange(false);
                    }
                }
                setIsLoading(false);
            });

            // Validate on manual input with debouncing
            const handleInput = (e?: Event) => {
                if (inputTimeoutRef.current) {
                    clearTimeout(inputTimeoutRef.current);
                }
                const inputValue = addressInputRef.current?.value || '';
                
                // Update parent immediately for controlled input
                if (inputValue !== value) {
                    onChange(id, inputValue);
                    setAddressDetails(null); // Clear verified details when manually editing
                }
                
                inputTimeoutRef.current = setTimeout(() => {
                    if (inputValue.length > 5) {
                        // Basic validation - at least 6 characters for a valid address
                        const isValidInput = inputValue.trim().length > 5;
                        setIsValid(isValidInput);
                        setErrorMessage('');
                        if (onValidationChange) {
                            onValidationChange(isValidInput);
                        }
                    } else {
                        setIsValid(false);
                        if (onValidationChange) {
                            onValidationChange(false);
                        }
                    }
                }, 300); // Debounce for 300ms
            };

            // Use React's onChange handler instead of addEventListener to avoid conflicts
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                handleInput();
            };

            addressInputRef.current.addEventListener('input', handleInput);
            
            // Add focus event to show suggestions
            const handleFocus = () => {
                if (addressInputRef.current && addressInputRef.current.value.length > 0 && mapsLoaded) {
                    // Trigger autocomplete dropdown by simulating input
                    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
                    addressInputRef.current.dispatchEvent(event);
                }
            };
            
            addressInputRef.current.addEventListener('focus', handleFocus);
            
            return () => {
                console.log('Cleaning up autocomplete listeners');
                if (inputTimeoutRef.current) {
                    clearTimeout(inputTimeoutRef.current);
                }
                if (addressInputRef.current) {
                    addressInputRef.current.removeEventListener('input', handleInput);
                    addressInputRef.current.removeEventListener('focus', handleFocus);
                }
                if (window.google && autocompleteRef.current) {
                    window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                }
            };
        } catch (error) {
            console.error('Error initializing autocomplete:', error);
        }
    }, [mapsLoaded, id, value]); // Removed onChange and onValidationChange from deps to prevent re-initialization

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
                {mapsLoaded && (
                    <span className="ml-2 text-xs text-primary">✨ Smart suggestions enabled</span>
                )}
            </label>
            <div className="relative">
                <input
                    ref={addressInputRef}
                    type="text"
                    id={id}
                    value={value || ''}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        onChange(id, newValue);
                        // Clear address details when manually editing
                        if (newValue !== value) {
                            setAddressDetails(null);
                        }
                        // Validate immediately for better UX
                        if (newValue.trim().length > 5) {
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
                    }}
                    placeholder={mapsLoaded ? "Start typing your address (e.g., 123 Main St, New York, NY)" : placeholder || "Street address, City, State ZIP"}
                    className="mt-1 block w-full px-4 py-3 sm:px-3 sm:py-2.5 bg-background border border-border rounded-xl sm:rounded-lg shadow-sm text-base sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all touch-manipulation min-h-[44px] sm:min-h-[auto] pr-10"
                    autoComplete="address-line1"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                {mapsLoaded && !isLoading && value && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                )}
            </div>
            {errorMessage && (
                <p className="mt-1.5 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                </p>
            )}
            {!mapsLoaded && !value && import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Loading address suggestions...
                </p>
            )}
            {isValid && value && mapsLoaded && addressDetails && (
                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified Address
                    </p>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                        {addressDetails.street && <p><span className="font-medium">Street:</span> {addressDetails.street}</p>}
                        {addressDetails.city && <p><span className="font-medium">City:</span> {addressDetails.city}</p>}
                        {addressDetails.state && <p><span className="font-medium">State:</span> {addressDetails.state}</p>}
                        {addressDetails.zip && <p><span className="font-medium">ZIP:</span> {addressDetails.zip}</p>}
                    </div>
                </div>
            )}
            {isValid && value && (!mapsLoaded || !addressDetails) && (
                <p className="mt-1.5 text-xs sm:text-sm text-primary flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Address entered
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