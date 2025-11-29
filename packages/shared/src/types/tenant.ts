// Tenant/Lender types

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings: TenantSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  // Branding
  companyName: string;
  companyAddress?: string;
  nmlsId?: string;
  website?: string;
  supportEmail?: string;
  supportPhone?: string;
  
  // Features
  enableVoiceAssistant: boolean;
  enableChatAssistant: boolean;
  enablePlaid: boolean;
  enableCalendarSync: boolean;
  enableQrCodes: boolean;
  enableMfa: boolean;
  
  // Integration configs (encrypted)
  plaidClientId?: string;
  plaidSecret?: string;
  googleCalendarClientId?: string;
  sendgridApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  
  // Custom RAG knowledgebase
  customKnowledgebase?: string;
}

export interface CreateTenantDto {
  name: string;
  slug: string;
  adminEmail: string;
  adminPassword: string;
  settings?: Partial<TenantSettings>;
}

export interface UpdateTenantDto {
  name?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings?: Partial<TenantSettings>;
  isActive?: boolean;
}

