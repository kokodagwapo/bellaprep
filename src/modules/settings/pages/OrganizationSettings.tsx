import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../../../lib/api';
import type { Tenant } from '../../../lib/api/types';
import { useToast } from '../../../../components/ui/toast';

const OrganizationSettings: React.FC = () => {
  const { showToast } = useToast();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await apiClient.get<Tenant>('/tenants');
        setTenant(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error('Error fetching tenant:', error);
        // Set default values if API fails (for demo purposes)
        setTenant({ 
          id: '1', 
          name: 'My Organization', 
          subdomain: 'my-org',
          logoUrl: null,
          brandColors: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Tenant);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTenant();
  }, []);

  const handleSave = async () => {
    if (!tenant) return;
    setIsSaving(true);
    try {
      await apiClient.patch(`/tenants/${tenant.id}`, tenant);
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground font-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Organization Settings</h1>
        <p className="text-base text-muted-foreground mb-8 font-light" style={{ color: '#6b7280' }}>
          Manage your organization's basic information and configuration
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Organization Name</label>
                <input
                  type="text"
                  value={tenant?.name || ''}
                  onChange={(e) => setTenant({ ...tenant!, name: e.target.value })}
                  placeholder="Enter organization name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-light"
                />
                <p className="text-xs text-muted-foreground mt-1.5 font-light">This name will be displayed to borrowers</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Subdomain</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tenant?.subdomain || ''}
                    onChange={(e) => setTenant({ ...tenant!, subdomain: e.target.value })}
                    placeholder="your-org"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-light"
                  />
                  <span className="text-muted-foreground font-light">.bellaprep.com</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-light">Your custom subdomain for white-label access</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-light transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationSettings;

