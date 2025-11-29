import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api/client';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings?: any;
}

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    try {
      // Try to detect tenant from subdomain
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0];
      
      // If subdomain exists and isn't 'www' or 'localhost', fetch tenant
      if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
        const tenantData = await apiClient.get<Tenant>(`/tenants/by-slug/${subdomain}`);
        setTenant(tenantData);
        localStorage.setItem('tenant_id', tenantData.id);
      } else {
        // Try to load from localStorage
        const tenantId = localStorage.getItem('tenant_id');
        if (tenantId) {
          const tenantData = await apiClient.get<Tenant>(`/tenants/${tenantId}`);
          setTenant(tenantData);
        }
      }
    } catch (error) {
      console.error('Failed to load tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tenant,
    isLoading,
    setTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

