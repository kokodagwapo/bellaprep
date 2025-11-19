import { FormData } from '../types';

export interface Form1003Requirement {
  key: string;
  label: string;
  section: string;
  isCompleted: (data: FormData) => boolean;
}

// Helper functions for backward compatibility
const hasCurrentAddress = (data: FormData): boolean => {
  // Check new structured address format
  if (data.currentAddress?.street && data.currentAddress?.city && 
      data.currentAddress?.state && data.currentAddress?.zip) {
    return true;
  }
  // Fallback to old string format (prep4loan compatibility)
  return !!data.borrowerAddress && data.borrowerAddress.trim().length > 0;
};

const hasPropertyAddress = (data: FormData): boolean => {
  // Check new structured address format
  if (data.propertyAddress?.street && data.propertyAddress?.city && 
      data.propertyAddress?.state && data.propertyAddress?.zip) {
    return true;
  }
  // Fallback to old location string (prep4loan compatibility)
  return !!data.location && data.location.trim().length > 0;
};

const hasPropertyValue = (data: FormData): boolean => {
  // Check new propertyValue field
  if (data.propertyValue !== undefined && data.propertyValue > 0) {
    return true;
  }
  // Fallback to estimatedPropertyValue (prep4loan compatibility)
  return data.estimatedPropertyValue !== undefined && data.estimatedPropertyValue > 0;
};

const hasIncome = (data: FormData): boolean => {
  // Check new employment income structure
  if (data.currentEmployment?.monthlyIncome?.base !== undefined && 
      (data.currentEmployment.monthlyIncome.base ?? 0) > 0) {
    return true;
  }
  // Fallback to old income number (prep4loan compatibility)
  return (data.income ?? 0) > 0;
};

const hasOccupancy = (data: FormData): boolean => {
  // Check new occupancy field (Form1003)
  if (data.occupancy) {
    return true;
  }
  // Fallback to propertyUse (prep4loan compatibility)
  return !!data.propertyUse;
};

