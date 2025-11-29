import React from 'react';
import { Settings, Users, Building2, Palette, Key, Shield, FileText, QrCode, BarChart3 } from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, activeTab = 'organization', onTabChange }) => {
  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'products', label: 'Products', icon: FileText },
    { id: 'forms', label: 'Form Builder', icon: Settings },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Key },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'qr', label: 'QR Codes', icon: QrCode },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: BarChart3 },
  ];

  return (
    <div className="flex h-full w-full bg-white">
      <div className="w-64 bg-white border-r border-gray-200/80 flex-shrink-0">
        <div className="p-6 border-b border-gray-200/80">
          <h2 className="text-2xl font-light text-foreground tracking-tight">Settings</h2>
        </div>
        <nav className="mt-2 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 font-light justify-start ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                <span className={`text-left ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;

