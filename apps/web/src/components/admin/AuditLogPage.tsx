import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Filter,
  Download,
  RefreshCw,
  User,
  FileText,
  Settings,
  Shield,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  user: {
    name: string;
    email: string;
  };
  details?: any;
  ipAddress?: string;
  timestamp: string;
}

const actionColors: Record<string, string> = {
  LOGIN: 'bg-blue-100 text-blue-700',
  LOGOUT: 'bg-gray-100 text-gray-700',
  LOGIN_FAILED: 'bg-red-100 text-red-700',
  USER_CREATED: 'bg-emerald-100 text-emerald-700',
  USER_UPDATED: 'bg-yellow-100 text-yellow-700',
  LOAN_CREATED: 'bg-purple-100 text-purple-700',
  LOAN_STATUS_CHANGED: 'bg-orange-100 text-orange-700',
  DOCUMENT_UPLOADED: 'bg-cyan-100 text-cyan-700',
  SETTINGS_UPDATED: 'bg-pink-100 text-pink-700',
};

const resourceIcons: Record<string, React.ReactNode> = {
  AUTH: <Shield className="w-4 h-4" />,
  USER: <User className="w-4 h-4" />,
  LOAN: <FileText className="w-4 h-4" />,
  SETTINGS: <Settings className="w-4 h-4" />,
};

export const AuditLogPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>([
    { id: '1', action: 'LOGIN', resource: 'AUTH', user: { name: 'John Smith', email: 'john@example.com' }, ipAddress: '192.168.1.1', timestamp: '2 mins ago' },
    { id: '2', action: 'LOAN_CREATED', resource: 'LOAN', resourceId: 'L-12345', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, timestamp: '15 mins ago' },
    { id: '3', action: 'DOCUMENT_UPLOADED', resource: 'LOAN', resourceId: 'L-12344', user: { name: 'Mike Wilson', email: 'mike@example.com' }, details: { docType: 'W2' }, timestamp: '1 hour ago' },
    { id: '4', action: 'USER_CREATED', resource: 'USER', user: { name: 'Admin', email: 'admin@example.com' }, details: { newUser: 'emily@example.com' }, timestamp: '2 hours ago' },
    { id: '5', action: 'LOAN_STATUS_CHANGED', resource: 'LOAN', resourceId: 'L-12340', user: { name: 'Sarah Johnson', email: 'sarah@example.com' }, details: { from: 'Processing', to: 'Underwriting' }, timestamp: '3 hours ago' },
    { id: '6', action: 'SETTINGS_UPDATED', resource: 'SETTINGS', user: { name: 'Admin', email: 'admin@example.com' }, details: { setting: 'MFA Required' }, timestamp: '5 hours ago' },
    { id: '7', action: 'LOGIN_FAILED', resource: 'AUTH', user: { name: 'Unknown', email: 'hacker@evil.com' }, ipAddress: '203.0.113.42', timestamp: '1 day ago' },
  ]);

  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState({ action: '', resource: '' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 mt-1">Real-time activity monitoring and compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              isLive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select
            value={filter.action}
            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOAN_CREATED">Loan Created</option>
            <option value="DOCUMENT_UPLOADED">Document Uploaded</option>
            <option value="USER_CREATED">User Created</option>
          </select>
          <select
            value={filter.resource}
            onChange={(e) => setFilter({ ...filter, resource: e.target.value })}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">All Resources</option>
            <option value="AUTH">Auth</option>
            <option value="LOAN">Loan</option>
            <option value="USER">User</option>
            <option value="SETTINGS">Settings</option>
          </select>
          <input
            type="date"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="divide-y divide-gray-100">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {resourceIcons[log.resource] || <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      {log.resourceId && (
                        <span className="text-xs text-gray-400 font-mono">{log.resourceId}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">{log.user.name}</span>
                      <span className="text-sm text-gray-400">{log.user.email}</span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-gray-500 mt-1">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {log.ipAddress && (
                    <span className="text-xs text-gray-400 font-mono">{log.ipAddress}</span>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AuditLogPage;

