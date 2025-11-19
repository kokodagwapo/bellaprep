import { FormData } from '../types';

export interface Form1003Requirement {
  key: string;
  label: string;
  section: string;
  isCompleted: (data: FormData) => boolean;
}

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
        !!data.borrowerAddress && 
        !!data.email && 
        !!data.phoneNumber &&
        !!data.ssn,
    },
    {
      key: 'borrowerContactInfo',
      label: 'Contact Information',
      section: 'Section 1a',
      isCompleted: (data) => 
        !!data.homePhone || !!data.cellPhone || !!data.workPhone,
    },
    {
      key: 'currentAddress',
      label: 'Current Address Details',
      section: 'Section 1a',
      isCompleted: (data) => 
        !!data.currentAddress?.street &&
        !!data.currentAddress?.city &&
        !!data.currentAddress?.state &&
        !!data.currentAddress?.zip &&
        data.yearsAtCurrentAddress !== undefined &&
        data.monthsAtCurrentAddress !== undefined,
    },
    {
      key: 'currentEmployment',
      label: 'Current Employment',
      section: 'Section 1b',
      isCompleted: (data) => 
        !!data.currentEmployment?.employerName &&
        !!data.currentEmployment?.position &&
        !!data.currentEmployment?.startDate &&
        (data.currentEmployment?.monthlyIncome?.base !== undefined || 
         data.currentEmployment?.monthlyIncome?.other !== undefined),
    },
    {
      key: 'previousEmployment',
      label: 'Previous Employment (if applicable)',
      section: 'Section 1d',
      isCompleted: (data) => 
        !data.previousEmployment || 
        (!!data.previousEmployment?.employerName && 
         !!data.previousEmployment?.startDate && 
         !!data.previousEmployment?.endDate),
    },
    {
      key: 'otherIncome',
      label: 'Other Income Sources',
      section: 'Section 1e',
      isCompleted: (data) => 
        !data.otherIncome || 
        (Array.isArray(data.otherIncome) && data.otherIncome.length > 0),
    },
    
    // Section 2: Assets and Liabilities
    {
      key: 'assets',
      label: 'Assets (Bank Accounts, Investments)',
      section: 'Section 2a',
      isCompleted: (data) => 
        !data.assets || 
        (Array.isArray(data.assets) && data.assets.length > 0),
    },
    {
      key: 'realEstateLiabilities',
      label: 'Real Estate Liabilities',
      section: 'Section 3a',
      isCompleted: (data) => 
        !data.realEstateLiabilities || 
        (Array.isArray(data.realEstateLiabilities) && data.realEstateLiabilities.length > 0),
    },
    {
      key: 'otherLiabilities',
      label: 'Other Liabilities (Credit Cards, Loans)',
      section: 'Section 3b',
      isCompleted: (data) => 
        !data.otherLiabilities || 
        (Array.isArray(data.otherLiabilities) && data.otherLiabilities.length > 0),
    },
    
    // Section 3: Property Information
    {
      key: 'propertyAddress',
      label: 'Property Address',
      section: 'Section 4a',
      isCompleted: (data) => 
        !!data.propertyAddress?.street &&
        !!data.propertyAddress?.city &&
        !!data.propertyAddress?.state &&
        !!data.propertyAddress?.zip,
    },
    {
      key: 'propertyDetails',
      label: 'Property Details',
      section: 'Section 4a',
      isCompleted: (data) => 
        data.propertyValue !== undefined &&
        data.propertyValue > 0 &&
        !!data.occupancy &&
        data.numberOfUnits !== undefined,
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
        data.willOccupyAsPrimary !== null &&
        data.ownershipInterestInLast3Years !== null &&
        data.borrowingUndisclosedMoney !== null &&
        data.applyingForOtherMortgage !== null &&
        data.applyingForNewCredit !== null &&
        data.outstandingJudgments !== null &&
        data.delinquentOnFederalDebt !== null &&
        data.partyToLawsuit !== null &&
        data.declaredBankruptcy !== null,
    },
    
    // Supporting Documents
    {
      key: 'identification',
      label: 'Government ID (Driver\'s License/Passport)',
      section: 'Documents',
      isCompleted: (data) => 
        !!data.borrowerAddress && 
        !!data.dob,
    },
    {
      key: 'incomeVerification',
      label: 'Income Verification (W-2/Paystubs)',
      section: 'Documents',
      isCompleted: (data) => 
        (data.income ?? 0) > 0 ||
        (data.currentEmployment?.monthlyIncome?.base !== undefined && 
         (data.currentEmployment.monthlyIncome.base ?? 0) > 0),
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
      isCompleted: (data) => 
        // This would typically require file upload tracking
        // For now, we'll check if assets are listed
        !data.assets || 
        (Array.isArray(data.assets) && data.assets.length > 0),
    },
  ];
};

