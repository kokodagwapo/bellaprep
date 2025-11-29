import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Home, Lightbulb, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import { AddressAutofill } from '@mapbox/search-js-react';
import AddressSatelliteView, { AddressDetails } from './ui/AddressSatelliteView';
import type { FormData, Address } from '../types';

interface StepSubjectPropertyProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const budgetRanges = [
  '$100k - $200k',
  '$200k - $300k',
  '$300k - $400k',
  '$400k - $500k',
  '$500k - $750k',
  '$750k - $1M',
  '$1M+'
];

const StepSubjectProperty: React.FC<StepSubjectPropertyProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [hasProperty, setHasProperty] = useState<boolean | null>(
    data.subjectProperty?.hasProperty ?? null
  );
  const [address, setAddress] = useState<Address>(data.subjectProperty?.address || {});
  const [value, setValue] = useState<number>(data.subjectProperty?.value || 0);
  const [budgetRange, setBudgetRange] = useState<string>(data.subjectProperty?.budgetRange || '');
  const [targetZip, setTargetZip] = useState<string>(data.subjectProperty?.targetZip || '');
  const [targetZipVerified, setTargetZipVerified] = useState(false);
  const [targetZipError, setTargetZipError] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressPreview, setAddressPreview] = useState<AddressDetails | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [showConfirmationBanner, setShowConfirmationBanner] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const handleHasProperty = (value: boolean) => {
    setHasProperty(value);
    onChange('subjectProperty', {
      ...data.subjectProperty,
      hasProperty: value
    });
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onChange('subjectProperty', {
      ...data.subjectProperty,
      address: newAddress
    });
  };

  const handleZipChange = async (zip: string) => {
    setTargetZip(zip);
    onChange('subjectProperty', {
      ...data.subjectProperty,
      targetZip: zip
    });
    
    // Auto-fill city/state from ZIP using Mapbox API
    if (zip.length === 5) {
      try {
        const { getCityStateFromZip } = await import('../services/addressVerificationService');
        const cityState = await getCityStateFromZip(zip);
        if (cityState) {
          setTargetZipVerified(true);
          setTargetZipError(null);
        } else {
          setTargetZipVerified(false);
          setTargetZipError('ZIP code not found. Please verify the ZIP code.');
        }
      } catch (error) {
        console.error('Error fetching city/state from ZIP:', error);
        setTargetZipVerified(false);
        setTargetZipError('Unable to verify ZIP code. Please check your connection.');
      }
    } else {
      setTargetZipVerified(false);
      setTargetZipError('');
    }
  };

  const handleValueChange = (val: number) => {
    setValue(val);
    onChange('subjectProperty', {
      ...data.subjectProperty,
      value: val
    });
  };

  const handleBudgetSelect = (range: string) => {
    setBudgetRange(range);
    onChange('subjectProperty', {
      ...data.subjectProperty,
      budgetRange: range
    });
  };

  const handleConfirmAddress = () => {
    if (addressPreview) {
      // Update all fields with confirmed address
      if (addressPreview.street) handleAddressChange('street', addressPreview.street);
      if (addressPreview.city) handleAddressChange('city', addressPreview.city);
      if (addressPreview.state) handleAddressChange('state', addressPreview.state);
      if (addressPreview.zip) handleAddressChange('zip', addressPreview.zip);
      
      setAddressConfirmed(true);
      setShowAddressModal(false);
      setShowConfirmationBanner(true);
      
      // Auto-hide banner after 5 seconds
      setTimeout(() => {
        setShowConfirmationBanner(false);
      }, 5000);
    }
  };

  const canProceed = hasProperty !== null && (
    hasProperty 
      ? ((address.fullAddress || (address.street && address.city && address.state && address.zip)) && value > 0 && addressVerified)
      : (budgetRange && targetZip && targetZipVerified)
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Subject Property"
        subtitle="Tell us about the property you're interested in"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> If you already have a property in mind, providing the address helps us give you more accurate loan estimates. If not, that's okay too - we can work with your budget range!
        </p>
      </div>
      
      <div className="space-y-6 mt-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Do you already have a property in mind?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <SelectionButton
              label="Yes, I have a property"
              isSelected={hasProperty === true}
              onClick={() => handleHasProperty(true)}
            />
            <SelectionButton
              label="No, I'm still looking"
              isSelected={hasProperty === false}
              onClick={() => handleHasProperty(false)}
            />
          </div>
        </div>

        {hasProperty === true && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Address Confirmation Banner - Gamification Style */}
            <AnimatePresence>
              {showConfirmationBanner && addressConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-800 text-base mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Address Confirmed! 🎉
                      </h4>
                      <p className="text-sm text-green-700">
                        <span className="font-semibold">Bella's Insight:</span> Great job! Your property address has been verified and confirmed. This helps us provide you with the most accurate loan estimates and property valuations. You're one step closer to your dream home!
                      </p>
                    </div>
                    <button
                      onClick={() => setShowConfirmationBanner(false)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      aria-label="Close banner"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Address with Mapbox Autosuggest - Single Field */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Property Address *
              </label>
              <div className="relative mb-6">
                <AddressAutofill
                  accessToken={import.meta.env.VITE_MAPBOX_API_KEY || ''}
                  onRetrieve={async (res: any) => {
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
                      let unit = '';
                      
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
                      
                      // Try to extract unit from street address
                      const unitMatch = street.match(/\b(?:apt|apartment|unit|suite|ste|#)\s*([a-z0-9-]+)\b/i);
                      if (unitMatch) {
                        unit = unitMatch[1];
                      }
                      
                      // Build full address
                      const fullAddress = properties.full_address || properties.place_name || 
                        `${street}${street && city ? ', ' : ''}${city}${city && state ? ', ' : ''}${state} ${zip}${unit ? `, ${unit}` : ''}`.trim();
                      
                      // Store full address and components (for backend compatibility)
                      const newAddress = {
                        street: street || '',
                        city: city || '',
                        state: state || '',
                        zip: zip || '',
                        unit: unit || '',
                        fullAddress: fullAddress
                      };
                      
                      setAddress(newAddress);
                      onChange('subjectProperty', {
                        ...data.subjectProperty,
                        address: newAddress
                      });
                      
                      // Verify address with Mapbox
                      try {
                        const { verifyAddress } = await import('../services/addressVerificationService');
                        const verification = await verifyAddress({
                          street,
                          city,
                          state,
                          zip
                        });
                        
                        // Prepare address details for satellite view
                        const addressDetails: AddressDetails = {
                          street: verification.normalizedAddress?.street || street,
                          city: verification.normalizedAddress?.city || city,
                          state: verification.normalizedAddress?.state || state,
                          zip: verification.normalizedAddress?.zip || zip,
                          fullAddress: verification.normalizedAddress 
                            ? `${verification.normalizedAddress.street}, ${verification.normalizedAddress.city}, ${verification.normalizedAddress.state} ${verification.normalizedAddress.zip}`
                            : fullAddress,
                          coordinates: coordinates.length >= 2 ? {
                            longitude: coordinates[0],
                            latitude: coordinates[1]
                          } : undefined,
                          verified: verification.isValid
                        };
                        
                        // Update with verified address if different
                        if (verification.isValid && verification.normalizedAddress) {
                          const verifiedAddress = {
                            street: verification.normalizedAddress.street || street,
                            city: verification.normalizedAddress.city || city,
                            state: verification.normalizedAddress.state || state,
                            zip: verification.normalizedAddress.zip || zip,
                            unit: unit || '',
                            fullAddress: addressDetails.fullAddress
                          };
                          setAddress(verifiedAddress);
                          onChange('subjectProperty', {
                            ...data.subjectProperty,
                            address: verifiedAddress
                          });
                        }
                        
                        // Store address details for satellite view
                        setAddressPreview(addressDetails);
                        
                        // Show verification message if address is verified
                        if (verification.isValid) {
                          setAddressVerified(true);
                          setVerificationMessage('Address verified and correct. Please double-check to ensure accuracy.');
                          // Auto-hide verification message after 8 seconds (longer for important message)
                          setTimeout(() => {
                            setVerificationMessage(null);
                          }, 8000);
                        } else {
                          setAddressVerified(false);
                          setVerificationMessage(null);
                        }
                        setAddressConfirmed(false);
                      } catch (error) {
                        console.error('Error verifying address:', error);
                        // Store unverified address for satellite view
                        const addressDetails: AddressDetails = {
                          street,
                          city,
                          state,
                          zip,
                          fullAddress,
                          coordinates: coordinates.length >= 2 ? {
                            longitude: coordinates[0],
                            latitude: coordinates[1]
                          } : undefined,
                          verified: false
                        };
                        setAddressPreview(addressDetails);
                        setAddressVerified(false);
                        setVerificationMessage(null);
                        setAddressConfirmed(false);
                      }
                    }
                  }}
                  options={{
                    country: 'US',
                    language: 'en'
                  }}
                >
              <input
                type="text"
                    name="fullAddress"
                    value={address.fullAddress || (address.street && address.city && address.state && address.zip ? `${address.street}${address.street && address.city ? ', ' : ''}${address.city}${address.city && address.state ? ', ' : ''}${address.state} ${address.zip}`.trim() : '') || ''}
                onChange={(e) => {
                      const newValue = e.target.value;
                      // Update full address, but keep components for backend
                      const newAddress = {
                        ...address,
                        fullAddress: newValue
                      };
                      setAddress(newAddress);
                      onChange('subjectProperty', {
                        ...data.subjectProperty,
                        address: newAddress
                      });
                      // Clear confirmation and verification when manually editing
                      if (addressConfirmed) {
                        setAddressConfirmed(false);
                        setShowConfirmationBanner(false);
                        setAddressPreview(null);
                      }
                      if (addressVerified) {
                        setAddressVerified(false);
                        setVerificationMessage(null);
                  }
                }}
                    placeholder="Start typing your address (e.g., 123 Main St, City, State ZIP)"
                    className={`w-full px-4 py-3 pr-12 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400 transition-colors ${
                      addressVerified ? 'border-green-500 bg-green-50/30' : 'border-gray-300'
                    }`}
                    autoComplete="address-line1"
                  />
                </AddressAutofill>
                {/* Address confirmed message - persistent when verified */}
                {addressVerified && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-semibold text-green-900">Address confirmed</p>
                  </motion.div>
                )}
                {/* Modern icon button to view/confirm address - Hidden for now */}
                {false && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // If we have addressPreview with coordinates, show it immediately
                      if (addressPreview && addressPreview.coordinates) {
                        setShowAddressModal(true);
                      } else {
                        // Geocode the address to get coordinates
                        const addressToGeocode = address.fullAddress || 
                          (address.street && address.city && address.state && address.zip 
                            ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
                            : address.street || '');
                        
                        if (!addressToGeocode || addressToGeocode.trim().length < 5) {
                          return;
                        }

                        // Show loading state
                        const button = e.currentTarget;
                        if (button) {
                          const originalContent = button.innerHTML;
                          button.disabled = true;
                          button.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>';
                          
                          try {
                            const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
                            if (!apiKey) {
                              console.warn('Mapbox API key not found');
                              return;
                            }

                            // Geocode address using Mapbox
                            const geocodeResponse = await fetch(
                              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressToGeocode)}.json?access_token=${apiKey}&country=US&limit=1&types=address`
                            );
                            const geocodeData = await geocodeResponse.json();
                            
                            if (geocodeData.features && geocodeData.features.length > 0) {
                              const feature = geocodeData.features[0];
                              const coords = feature.geometry?.coordinates;
                              
                              if (coords && coords.length >= 2) {
                                const properties = feature.properties || {};
                                const context = feature.context || [];
                                
                                let city = '';
                                let state = '';
                                let zip = '';
                                
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
                                
                                const street = properties.address_line || properties.name || address.street || '';
                                const fullAddress = properties.full_address || properties.place_name || addressToGeocode;
                                
                                const addressDetails: AddressDetails = {
                                  street,
                                  city: city || address.city || '',
                                  state: state || address.state || '',
                                  zip: zip || address.zip || '',
                                  fullAddress,
                                  coordinates: {
                                    longitude: coords[0],
                                    latitude: coords[1]
                                  },
                                  verified: true
                                };
                                
                                setAddressPreview(addressDetails);
                                setShowAddressModal(true);
                              }
                            }
                          } catch (error) {
                            console.error('Error geocoding address:', error);
                            // Still try to show with available data
                            const addressDetails: AddressDetails = {
                              street: address.street || '',
                              city: address.city || '',
                              state: address.state || '',
                              zip: address.zip || '',
                              fullAddress: address.fullAddress || addressToGeocode,
                              coordinates: undefined,
                              verified: false
                            };
                            setAddressPreview(addressDetails);
                            setShowAddressModal(true);
                          } finally {
                            // Restore button state
                            if (button) {
                              button.disabled = false;
                              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-5 w-5" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                            }
                          }
                        }
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="View and confirm address"
                    title="View and confirm address on map"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                What do you believe is the VALUE of the home? *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 text-base sm:text-lg">$</span>
            </div>
              <input
                type="text"
                  inputMode="numeric"
                  value={value > 0 ? value.toLocaleString('en-US') : ''}
                  onChange={(e) => {
                    // Remove all non-numeric characters
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    // Parse to number and update
                    handleValueChange(numericValue ? Number(numericValue) : 0);
                  }}
                  placeholder="500,000"
                  className="w-full px-4 py-3 pl-8 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400"
                  style={{ fontSize: '16px' }}
                  aria-label="Home Value in US Dollars"
              />
            </div>
            </div>
          </motion.div>
        )}

        {hasProperty === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Target ZIP Code *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={targetZip}
                onChange={(e) => {
                  const zip = e.target.value.replace(/\D/g, '').slice(0, 5);
                  handleZipChange(zip);
                }}
                onBlur={async (e) => {
                  const zip = e.target.value.replace(/\D/g, '');
                  if (zip.length === 5 && !targetZipVerified) {
                    try {
                      const { getCityStateFromZip } = await import('../services/addressVerificationService');
                      const cityState = await getCityStateFromZip(zip);
                      if (cityState) {
                        setTargetZipVerified(true);
                        setTargetZipError(null);
                      }
                    } catch (error) {
                      // Silent fail on blur
                    }
                  }
                }}
                placeholder="12345"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400 ${
                  targetZipVerified ? 'border-green-500' : targetZipError ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={5}
                autoComplete="postal-code"
                style={{ 
                  pointerEvents: 'auto',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  MozUserSelect: 'text',
                  touchAction: 'manipulation',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
              {targetZipVerified && targetZip.length === 5 && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ZIP code verified
                </p>
              )}
              {targetZipError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {targetZipError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Estimated Budget Range *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {budgetRanges.map((range) => (
                  <SelectionButton
                    key={range}
                    label={range}
                    isSelected={budgetRange === range}
                    onClick={() => handleBudgetSelect(range)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
      
      {/* Address Preview Modal */}
      <AddressSatelliteView
        address={addressPreview}
        isVisible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleConfirmAddress}
      />
    </div>
  );
};

export default StepSubjectProperty;
