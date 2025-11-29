import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from './types';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<LoginResponse>('/auth/register', data),
  logout: () => {
    apiClient.setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  },
  verifyMfa: (data: { token: string; code: string }) =>
    apiClient.post<LoginResponse>('/auth/mfa/verify', data),
  setupMfa: (data: { type: 'totp' | 'sms' | 'email' }) =>
    apiClient.post<{ secret: string; qrCode: string }>('/auth/mfa/setup', data),
  enableMfa: (data: { secret: string; code: string }) =>
    apiClient.post<{ success: boolean }>('/auth/mfa/enable', data),
  requestPasswordReset: (data: { email: string }) =>
    apiClient.post<{ success: boolean }>('/auth/password/reset-request', data),
  resetPassword: (data: { password: string; token: string }) =>
    apiClient.post<{ success: boolean }>('/auth/password/reset', data),
  getMe: () => apiClient.get('/auth/me'),
};
