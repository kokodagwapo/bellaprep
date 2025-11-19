import React, { useRef, useEffect, useState } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';

interface StepLocationProps {
  data: { location: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const StepLocation: React.FC<StepLocationProps> = ({ data, onChange, onNext, onBack }) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Load Google Maps API script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      console.warn('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
      // Allow manual input without autocomplete if no API key
      setMapsLoaded(false);
      return;
    }

    // Check if script is already loading
    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setMapsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      setMapsLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
    };
  }, []);

  useEffect(() => {
    if (locationInputRef.current && mapsLoaded && window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address', 'geometry']
        }
      );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.address_components) {
          let city = '';
          let state = '';
          
          place.address_components.forEach((component: any) => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
          });

          if (city && state) {
            const formattedLocation = `${city}, ${state}`;
            onChange('location', formattedLocation);
            setIsValid(true);
            setErrorMessage('');
          } else {
            setIsValid(false);
            setErrorMessage('Please select a valid city and state');
          }
        }
      });

      // Validate on manual input
      const handleInput = () => {
        const value = locationInputRef.current?.value || '';
        if (value.length > 2) {
          // Basic validation - at least 3 characters
          setIsValid(value.trim().length > 2);
          setErrorMessage('');
        } else {
          setIsValid(false);
        }
      };

      locationInputRef.current.addEventListener('input', handleInput);
      
      return () => {
        if (locationInputRef.current) {
          locationInputRef.current.removeEventListener('input', handleInput);
        }
        if (window.google && autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }
  }, [mapsLoaded, onChange]);

  useEffect(() => {
    // Validate existing location
    if (data.location && data.location.trim().length > 2) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [data.location]);

  return (
    <div className="px-2 sm:px-0">
      <StepHeader 
        title="In what city and state are you looking to purchase?"
      />
      <div className="mt-4 sm:mt-6">
        <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
          City and State
        </label>
        <input
          ref={locationInputRef}
          id="location"
          type="text"
          placeholder={mapsLoaded ? "Start typing city name..." : "Enter city and state (e.g., Naples, FL)"}
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full px-4 py-3 sm:py-3 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[44px]"
          aria-label="City and State"
          required
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}
        {isValid && data.location && (
          <p className="mt-2 text-sm text-primary flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Valid location
          </p>
        )}
      </div>
      <StepNavigation onNext={onNext} onBack={onBack} isNextDisabled={!isValid} />
    </div>
  );
};

export default StepLocation;