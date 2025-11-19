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

export enum CitizenshipStatus {
    US_CITIZEN = 'U.S. Citizen',
    PERMANENT_RESIDENT = 'Permanent Resident Alien',
    NON_PERMANENT_RESIDENT = 'Non-Permanent Resident Alien',
}

export enum CreditType {
    INDIVIDUAL = 'Individual',
    JOINT = 'Joint',
}

export enum MaritalStatus {
    MARRIED = 'Married',
    UNMARRIED = 'Unmarried',
    SEPARATED = 'Separated',
}

export enum HousingStatus {
    OWN = 'Own',
    RENT = 'Rent',
    NO_EXPENSE = 'No primary housing expense',
}

export enum OccupancyType {
    PRIMARY_RESIDENCE = 'Primary Residence',
    SECOND_HOME = 'Second Home',
    INVESTMENT = 'Investment Property',
}

export enum BankruptcyType {
    CHAPTER_7 = 'Chapter 7',
    CHAPTER_11 = 'Chapter 11',
    CHAPTER_12 = 'Chapter 12',
    CHAPTER_13 = 'Chapter 13',
}

// Employment Information
export interface EmploymentInfo {
    employerName?: string;
    employerPhone?: string;
    employerAddress?: {
        street?: string;
        unit?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    position?: string;
    startDate?: string;
    yearsInLineOfWork?: number;
    monthsInLineOfWork?: number;
    isFamilyMember?: boolean;
    isBusinessOwner?: boolean;
    ownershipShare?: number; // 0-100
    monthlyIncome?: {
        base?: number;
        overtime?: number;
        bonus?: number;
        commission?: number;
        militaryEntitlements?: number;
        other?: number;
    };
}

// Asset Information
export interface AssetInfo {
    accountType?: string;
    financialInstitution?: string;
    accountNumber?: string;
    cashOrMarketValue?: number;
}

// Liability Information
export interface LiabilityInfo {
    creditorName?: string;
    accountNumber?: string;
    monthlyPayment?: number;
    unpaidBalance?: number;
    type?: string;
    creditLimit?: number;
    propertyAddress?: string;
    propertyType?: string;
}

export interface FormData {
  // Section 1a: Personal Information
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
  income?: number;
  borrowerAddress?: string;
  dob?: string;
  estimatedPropertyValue: number;
  
  // Section 1a: Extended Personal Information
  ssn?: string; // Social Security Number or ITIN
  alternateNames?: string;
  citizenship?: CitizenshipStatus | '';
  creditType?: CreditType | '';
  totalBorrowers?: number;
  otherBorrowerNames?: string;
  maritalStatus?: MaritalStatus | '';
  dependentsCount?: number;
  dependentsAges?: string; // Comma-separated ages
  
  // Contact Information
  homePhone?: string;
  cellPhone?: string;
  workPhone?: string;
  workPhoneExt?: string;
  
  // Current Address Details
  currentAddress?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  yearsAtCurrentAddress?: number;
  monthsAtCurrentAddress?: number;
  currentHousingStatus?: HousingStatus | '';
  currentMonthlyHousingPayment?: number;
  
  // Former Address (if at current address < 2 years)
  formerAddress?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  yearsAtFormerAddress?: number;
  monthsAtFormerAddress?: number;
  formerHousingStatus?: HousingStatus | '';
  formerMonthlyHousingPayment?: number;
  
  // Mailing Address
  mailingAddressSameAsCurrent?: boolean;
  mailingAddress?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  
  // Section 1b: Current Employment
  currentEmployment?: EmploymentInfo;
  
  // Section 1c: Additional Employment
  additionalEmployment?: EmploymentInfo;
  
