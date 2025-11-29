import React, { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: 'financial' | 'calendar' | 'communication' | 'crm';
  config?: Record<string, string>;
}

const defaultIntegrations: Integration[] = [
  { id: 'plaid', name: 'Plaid', description: 'Connect bank accounts for income & asset verification', icon: '🏦', connected: false, category: 'financial' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Sync appointments and meetings', icon: '📅', connected: true, category: 'calendar' },
  { id: 'office365', name: 'Office 365', description: 'Microsoft calendar and email integration', icon: '📧', connected: false, category: 'calendar' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Email notifications and templates', icon: '✉️', connected: true, category: 'communication' },
  { id: 'twilio', name: 'Twilio', description: 'SMS notifications and verification', icon: '📱', connected: false, category: 'communication' },
  { id: 'encompass', name: 'Encompass LOS', description: 'Loan origination system integration', icon: '🏠', connected: false, category: 'crm' },
  { id: 'salesforce', name: 'Salesforce', description: 'CRM and lead management', icon: '☁️', connected: false, category: 'crm' },
];

const IntegrationsModule: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    setSaveMessage('Integration updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const categories = [
    { id: 'financial', name: 'Financial Services', icon: '💳' },
    { id: 'calendar', name: 'Calendar & Scheduling', icon: '📅' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'crm', name: 'CRM & LOS', icon: '🏢' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
        <p className="mt-1 text-gray-500">Connect third-party services to enhance your workflow.</p>
      </header>

      {saveMessage && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveMessage}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span>{category.icon}</span> {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.filter(i => i.category === category.id).map(integration => (
                  <div key={integration.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedIntegration?.id === integration.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setSelectedIntegration(integration)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{integration.name}</h3>
                          <p className="text-xs text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${integration.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          {selectedIntegration ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedIntegration.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedIntegration.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedIntegration.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedIntegration.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">{selectedIntegration.description}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API key..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <button onClick={() => toggleConnection(selectedIntegration.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${selectedIntegration.connected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  {selectedIntegration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select an integration to configure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsModule;
