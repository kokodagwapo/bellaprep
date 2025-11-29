// Address Verification Service using Mapbox Geocoding API

export interface AddressVerificationResult {
  isValid: boolean;
  normalizedAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cityState?: {
    city: string;
    state: string;
  };
  errors?: string[];
}

export interface DMVVerificationResult {
  idVerified: boolean;
  addressMatch: boolean;
  errors?: string[];
}

// ZIP to City/State lookup using Mapbox
export const getCityStateFromZip = async (zip: string): Promise<{ city: string; state: string } | null> => {
  const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  if (!apiKey) {
    console.warn('Mapbox API key not found for ZIP lookup');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json?country=us&types=postcode&access_token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const context = feature.context || [];
      
      let city = '';
      let state = '';
      
      context.forEach((item: any) => {
        if (item.id?.startsWith('place')) {
          city = item.text || '';
        }
        if (item.id?.startsWith('region')) {
          state = item.short_code?.replace('US-', '') || '';
        }
      });

      if (city && state) {
        return { city, state };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching city/state from ZIP using Mapbox:', error);
    return null;
  }
};

// Verify address using Mapbox Geocoding API
export const verifyAddress = async (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}): Promise<AddressVerificationResult> => {
  const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  if (!apiKey) {
    return {
      isValid: false,
      errors: ['Mapbox API key not configured'],
    };
  }

  try {
    // Basic validation
    if (!address.street || !address.zip) {
      return {
        isValid: false,
        errors: ['Street address and ZIP code are required'],
      };
    }

    // Build query string for Mapbox Geocoding API
    const queryParts = [];
    if (address.street) queryParts.push(address.street);
    if (address.city) queryParts.push(address.city);
    if (address.state) queryParts.push(address.state);
    if (address.zip) queryParts.push(address.zip);
    
    const query = queryParts.join(', ');
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=us&types=address&access_token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
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

      return {
        isValid: true,
        normalizedAddress: {
          street: properties.address_line || address.street || '',
          city: city || address.city || '',
          state: state || address.state || '',
          zip: zip || address.zip || '',
        },
      };
    }

    return {
      isValid: false,
      errors: ['Address not found. Please verify the address and try again.'],
    };
  } catch (error) {
    console.error('Error verifying address with Mapbox:', error);
    return {
      isValid: false,
      errors: ['Failed to verify address. Please check your connection and try again.'],
    };
  }
};

// Verify ID with DMV (where allowed)
// Note: DMV verification is state-specific and requires proper authorization
export const verifyIDWithDMV = async (idData: {
  fullName: string;
  dob: string;
  address: string;
  idNumber?: string;
}): Promise<DMVVerificationResult> => {
  // Placeholder: In production, this would integrate with state-specific DMV APIs
  // or third-party services that have proper authorization
  
  // This is a sensitive operation that requires:
  // 1. Proper authorization and licensing
  // 2. Compliance with state regulations
  // 3. Secure handling of PII (Personally Identifiable Information)
  
  // Mock implementation - replace with real API
  try {
    // In production, implement real DMV verification
    // This would typically involve:
    // - State-specific API endpoints
    // - Proper authentication tokens
    // - Secure data transmission
    // - Compliance with privacy regulations
    
    return {
      idVerified: true,
      addressMatch: true,
    };
  } catch (error) {
    console.error('Error verifying ID with DMV:', error);
    return {
      idVerified: false,
      addressMatch: false,
      errors: ['DMV verification unavailable. Please verify manually.'],
    };
  }
};

// Auto-verify current address
export const verifyCurrentAddress = async (address: string): Promise<boolean> => {
  // Parse address and verify
  // In production, use real address verification API
  try {
    // Mock implementation
    return address.length > 10; // Basic validation
  } catch (error) {
    console.error('Error verifying current address:', error);
    return false;
  }
};

// Auto-verify subject property
export const verifySubjectProperty = async (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}): Promise<AddressVerificationResult> => {
  return verifyAddress(address);
};

