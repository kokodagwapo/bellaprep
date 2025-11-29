// Audit logging types

export enum AuditAction {
  // Auth
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  MFA_VERIFIED = 'MFA_VERIFIED',
  MFA_FAILED = 'MFA_FAILED',
  
  // User management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  
  // Tenant management
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_UPDATED = 'TENANT_UPDATED',
  TENANT_SETTINGS_CHANGED = 'TENANT_SETTINGS_CHANGED',
  
  // Loan operations
  LOAN_CREATED = 'LOAN_CREATED',
  LOAN_UPDATED = 'LOAN_UPDATED',
  LOAN_SUBMITTED = 'LOAN_SUBMITTED',
  LOAN_STATUS_CHANGED = 'LOAN_STATUS_CHANGED',
  LOAN_ASSIGNED = 'LOAN_ASSIGNED',
  LOAN_DELETED = 'LOAN_DELETED',
  
  // Document operations
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED',
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',
  DOCUMENT_DOWNLOADED = 'DOCUMENT_DOWNLOADED',
  
  // Product operations
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  PRODUCT_ACTIVATED = 'PRODUCT_ACTIVATED',
  PRODUCT_DEACTIVATED = 'PRODUCT_DEACTIVATED',
  
  // Form operations
  FORM_TEMPLATE_CREATED = 'FORM_TEMPLATE_CREATED',
  FORM_TEMPLATE_UPDATED = 'FORM_TEMPLATE_UPDATED',
  FORM_DATA_SAVED = 'FORM_DATA_SAVED',
  
  // Integration operations
  PLAID_CONNECTED = 'PLAID_CONNECTED',
  PLAID_DISCONNECTED = 'PLAID_DISCONNECTED',
  CALENDAR_CONNECTED = 'CALENDAR_CONNECTED',
  CALENDAR_DISCONNECTED = 'CALENDAR_DISCONNECTED',
  
  // QR operations
  QR_GENERATED = 'QR_GENERATED',
  QR_SCANNED = 'QR_SCANNED',
  
  // Settings
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  INTEGRATION_CONFIGURED = 'INTEGRATION_CONFIGURED',
  
  // Other
  EXPORT_GENERATED = 'EXPORT_GENERATED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
}

export enum AuditResource {
  AUTH = 'AUTH',
  USER = 'USER',
  TENANT = 'TENANT',
  LOAN = 'LOAN',
  DOCUMENT = 'DOCUMENT',
  PRODUCT = 'PRODUCT',
  FORM = 'FORM',
  INTEGRATION = 'INTEGRATION',
  QR = 'QR',
  SETTINGS = 'SETTINGS',
  API_KEY = 'API_KEY',
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: Record<string, any>;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  createdAt: Date;
}

export interface AuditLogFilter {
  tenantId?: string;
  userId?: string;
  action?: AuditAction[];
  resource?: AuditResource[];
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
}

export interface AuditLogPage {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateAuditLogDto {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: Record<string, any>;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
}

