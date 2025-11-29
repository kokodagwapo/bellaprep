// Loan Product types

export enum LoanProductType {
  CONVENTIONAL = 'CONVENTIONAL',
  FHA = 'FHA',
  VA = 'VA',
  USDA = 'USDA',
  JUMBO = 'JUMBO',
  HELOC = 'HELOC',
  NON_QM = 'NON_QM',
  MANUFACTURED = 'MANUFACTURED',
}

export enum PropertyType {
  SINGLE_FAMILY = 'SINGLE_FAMILY',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  MULTI_FAMILY_2_4 = 'MULTI_FAMILY_2_4',
  MANUFACTURED = 'MANUFACTURED',
  MOBILE_HOME = 'MOBILE_HOME',
  CO_OP = 'CO_OP',
}

export enum OccupancyType {
  PRIMARY_RESIDENCE = 'PRIMARY_RESIDENCE',
  SECOND_HOME = 'SECOND_HOME',
  INVESTMENT = 'INVESTMENT',
}

export interface LoanProduct {
  id: string;
  tenantId: string;
  name: string;
  type: LoanProductType;
  description?: string;
  isActive: boolean;
  
  // Eligibility rules
  eligibility: ProductEligibility;
  
  // Required fields for this product
  requiredFields: string[];
  
  // Required documents
  requiredDocuments: string[];
  
  // Associated form template
  formTemplateId?: string;
  
  // Display order
  order: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductEligibility {
  // Property constraints
  allowedPropertyTypes: PropertyType[];
  allowedOccupancyTypes: OccupancyType[];
  
  // Loan amount constraints
  minLoanAmount: number;
  maxLoanAmount: number;
  
  // LTV constraints
  maxLtv: number;
  maxCltv?: number;
  
  // Credit requirements
  minCreditScore: number;
  
  // DTI requirements
  maxDti: number;
  maxFrontEndDti?: number;
  
  // Special requirements
  requiresMilitaryStatus?: boolean;
  requiresFirstTimeBuyer?: boolean;
  allowsNonWarrantableCondo?: boolean;
  
  // Geographic restrictions
  allowedStates?: string[];
  excludedStates?: string[];
  
  // Custom rules (JSON logic or expressions)
  customRules?: ProductRule[];
}

export interface ProductRule {
  id: string;
  name: string;
  description?: string;
  condition: string; // JSON Logic or expression
  errorMessage: string;
}

export interface EligibilityResult {
  eligible: boolean;
  productId: string;
  productName: string;
  reasons: string[];
  warnings?: string[];
}

export interface EligibilityCheckRequest {
  loanAmount: number;
  propertyValue: number;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  creditScore: number;
  dti: number;
  isMilitary?: boolean;
  isFirstTimeBuyer?: boolean;
  state: string;
}

export interface CreateProductDto {
  name: string;
  type: LoanProductType;
  description?: string;
  eligibility: ProductEligibility;
  requiredFields?: string[];
  requiredDocuments?: string[];
  order?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  eligibility?: Partial<ProductEligibility>;
  requiredFields?: string[];
  requiredDocuments?: string[];
  formTemplateId?: string;
  order?: number;
}

