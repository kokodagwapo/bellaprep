import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  Check,
  X,
  ExternalLink,
  Settings,
  RefreshCw,
  Calendar,
  CreditCard,
  MessageSquare,
  Mail,
  Phone,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSync?: string;
  status?: 'active' | 'error' | 'pending';
}

export const IntegrationsPage: React.FC = () => {
  const [integrations] = useState<Integration[]>([
    {
      id: 'plaid',
      name: 'Plaid',
      description: 'Connect bank accounts for asset and income verification',
      icon: <CreditCard className="w-6 h-6" />,
      isConnected: true,
      lastSync: '2 hours ago',
      status: 'active',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync appointments and meetings',
      icon: <Calendar className="w-6 h-6" />,
      isConnected: true,
      lastSync: '1 hour ago',
      status: 'active',
    },
    {
      id: 'microsoft-calendar',
      name: 'Microsoft 365',
      description: 'Sync with Outlook calendar',
      icon: <Calendar className="w-6 h-6" />,
      isConnected: false,
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email notifications and templates',
      icon: <Mail className="w-6 h-6" />,
      isConnected: true,
      lastSync: '5 mins ago',
      status: 'active',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS notifications and MFA',
      icon: <Phone className="w-6 h-6" />,
      isConnected: true,
      status: 'active',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Power Bella AI assistant',
      icon: <MessageSquare className="w-6 h-6" />,
      isConnected: true,
      status: 'active',
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 mt-1">Connect third-party services to enhance your workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${integration.isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                  {integration.isConnected && integration.lastSync && (
                    <p className="text-xs text-gray-400 mt-2">Last synced: {integration.lastSync}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integration.isConnected ? (
                  <>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Settings className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                    Connect
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;

