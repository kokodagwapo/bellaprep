import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Home, Lightbulb } from './icons';
import { AddressAutofill } from '@mapbox/search-js-react';
import AddressPreviewModal, { AddressDetails } from './ui/AddressPreviewModal';
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
  const [zipVerified, setZipVerified] = useState(false);
  const [zipError, setZipError] = useState('');
  const [targetZipVerified, setTargetZipVerified] = useState(false);
  const [targetZipError, setTargetZipError] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressPreview, setAddressPreview] = useState<AddressDetails | null>(null);

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
          handleAddressChange('city', cityState.city);
          handleAddressChange('state', cityState.state);
        }
      } catch (error) {
        console.error('Error fetching city/state from ZIP:', error);
      }
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

  const canProceed = hasProperty !== null && (
    hasProperty 
      ? (address.street && address.zip && value > 0)
      : (budgetRange && targetZip)
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
          <div className="grid grid-cols-2 gap-4">
            <SelectionButton
              label="Yes"
              icon={<Home className="h-6 w-6" />}
              isSelected={hasProperty === true}
              onClick={() => handleHasProperty(true)}
            />
            <SelectionButton
              label="Not Yet"
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
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={address.zip || ''}
                onChange={async (e) => {
                  // Allow only digits, limit to 5 characters
                  const zip = e.target.value.replace(/\D/g, '').slice(0, 5);
                  handleAddressChange('zip', zip);
                  
                  // Auto-fill city and state from ZIP code with Mapbox when 5 digits are entered
                  if (zip.length === 5) {
                    try {
                      const { getCityStateFromZip } = await import('../services/addressVerificationService');
                      const cityState = await getCityStateFromZip(zip);
                      if (cityState) {
                        handleAddressChange('city', cityState.city);
                        handleAddressChange('state', cityState.state);
                        // ZIP code is verified
                        setZipVerified(true);
                        setZipError('');
                      } else {
                        // ZIP code not found in Mapbox
                        setZipVerified(false);
                        setZipError('ZIP code not found. Please verify the ZIP code.');
                        // Clear city/state if ZIP is invalid
                        handleAddressChange('city', '');
                        handleAddressChange('state', '');
                      }
                    } catch (error) {
                      console.error('Error verifying ZIP code with Mapbox:', error);
                      setZipVerified(false);
                      setZipError('Unable to verify ZIP code. Please check your connection.');
                      // Clear city/state on error
                      handleAddressChange('city', '');
                      handleAddressChange('state', '');
                    }
                  } else {
                    setZipVerified(false);
                    setZipError('');
                    // Clear city/state if ZIP is incomplete
                    if (zip.length < 5) {
                      handleAddressChange('city', '');
                      handleAddressChange('state', '');
                    }
                  }
                }}
                onBlur={async (e) => {
                  // Verify ZIP on blur if 5 digits
                  const zip = e.target.value.replace(/\D/g, '');
                  if (zip.length === 5 && !zipVerified) {
                    try {
                      const { getCityStateFromZip } = await import('../services/addressVerificationService');
                      const cityState = await getCityStateFromZip(zip);
                      if (cityState) {
                        handleAddressChange('city', cityState.city);
                        handleAddressChange('state', cityState.state);
                        setZipVerified(true);
                        setZipError('');
                      }
                    } catch (error) {
                      // Silent fail on blur
                    }
                  }
                }}
                placeholder="12345"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400 ${
                  zipVerified ? 'border-green-500' : zipError ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={5}
                autoComplete="postal-code"
                style={{ 
                  pointerEvents: 'auto',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  MozUserSelect: 'text',
                  touchAction: 'manipulation'
                }}
              />
              {zipVerified && address.zip?.length === 5 && (
                <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ZIP code verified - City and State auto-filled
                </p>
              )}
              {zipError && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {zipError}
                </p>
              )}
            </div>

            {/* City and State Fields - Auto-filled from ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={address.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400 ${
                    address.city && zipVerified ? 'border-green-500' : 'border-gray-300'
                  }`}
                  readOnly={zipVerified && address.zip?.length === 5} // Read-only if auto-filled from ZIP
                />
                {zipVerified && address.city && (
                  <p className="mt-1 text-xs text-gray-500">Auto-filled from ZIP code</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={address.state || ''}
                  onChange={(e) => {
                    const state = e.target.value.toUpperCase().slice(0, 2);
                    handleAddressChange('state', state);
                  }}
                  placeholder="State"
                  maxLength={2}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400 ${
                    address.state && zipVerified ? 'border-green-500' : 'border-gray-300'
                  }`}
                  readOnly={zipVerified && address.zip?.length === 5} // Read-only if auto-filled from ZIP
                />
                {zipVerified && address.state && (
                  <p className="mt-1 text-xs text-gray-500">Auto-filled from ZIP code</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Street Address *
              </label>
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
                    
                    // Extract city, state, and ZIP from context
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
                    
                    // Use existing city/state from ZIP if already filled, otherwise use from address autocomplete
                    const finalCity = address.city || city;
                    const finalState = address.state || state;
                    const finalZip = address.zip || zip;
                    
                    // Build full address
                    const fullAddress = properties.full_address || properties.place_name || 
                      `${street}${street && finalCity ? ', ' : ''}${finalCity}${finalCity && finalState ? ', ' : ''}${finalState} ${finalZip}`.trim();
                    
                    // Verify address with Mapbox
                    try {
                      const { verifyAddress } = await import('../services/addressVerificationService');
                      const verification = await verifyAddress({
                        street,
                        city: finalCity,
                        state: finalState,
                        zip: finalZip
                      });
                      
                      // Prepare address details for modal
                      const addressDetails: AddressDetails = {
                        street: verification.normalizedAddress?.street || street,
                        city: verification.normalizedAddress?.city || finalCity,
                        state: verification.normalizedAddress?.state || finalState,
                        zip: verification.normalizedAddress?.zip || finalZip,
                        fullAddress: verification.normalizedAddress 
                          ? `${verification.normalizedAddress.street}, ${verification.normalizedAddress.city}, ${verification.normalizedAddress.state} ${verification.normalizedAddress.zip}`
                          : fullAddress,
                        coordinates: coordinates.length >= 2 ? {
                          longitude: coordinates[0],
                          latitude: coordinates[1]
                        } : undefined,
                        verified: verification.isValid
                      };
                      
                      // Show preview modal
                      setAddressPreview(addressDetails);
                      setShowAddressModal(true);
                      
                      // Update form fields if verified
                      if (verification.isValid && verification.normalizedAddress) {
                        handleAddressChange('street', verification.normalizedAddress.street);
                        // Only update city/state if they weren't already filled from ZIP
                        if (!address.city) {
                          handleAddressChange('city', verification.normalizedAddress.city);
                        }
                        if (!address.state) {
                          handleAddressChange('state', verification.normalizedAddress.state);
                        }
                        if (!address.zip) {
                          handleAddressChange('zip', verification.normalizedAddress.zip);
                        }
                      } else {
                        // Still update with what we have
                        if (street) handleAddressChange('street', street);
                        // Only update city/state if they weren't already filled from ZIP
                        if (city && !address.city) {
                          handleAddressChange('city', city);
                        }
                        if (state && !address.state) {
                          handleAddressChange('state', state);
                        }
                        if (zip && !address.zip) {
                          handleAddressChange('zip', zip);
                        }
                      }
                    } catch (error) {
                      console.error('Error verifying address:', error);
                      // Still show modal with unverified address
                      const addressDetails: AddressDetails = {
                        street,
                        city: finalCity,
                        state: finalState,
                        zip: finalZip,
                        fullAddress,
                        coordinates: coordinates.length >= 2 ? {
                          longitude: coordinates[0],
                          latitude: coordinates[1]
                        } : undefined,
                        verified: false
                      };
                      setAddressPreview(addressDetails);
                      setShowAddressModal(true);
                      
                      // Update form fields
                      if (street) handleAddressChange('street', street);
                      // Only update city/state if they weren't already filled from ZIP
                      if (city && !address.city) {
                        handleAddressChange('city', city);
                      }
                      if (state && !address.state) {
                        handleAddressChange('state', state);
                      }
                      if (zip && !address.zip) {
                        handleAddressChange('zip', zip);
                      }
                    }
                  }
                }}
                options={{
                  country: 'US',
                  language: 'en',
                  // If city/state are already filled from ZIP, use them to improve suggestions
                  proximity: address.city && address.state ? undefined : undefined
                }}
              >
                <input
                  type="text"
                  name="street"
                  value={address.street || ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="123 Main St"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400"
                  autoComplete="address-line1"
                />
              </AddressAutofill>
              {address.city && address.state && (
                <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Address suggestions will use {address.city}, {address.state}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Unit (optional)
              </label>
              <input
                type="text"
                value={address.unit || ''}
                onChange={(e) => handleAddressChange('unit', e.target.value)}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400"
              />
            </div>

            {(address.zip && address.zip.length === 5) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600"
              >
                {address.city && address.state && (
                  <p className="text-black">{address.city}, {address.state}</p>
                )}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                What do you believe is the VALUE of the home? *
              </label>
              <input
                type="number"
                value={value || ''}
                onChange={(e) => handleValueChange(Number(e.target.value))}
                placeholder="500000"
                min="0"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder:text-gray-400"
              />
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
              <label className="block text-sm font-medium text-foreground mb-3">
                Budget Range *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {budgetRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => handleBudgetSelect(range)}
                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                      budgetRange === range
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Target ZIP Code *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={targetZip}
                onChange={async (e) => {
                  // Allow only digits, limit to 5 characters
                  const zip = e.target.value.replace(/\D/g, '').slice(0, 5);
                  handleZipChange(zip);
                  
                  // Verify ZIP code with Mapbox when 5 digits are entered
                  if (zip.length === 5) {
                    try {
                      const { getCityStateFromZip } = await import('../services/addressVerificationService');
                      const cityState = await getCityStateFromZip(zip);
                      if (cityState) {
                        setTargetZipVerified(true);
                        setTargetZipError('');
                      } else {
                        setTargetZipVerified(false);
                        setTargetZipError('ZIP code not found. Please verify the ZIP code.');
                      }
                    } catch (error) {
                      console.error('Error verifying ZIP code with Mapbox:', error);
                      setTargetZipVerified(false);
                      setTargetZipError('Unable to verify ZIP code. Please check your connection.');
                    }
                  } else {
                    setTargetZipVerified(false);
                    setTargetZipError('');
                  }
                }}
                onBlur={async (e) => {
                  // Verify ZIP on blur if 5 digits
                  const zip = e.target.value.replace(/\D/g, '');
                  if (zip.length === 5 && !targetZipVerified) {
                    try {
                      const { getCityStateFromZip } = await import('../services/addressVerificationService');
                      const cityState = await getCityStateFromZip(zip);
                      if (cityState) {
                        setTargetZipVerified(true);
                        setTargetZipError('');
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
                  touchAction: 'manipulation'
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
          </motion.div>
        )}
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
      
      {/* Address Preview Modal */}
      <AddressPreviewModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        address={addressPreview}
        onConfirm={() => {
          // Address is already confirmed when modal is shown
          setShowAddressModal(false);
        }}
      />
    </div>
  );
};

export default StepSubjectProperty;

