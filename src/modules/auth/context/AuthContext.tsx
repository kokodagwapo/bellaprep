import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, authApi } from '../../../lib/api';
import type { LoginResponse } from '../../../lib/api/types';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, tenantId?: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      // Verify token by fetching user
      authApi
        .getMe()
        .then((userData) => {
          setUser(userData as any);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, tenantId?: string) => {
    const response = await authApi.login({ email, password, tenantId });
    setUser(response.user);
    setToken(response.accessToken);
    apiClient.setToken(response.accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

