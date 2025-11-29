import React, { useRef, useEffect, useState } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { AddressAutofill } from '@mapbox/search-js-react';

interface StepLocationProps {
  data: { location: string };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepLocation: React.FC<StepLocationProps> = ({ data, onChange, onNext, onBack }) => {
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapboxLoaded, setMapboxLoaded] = useState(false);

  // Initialize Mapbox
  useEffect(() => {
    const apiKey = import.meta.env.VITE_MAPBOX_API_KEY || '';
    if (!apiKey) {
      console.warn('Mapbox API key not found. Please set VITE_MAPBOX_API_KEY in your environment variables.');
      setMapboxLoaded(false);
      return;
    }
    setMapboxLoaded(true);
  }, []);

  // Validate location format
  useEffect(() => {
    if (data.location && data.location.trim().length > 2) {
      // Check if it's in "City, State" format
      const locationPattern = /^[^,]+,\s*[A-Z]{2}$/i;
      if (locationPattern.test(data.location.trim())) {
        setIsValid(true);
        setErrorMessage('');
      } else if (data.location.trim().length > 5) {
        // Allow manual input if it's long enough
        setIsValid(true);
        setErrorMessage('');
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  }, [data.location]);

  const handleRetrieve = (res: any) => {
    const feature = res.features[0];
    if (feature) {
      // Best practice: Extract from context array (Mapbox standard format)
      const context = feature.context || [];
      
      let city = '';
      let state = '';
      
      // Iterate through context to find place (city) and region (state)
      context.forEach((item: any) => {
        if (item.id?.startsWith('place')) {
          city = item.text || '';
        }
        if (item.id?.startsWith('region')) {
          state = item.short_code?.replace('US-', '') || item.text || '';
        }
      });
      
      // Fallback: try properties if context doesn't have the data
      if (!city) {
        city = feature.properties?.name || '';
      }
      
      if (city && state) {
        const formattedLocation = `${city}, ${state}`;
        onChange('location', formattedLocation);
        setIsValid(true);
        setErrorMessage('');
      } else if (city) {
        // If we have city but no state, still accept it
        onChange('location', city);
        setIsValid(true);
        setErrorMessage('');
      }
    }
  };

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
              ref={locationInputRef}
              id="location"
              type="text"
              name="location"
              placeholder="Start typing city name..."
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full px-4 py-3 sm:py-3 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
              style={{ fontSize: '16px' }}
              aria-label="City and State"
              required
            />
          </AddressAutofill>
        ) : (
          <input
            ref={locationInputRef}
            id="location"
            type="text"
            placeholder="Enter city and state (e.g., Naples, FL)"
            value={data.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full px-4 py-3 sm:py-3 text-base sm:text-lg border border-input bg-background rounded-xl sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition duration-200 touch-manipulation min-h-[48px] sm:min-h-[44px]"
            style={{ fontSize: '16px' }}
            aria-label="City and State"
            required
          />
        )}
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