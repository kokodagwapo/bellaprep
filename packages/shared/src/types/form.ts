// Form Builder types

export enum FormType {
  PREP4LOAN = 'PREP4LOAN',
  URLA1003 = 'URLA1003',
  CUSTOM = 'CUSTOM',
}

export interface FormTemplate {
  id: string;
  tenantId: string;
  name: string;
  type: FormType;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  sections: FormSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSection {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  order: number;
  isCollapsible: boolean;
  isCollapsedByDefault: boolean;
  visibilityRules?: VisibilityRule[];
  fields: FormField[];
}

export interface FormField {
  id: string;
  sectionId: string;
  key: string; // unique field identifier
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string;
  order: number;
  
  // Validation
  required: boolean;
  validationRules?: ValidationRule[];
  
  // Options for select/multiselect/radio
  options?: FieldOption[];
  
  // Conditional visibility
  visibilityRules?: VisibilityRule[];
  
  // Product-specific rules
  productRules?: ProductFieldRule[];
  
  // Layout
  width: FieldWidth;
  
  // Mapping to loan data model
  dataPath?: string;
  
  // Auto-fill from integrations
  autoFillSource?: AutoFillSource;
}

export enum FieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  DATE = 'DATE',
  SSN = 'SSN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
  ADDRESS = 'ADDRESS',
  FILE_UPLOAD = 'FILE_UPLOAD',
  SIGNATURE = 'SIGNATURE',
  HEADING = 'HEADING',
  DIVIDER = 'DIVIDER',
  INFO_BOX = 'INFO_BOX',
}

export enum FieldWidth {
  FULL = 'FULL',
  HALF = 'HALF',
  THIRD = 'THIRD',
  QUARTER = 'QUARTER',
}

export interface FieldOption {
  value: string;
  label: string;
  order: number;
}

export interface ValidationRule {
  type: ValidationType;
  value?: string | number;
  message: string;
}

export enum ValidationType {
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  PATTERN = 'PATTERN',
  CUSTOM = 'CUSTOM',
}

export interface VisibilityRule {
  id: string;
  condition: VisibilityCondition;
  action: 'SHOW' | 'HIDE';
}

export interface VisibilityCondition {
  type: 'AND' | 'OR' | 'FIELD' | 'PRODUCT' | 'LOAN_PURPOSE';
  fieldKey?: string;
  operator?: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IS_EMPTY' | 'IS_NOT_EMPTY';
  value?: any;
  conditions?: VisibilityCondition[];
}

export interface ProductFieldRule {
  productId: string;
  required?: boolean;
  visible?: boolean;
  validationRules?: ValidationRule[];
}

export enum AutoFillSource {
  PLAID_IDENTITY = 'PLAID_IDENTITY',
  PLAID_INCOME = 'PLAID_INCOME',
  PLAID_ASSETS = 'PLAID_ASSETS',
  OCR_DRIVERS_LICENSE = 'OCR_DRIVERS_LICENSE',
  OCR_W2 = 'OCR_W2',
  OCR_PAY_STUB = 'OCR_PAY_STUB',
  OCR_BANK_STATEMENT = 'OCR_BANK_STATEMENT',
  ADDRESS_AUTOCOMPLETE = 'ADDRESS_AUTOCOMPLETE',
}

export interface CreateFormTemplateDto {
  name: string;
  type: FormType;
  description?: string;
  sections?: Omit<FormSection, 'id' | 'templateId'>[];
}

export interface UpdateFormTemplateDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  sections?: Omit<FormSection, 'id' | 'templateId'>[];
}

export interface CreateFormSectionDto {
  name: string;
  description?: string;
  order: number;
  isCollapsible?: boolean;
  isCollapsedByDefault?: boolean;
  visibilityRules?: VisibilityRule[];
}

export interface CreateFormFieldDto {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string;
  order: number;
  required?: boolean;
  validationRules?: ValidationRule[];
  options?: FieldOption[];
  visibilityRules?: VisibilityRule[];
  productRules?: ProductFieldRule[];
  width?: FieldWidth;
  dataPath?: string;
  autoFillSource?: AutoFillSource;
}

