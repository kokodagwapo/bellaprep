// User types

import { UserRole, MfaMethod } from './auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  mfaEnabled: boolean;
  mfaMethods: MfaMethod[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface UserPermissions {
  loans: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  products: {
    view: boolean;
    configure: boolean;
  };
  forms: {
    view: boolean;
    build: boolean;
  };
  reports: {
    view: boolean;
    export: boolean;
  };
  audit: {
    view: boolean;
  };
}

// Role-based permission defaults
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.SUPER_ADMIN]: {
    loans: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, edit: true },
    users: { view: true, create: true, edit: true, delete: true },
    products: { view: true, configure: true },
    forms: { view: true, build: true },
    reports: { view: true, export: true },
    audit: { view: true },
  },
  [UserRole.LENDER_ADMIN]: {
    loans: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, edit: true },
    users: { view: true, create: true, edit: true, delete: true },
    products: { view: true, configure: true },
    forms: { view: true, build: true },
    reports: { view: true, export: true },
    audit: { view: true },
  },
  [UserRole.LOAN_OFFICER]: {
    loans: { view: true, create: true, edit: true, delete: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, configure: false },
    forms: { view: true, build: false },
    reports: { view: true, export: false },
    audit: { view: false },
  },
  [UserRole.PROCESSOR]: {
    loans: { view: true, create: false, edit: true, delete: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, configure: false },
    forms: { view: true, build: false },
    reports: { view: true, export: false },
    audit: { view: false },
  },
  [UserRole.UNDERWRITER]: {
    loans: { view: true, create: false, edit: true, delete: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, configure: false },
    forms: { view: true, build: false },
    reports: { view: true, export: false },
    audit: { view: false },
  },
  [UserRole.CLOSER]: {
    loans: { view: true, create: false, edit: true, delete: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, configure: false },
    forms: { view: true, build: false },
    reports: { view: true, export: false },
    audit: { view: false },
  },
  [UserRole.BORROWER]: {
    loans: { view: true, create: true, edit: true, delete: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, configure: false },
    forms: { view: true, build: false },
    reports: { view: false, export: false },
    audit: { view: false },
  },
};