  // Section 1d: Previous Employment
  previousEmployment?: {
    employerName?: string;
    employerAddress?: {
      street?: string;
      unit?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    position?: string;
    startDate?: string;
    endDate?: string;
    previousGrossMonthlyIncome?: number;
    wasBusinessOwner?: boolean;
  };
  
  // Section 1e: Income from Other Sources
  otherIncome?: Array<{
    source?: string; // Alimony, Child Support, Social Security, etc.
    monthlyAmount?: number;
  }>;
  
  // Section 2a: Assets - Bank Accounts, Retirement, Other
  assets?: AssetInfo[];
  
  // Section 2b: Other Assets and Credits
  otherAssets?: Array<{
    assetType?: string; // Proceeds from Real Estate, Earnest Money, etc.
    cashOrMarketValue?: number;
  }>;
  
  // Section 3a: Real Estate Liabilities
  realEstateLiabilities?: LiabilityInfo[];
  
  // Section 3b: Other Liabilities
  otherLiabilities?: LiabilityInfo[];
  
  // Section 4a: Loan and Property Information
  propertyAddress?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  numberOfUnits?: number;
  propertyValue?: number;
  occupancy?: OccupancyType | '';
  isFhaSecondaryResidence?: boolean | null;
  isMixedUseProperty?: boolean | null;
  isManufacturedHome?: boolean | null;
  
  // Section 4b: Other New Mortgage Loans
  otherMortgageLoans?: Array<{
    creditorName?: string;
    lienType?: string;
    monthlyPayment?: number;
    loanAmount?: number;
    creditLimit?: number;
  }>;
  
  // Section 4c: Rental Income (Purchase Only)
  rentalIncome?: {
    expectedMonthlyRentalIncome?: number;
    expectedNetMonthlyRentalIncome?: number; // Lender calculated
  };
  
  // Section 4d: Gifts or Grants
  giftsOrGrants?: Array<{
    assetType?: string; // Cash Gift, Gift of Equity, Grant
    deposited?: boolean;
    source?: string; // Relative, Lender, Employer, etc.
    cashOrMarketValue?: number;
  }>;
  
  // Section 5a: Declarations - Property and Money
  willOccupyAsPrimary?: boolean | null;
  ownershipInterestInLast3Years?: boolean | null;
  previousPropertyType?: string; // PR, SR, SH, IP
  previousTitleHeld?: string; // S, SP, O
  familyRelationshipWithSeller?: boolean | null;
  borrowingUndisclosedMoney?: boolean | null;
  undisclosedMoneyAmount?: number;
  applyingForOtherMortgage?: boolean | null;
  applyingForNewCredit?: boolean | null;
  propertySubjectToPriorityLien?: boolean | null;
  
  // Section 5b: Declarations - Finances
  isCoSigner?: boolean | null;
  outstandingJudgments?: boolean | null;
  delinquentOnFederalDebt?: boolean | null;
  partyToLawsuit?: boolean | null;
  conveyedTitleInLieuOfForeclosure?: boolean | null;
  preForeclosureSale?: boolean | null;
  propertyForeclosed?: boolean | null;
  declaredBankruptcy?: boolean | null;
  bankruptcyType?: BankruptcyType[];
  
  // Military Service
  militaryService?: {
    servedInArmedForces?: boolean | null;
    currentlyServing?: boolean | null;
    serviceExpirationDate?: string;
    currentlyRetired?: boolean | null;
    onlyNonActivatedReserve?: boolean | null;
    isSurvivingSpouse?: boolean | null;
  };
  
  // Demographic Information
  ethnicity?: {
    hispanicOrLatino?: boolean;
    notHispanicOrLatino?: boolean;
    declineToAnswer?: boolean;
    origin?: string; // If Hispanic/Latino
  };
  race?: {
    americanIndianOrAlaskaNative?: boolean;
    asian?: boolean;
    blackOrAfricanAmerican?: boolean;
    nativeHawaiianOrPacificIslander?: boolean;
    white?: boolean;
    declineToAnswer?: boolean;
    tribeName?: string;
    asianOrigin?: string;
    pacificIslanderOrigin?: string;
  };
  demographicCollectionMethod?: string; // Face-to-face, Telephone, Fax/Mail, Email/Internet
}