export const getForm1003Requirements = (): Form1003Requirement[] => {
  return [
    // Section 1: Borrower Information
    {
      key: 'borrowerPersonalInfo',
      label: 'Personal Information',
      section: 'Section 1a',
      isCompleted: (data) => 
        !!data.fullName && 
        !!data.dob && 
        hasCurrentAddress(data) &&
        !!data.email && 
        !!data.phoneNumber,
        // Note: SSN is optional for backward compatibility with prep4loan
    },
    {
      key: 'borrowerContactInfo',
      label: 'Contact Information',
      section: 'Section 1a',
      isCompleted: (data) => 
        !!data.homePhone || !!data.cellPhone || !!data.workPhone || !!data.phoneNumber,
        // Include phoneNumber for backward compatibility
    },
    {
      key: 'currentAddress',
      label: 'Current Address Details',
      section: 'Section 1a',
      isCompleted: (data) => {
        // Check new structured format
        if (data.currentAddress?.street && data.currentAddress?.city && 
            data.currentAddress?.state && data.currentAddress?.zip) {
          return data.yearsAtCurrentAddress !== undefined && 
                 data.monthsAtCurrentAddress !== undefined;
        }
        // Fallback: if old format exists, consider basic address complete
        // (detailed years/months may not be available from prep4loan)
        return hasCurrentAddress(data);
      },
    },
    {
      key: 'currentEmployment',
      label: 'Current Employment',
      section: 'Section 1b',
      isCompleted: (data) => {
        // Check new employment structure
        if (data.currentEmployment?.employerName && 
            data.currentEmployment?.position && 
            data.currentEmployment?.startDate) {
          return (data.currentEmployment?.monthlyIncome?.base !== undefined || 
                  data.currentEmployment?.monthlyIncome?.other !== undefined);
        }
        // Fallback: if basic income exists (prep4loan), consider employment started
        return hasIncome(data);
      },
    },
    {
      key: 'previousEmployment',
      label: 'Previous Employment (if applicable)',
      section: 'Section 1d',
      isCompleted: (data) => {
        // Only complete if explicitly set (not undefined/null)
        // If it exists, check if it's properly filled out
        if (data.previousEmployment === undefined || data.previousEmployment === null) {
          return false; // Not started yet
        }
        // If it's an empty object or has data, check if it's complete
        return !!data.previousEmployment?.employerName && 
               !!data.previousEmployment?.startDate && 
               !!data.previousEmployment?.endDate;
      },
    },
    {
      key: 'otherIncome',
      label: 'Other Income Sources',
      section: 'Section 1e',
      isCompleted: (data) => {
        // Only complete if explicitly set as an array (empty or with items)
        if (data.otherIncome === undefined || data.otherIncome === null) {
          return false; // Not started yet
        }
        // If it's an array (even empty), consider it addressed
        return Array.isArray(data.otherIncome);
      },
    },
    
    // Section 2: Assets and Liabilities
    {
      key: 'assets',
      label: 'Assets (Bank Accounts, Investments)',
      section: 'Section 2a',
      isCompleted: (data) => {
        // Only complete if explicitly set as an array (empty or with items)
        if (data.assets === undefined || data.assets === null) {
          return false; // Not started yet
        }
        // If it's an array (even empty), consider it addressed
        return Array.isArray(data.assets);
      },
    },
    {
      key: 'realEstateLiabilities',
      label: 'Real Estate Liabilities',
      section: 'Section 3a',
      isCompleted: (data) => {
        // Only complete if explicitly set as an array (empty or with items)
        if (data.realEstateLiabilities === undefined || data.realEstateLiabilities === null) {
          return false; // Not started yet
        }
        // If it's an array (even empty), consider it addressed
        return Array.isArray(data.realEstateLiabilities);
      },
    },
    {
      key: 'otherLiabilities',
      label: 'Other Liabilities (Credit Cards, Loans)',
      section: 'Section 3b',
      isCompleted: (data) => {
        // Only complete if explicitly set as an array (empty or with items)
        if (data.otherLiabilities === undefined || data.otherLiabilities === null) {
          return false; // Not started yet
        }
        // If it's an array (even empty), consider it addressed
        return Array.isArray(data.otherLiabilities);
      },
    },
    
    // Section 3: Property Information
    {
      key: 'propertyAddress',
      label: 'Property Address',
      section: 'Section 4a',
      isCompleted: (data) => hasPropertyAddress(data),
    },
    {
      key: 'propertyDetails',
      label: 'Property Details',
      section: 'Section 4a',
      isCompleted: (data) => 
        hasPropertyValue(data) &&
        hasOccupancy(data) &&
        (data.numberOfUnits !== undefined || !!data.propertyType),
        // Allow propertyType as fallback for numberOfUnits (prep4loan compatibility)
    },
    {
      key: 'loanDetails',
      label: 'Loan Details',
      section: 'Section 4a',
      isCompleted: (data) => 
        data.loanAmount > 0 &&
        !!data.loanPurpose,
    },
    
    // Section 4: Declarations
    {
      key: 'declarations',
      label: 'Declarations',
      section: 'Section 5',
      isCompleted: (data) => 
        typeof data.willOccupyAsPrimary === 'boolean' &&
        typeof data.ownershipInterestInLast3Years === 'boolean' &&
        typeof data.borrowingUndisclosedMoney === 'boolean' &&
        typeof data.applyingForOtherMortgage === 'boolean' &&
        typeof data.applyingForNewCredit === 'boolean' &&
        typeof data.outstandingJudgments === 'boolean' &&
        typeof data.delinquentOnFederalDebt === 'boolean' &&
        typeof data.partyToLawsuit === 'boolean' &&
        typeof data.declaredBankruptcy === 'boolean',
    },
    
    // Supporting Documents
    {
      key: 'identification',
      label: 'Government ID (Driver\'s License/Passport)',
      section: 'Documents',
      isCompleted: (data) => 
        hasCurrentAddress(data) && 
        !!data.dob,
    },
    {
      key: 'incomeVerification',
      label: 'Income Verification (W-2/Paystubs)',
      section: 'Documents',
      isCompleted: (data) => hasIncome(data),
    },
    {
      key: 'taxReturns',
      label: 'Tax Returns (Last 2 Years)',
      section: 'Documents',
      isCompleted: (data) => 
        // This would typically require file upload tracking
        // For now, we'll check if employment info is complete
        !!data.currentEmployment?.employerName,
    },
    {
      key: 'bankStatements',
      label: 'Bank Statements (Last 2-3 Months)',
      section: 'Documents',
      isCompleted: (data) => {
        // This would typically require file upload tracking
        // For now, we'll check if assets are explicitly listed
        if (data.assets === undefined || data.assets === null) {
          return false; // Not started yet
        }
        // If assets array exists (even empty), consider it addressed
        return Array.isArray(data.assets);
      },
    },
  ];
};

