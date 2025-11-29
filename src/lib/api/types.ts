// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  subdomain?: string;
  logoUrl?: string | null;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Product {
  id: string;
  tenantId: string;
  name: string;
  enabled: boolean;
  propertyTypes: string[];
  requiredFields: string[];
  conditionalLogic: Record<string, any>;
  checklists: any[];
  underwritingRules: Record<string, any>;
}

// Form types
export interface FormTemplate {
  id: string;
  tenantId: string;
  name: string;
  type: 'PREP4LOAN' | 'URLA_1003';
  sections: FormSection[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  visibilityRules?: Record<string, any>;
  products?: string[];
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  validation?: Record<string, any>;
  visibilityRules?: Record<string, any>;
  products?: string[];
  placeholder?: string;
  options?: any[];
}

// Borrower types
export interface Borrower {
  id: string;
  tenantId: string;
  productId?: string;
  email: string;
  phone?: string;
  formData: Record<string, any>;
  status: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  submittedAt?: string;
  createdAt: string;
}

// QR Code types
export interface QRCode {
  id: string;
  tenantId: string;
  type: string;
  token: string;
  expiresAt: string;
  metadata?: Record<string, any>;
  qrCodeImage?: string;
}

// Analytics types
export interface PipelineMetrics {
  total: number;
  byStatus: Record<string, number>;
  byProduct: Record<string, number>;
}

export interface FunnelAnalytics {
  started: number;
  submitted: number;
  inReview: number;
  approved: number;
  closed: number;
}

// User types
export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'LOAN_OFFICER' | 'PROCESSOR' | 'UNDERWRITER' | 'CLOSER' | 'BORROWER';
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// Integration types
export interface Integration {
  id: string;
  tenantId: string;
  type: 'PLAID' | 'GOOGLE_CALENDAR' | 'OFFICE365' | 'ENCOMPASS' | 'SALESFORCE' | 'SENDGRID' | 'TWILIO';
  config: Record<string, any>;
  enabled: boolean;
  createdAt: string;
}

// API Key types
export interface ApiKey {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
  revokedAt?: string;
}

// Audit Log types
export interface AuditLog {
  id: string;
  tenantId?: string;
  userId?: string;
  borrowerId?: string;
  event: string;
  module: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

