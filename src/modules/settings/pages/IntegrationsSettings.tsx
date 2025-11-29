import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Integration {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
}

const IntegrationsSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'plaid',
      name: 'Plaid',
      description: 'Connect bank accounts and verify income automatically',
      enabled: false,
      status: 'disconnected',
      icon: '🏦'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync appointments and schedule meetings',
      enabled: false,
      status: 'disconnected',
      icon: '📅'
    },
    {
      id: 'office365',
      name: 'Office 365',
      description: 'Sync with Microsoft Outlook calendar',
      enabled: false,
      status: 'disconnected',
      icon: '📧'
    },
    {
      id: 'encompass',
      name: 'Encompass',
      description: 'Loan origination system integration',
      enabled: false,
      status: 'disconnected',
      icon: '🔗'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM integration for lead management',
      enabled: false,
      status: 'disconnected',
      icon: '☁️'
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id 
        ? { ...i, enabled: !i.enabled, status: !i.enabled ? 'connected' : 'disconnected' }
        : i
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Integrations</h1>
        <p className="text-base text-muted-foreground mb-8 font-light" style={{ color: '#6b7280' }}>
          Connect third-party services to enhance your workflow
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: integrations.indexOf(integration) * 0.05 }}
              className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                integration.enabled ? 'border-primary/30' : 'border-gray-200/80'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-light text-foreground">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground font-light mt-1">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => toggleIntegration(integration.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-md font-light ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
                {integration.enabled && (
                  <button className="text-sm text-primary hover:text-primary/80 font-light">
                    Configure
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-light">
            <strong className="font-medium">Note:</strong> Some integrations require API keys and webhook configuration. 
            Contact support for assistance with setup.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default IntegrationsSettings;

