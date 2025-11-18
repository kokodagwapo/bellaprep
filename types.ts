export enum LoanPurpose {
  PURCHASE = 'Purchase a Home',
  REFINANCE = 'Refinance',
}

export enum PropertyType {
    SINGLE_FAMILY = 'Single Family Home',
    CONDO = 'Condominium',
    TOWNHOUSE = 'Townhouse',
    MULTI_FAMILY = 'Multi-Family Home',
}

export enum PropertyUse {
    PRIMARY_RESIDENCE = 'Primary Residence',
    SECOND_HOME = 'Second Home',
    INVESTMENT = 'Investment Property',
}

export enum CreditScore {
    EXCELLENT = 'Excellent (740+)',
    GOOD = 'Good (700-739)',
    AVERAGE = 'Average (640-699)',
    FAIR = 'Fair (580-639)',
}

export interface FormData {
  loanPurpose: LoanPurpose | '';
  propertyType: PropertyType | '';
  propertyUse: PropertyUse | '';
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  creditScore: CreditScore | '';
  location: string;
  isFirstTimeBuyer: boolean | null;
  isMilitary: boolean | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  income?: number; // Added to store extracted income
  borrowerAddress?: string;
  dob?: string;
  estimatedPropertyValue: number;
}