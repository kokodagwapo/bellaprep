// Loan application types

import { LoanProductType, PropertyType, OccupancyType } from './product';

export enum LoanStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  PROCESSING = 'PROCESSING',
  UNDERWRITING = 'UNDERWRITING',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY_APPROVED',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WITHDRAWN = 'WITHDRAWN',
  CLOSED = 'CLOSED',
}

export enum LoanPurpose {
  PURCHASE = 'PURCHASE',
  REFINANCE = 'REFINANCE',
  CASH_OUT_REFINANCE = 'CASH_OUT_REFINANCE',
  CONSTRUCTION = 'CONSTRUCTION',
  HOME_EQUITY = 'HOME_EQUITY',
}

export interface Loan {
  id: string;
  tenantId: string;
  borrowerId: string;
  loanOfficerId?: string;
  processorId?: string;
  underwriterId?: string;
  closerId?: string;
  
  // Loan details
  productId: string;
  productType: LoanProductType;
  purpose: LoanPurpose;
  status: LoanStatus;
  
  // Property info
  propertyAddress: Address;
  propertyType: PropertyType;
  occupancyType: OccupancyType;
  propertyValue: number;
  
  // Loan terms
  loanAmount: number;
  downPayment: number;
  interestRate?: number;
  term?: number; // months
  
  // Form data (full Prep4Loan + URLA data)
  formData: Record<string, any>;
  
  // Documents
  documents: LoanDocument[];
  
  // Timeline events
  timeline: LoanTimelineEvent[];
  
  // Dates
  applicationDate: Date;
  submittedDate?: Date;
  approvedDate?: Date;
  closedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
}

export interface LoanDocument {
  id: string;
  loanId: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  s3Key: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  ocrData?: Record<string, any>;
}

export enum DocumentType {
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  PASSPORT = 'PASSPORT',
  W2 = 'W2',
  PAY_STUB = 'PAY_STUB',
  TAX_RETURN = 'TAX_RETURN',
  BANK_STATEMENT = 'BANK_STATEMENT',
  ASSET_STATEMENT = 'ASSET_STATEMENT',
  PURCHASE_CONTRACT = 'PURCHASE_CONTRACT',
  APPRAISAL = 'APPRAISAL',
  TITLE_REPORT = 'TITLE_REPORT',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

export enum DocumentCategory {
  IDENTITY = 'IDENTITY',
  INCOME = 'INCOME',
  ASSETS = 'ASSETS',
  PROPERTY = 'PROPERTY',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
}

export interface LoanTimelineEvent {
  id: string;
  loanId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export enum TimelineEventType {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED',
  NOTE_ADDED = 'NOTE_ADDED',
  ASSIGNED = 'ASSIGNED',
  CONDITION_ADDED = 'CONDITION_ADDED',
  CONDITION_CLEARED = 'CONDITION_CLEARED',
  COMMENT = 'COMMENT',
}

export interface CreateLoanDto {
  productId: string;
  purpose: LoanPurpose;
  propertyAddress?: Address;
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
  propertyValue?: number;
  loanAmount?: number;
  downPayment?: number;
  formData?: Record<string, any>;
}

export interface UpdateLoanDto {
  status?: LoanStatus;
  loanOfficerId?: string;
  processorId?: string;
  underwriterId?: string;
  closerId?: string;
  propertyAddress?: Address;
  propertyType?: PropertyType;
  occupancyType?: OccupancyType;
  propertyValue?: number;
  loanAmount?: number;
  downPayment?: number;
  interestRate?: number;
  term?: number;
  formData?: Record<string, any>;
}

