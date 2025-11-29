import { FormData, LoanPurpose } from '../types';

export interface Requirement {
  key: string;
  label: string;
  isCompleted: (data: FormData) => boolean;
}

const PURCHASE_REQUIREMENTS: Requirement[] = [
  {
    key: 'loanPurpose',
    label: 'Loan Purpose',
    isCompleted: (data) => !!data.loanPurpose,
  },
  {
    key: 'borrowerInfo',
    label: 'Borrower Information',
    isCompleted: (data) => !!data.fullName && !!data.email && !!data.phoneNumber,
  },
  {
    key: 'propertyInfo',
    label: 'Property Details',
    isCompleted: (data) => !!data.location && !!data.propertyType && !!data.propertyUse,
  },
  {
    key: 'creditScore',
    label: 'Credit Score Estimate',
    isCompleted: (data) => !!data.creditScore,
  },
  {
    key: 'financials',
    label: 'Purchase & Down Payment',
    isCompleted: (data) => data.purchasePrice > 0 && data.downPayment > 0,
  },
  {
    key: 'firstTimeBuyer',
    label: 'First-Time Buyer Status',
    isCompleted: (data) => data.isFirstTimeBuyer !== null,
  },
  {
    key: 'militaryStatus',
    label: 'Military Service Status',
    isCompleted: (data) => data.isMilitary !== null,
  },
  {
    key: 'driversLicense',
    label: "Driver's License (via OCR)",
    isCompleted: (data) => !!data.borrowerAddress && !!data.dob,
  },
  {
    key: 'incomeVerification',
    label: 'Income Verification (W-2/Paystub)',
    isCompleted: (data) => (data.income ?? 0) > 0,
  },
];

const REFINANCE_REQUIREMENTS: Requirement[] = [
    {
        key: 'loanPurpose',
        label: 'Loan Purpose',
        isCompleted: (data) => !!data.loanPurpose,
    },
    {
        key: 'borrowerInfo',
        label: 'Borrower Information',
        isCompleted: (data) => !!data.fullName && !!data.email && !!data.phoneNumber,
    },
    {
        key: 'propertyInfo',
        label: 'Property Details',
        isCompleted: (data) => !!data.location && !!data.propertyType && !!data.propertyUse,
    },
    {
        key: 'creditScore',
        label: 'Credit Score Estimate',
        isCompleted: (data) => !!data.creditScore,
    },
    {
        key: 'refinanceFinancials',
        label: 'Property Value & Loan Amount',
        isCompleted: (data) => data.estimatedPropertyValue > 0 && data.loanAmount > 0,
    },
    {
        key: 'militaryStatus',
        label: 'Military Service Status',
        isCompleted: (data) => data.isMilitary !== null,
    },
    {
        key: 'driversLicense',
        label: "Driver's License (via OCR)",
        isCompleted: (data) => !!data.borrowerAddress && !!data.dob,
    },
    {
        key: 'incomeVerification',
        label: 'Income Verification (W-2/Paystub)',
        isCompleted: (data) => (data.income ?? 0) > 0,
    },
];

export const getRequirements = (loanPurpose: LoanPurpose | ''): Requirement[] => {
  // NOTE: This could be expanded with state-specific logic.
  // e.g., if (state === 'CA') { ... return CA_PURCHASE_REQUIREMENTS; }
  return loanPurpose === LoanPurpose.REFINANCE ? REFINANCE_REQUIREMENTS : PURCHASE_REQUIREMENTS;
};