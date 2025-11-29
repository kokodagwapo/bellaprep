// Authentication types

export interface LoginCredentials {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  tenantId: string;
  iat: number;
  exp: number;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LENDER_ADMIN = 'LENDER_ADMIN',
  LOAN_OFFICER = 'LOAN_OFFICER',
  PROCESSOR = 'PROCESSOR',
  UNDERWRITER = 'UNDERWRITER',
  CLOSER = 'CLOSER',
  BORROWER = 'BORROWER',
}

export enum MfaMethod {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  TOTP = 'TOTP',
  WEBAUTHN = 'WEBAUTHN',
}

export interface MfaChallenge {
  challengeId: string;
  method: MfaMethod;
  expiresAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActive: Date;
  createdAt: Date;
}

