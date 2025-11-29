import React, { useState } from 'react';

const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [settings, setSettings] = useState({
    orgName: 'TerraVerde Mortgage',
    logo: '',
    primaryColor: '#2563eb',
    supportEmail: 'support@teraverde.com',
    supportPhone: '(555) 123-4567',
    timezone: 'America/New_York',
    mfaRequired: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    apiKeyPrefix: 'tv_live_',
  });

  const tabs = [
    { id: 'organization', label: 'Organization', icon: '🏢' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'api', label: 'API & Webhooks', icon: '🔌' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Configure your organization and preferences.</p>
      </header>

      <div className="flex gap-6">
        <div className="w-64 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full px-4 py-3 text-left rounded-lg flex items-center gap-3 ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Organization Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input type="text" value={settings.orgName} onChange={(e) => setSettings({ ...settings, orgName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                  <input type="tel" value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Branding</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Drag and drop your logo here, or click to browse</p>
                  <button className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Upload Logo</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer" />
                  <input type="text" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg w-32" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Require MFA for all users</p>
                    <p className="text-sm text-gray-500">Enforce multi-factor authentication</p>
                  </div>
                  <button onClick={() => setSettings({ ...settings, mfaRequired: !settings.mfaRequired })}
                    className={`w-12 h-6 rounded-full relative ${settings.mfaRequired ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.mfaRequired ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                  <input type="number" value={settings.passwordExpiry} onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">API & Webhooks</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm">{settings.apiKeyPrefix}••••••••••••••••</code>
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">Copy</button>
                  <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm">Regenerate</button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Webhook Endpoints</h3>
                <div className="space-y-2">
                  {['Loan Submitted', 'Document Uploaded', 'Status Changed'].map(event => (
                    <div key={event} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm text-gray-700">{event}</span>
                      <button className="text-sm text-blue-600">Configure</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Billing & Subscription</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Professional Plan</p>
                    <p className="text-sm text-blue-700">$299/month • Billed annually</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Upgrade</button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Usage This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Applications</span><span className="font-medium">247 / 500</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Users</span><span className="font-medium">12 / 25</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Storage</span><span className="font-medium">4.2 GB / 10 GB</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                {['New loan application', 'Document uploaded', 'Status change', 'Daily summary', 'Weekly report'].map(notif => (
                  <div key={notif} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-700">{notif}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="rounded" /> Email</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> SMS</label>
                    </div>
                  </div>
                ))}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
