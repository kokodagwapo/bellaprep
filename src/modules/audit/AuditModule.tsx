import React, { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}

const mockLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-02-15 14:32:15', user: 'john.doe@lender.com', action: 'LOGIN', resource: 'Auth', details: 'User logged in successfully', ip: '192.168.1.100', status: 'success' },
  { id: '2', timestamp: '2024-02-15 14:30:22', user: 'jane.smith@lender.com', action: 'UPDATE', resource: 'Borrower', details: 'Updated borrower profile #12345', ip: '192.168.1.101', status: 'success' },
  { id: '3', timestamp: '2024-02-15 14:28:45', user: 'system', action: 'SYNC', resource: 'Plaid', details: 'Synced account balances', ip: 'internal', status: 'success' },
  { id: '4', timestamp: '2024-02-15 14:25:10', user: 'john.doe@lender.com', action: 'CREATE', resource: 'QRCode', details: 'Created new QR code for document upload', ip: '192.168.1.100', status: 'success' },
  { id: '5', timestamp: '2024-02-15 14:20:33', user: 'api-service', action: 'WEBHOOK', resource: 'SendGrid', details: 'Email delivery confirmed', ip: 'external', status: 'success' },
  { id: '6', timestamp: '2024-02-15 14:15:00', user: 'jane.smith@lender.com', action: 'DELETE', resource: 'Document', details: 'Deleted duplicate document', ip: '192.168.1.101', status: 'warning' },
  { id: '7', timestamp: '2024-02-15 14:10:22', user: 'system', action: 'MFA', resource: 'Auth', details: 'MFA verification failed for user@example.com', ip: '10.0.0.50', status: 'error' },
  { id: '8', timestamp: '2024-02-15 14:05:18', user: 'admin@lender.com', action: 'CONFIG', resource: 'Product', details: 'Updated FHA loan limits', ip: '192.168.1.1', status: 'success' },
];

const AuditModule: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(mockLogs);
  const [filter, setFilter] = useState({ action: '', status: '', search: '' });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const actions = ['LOGIN', 'UPDATE', 'CREATE', 'DELETE', 'SYNC', 'VIEW'];
        const resources = ['Borrower', 'Document', 'Product', 'Form', 'User'];
        const newLog: AuditLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
          user: 'system',
          action: actions[Math.floor(Math.random() * actions.length)],
          resource: resources[Math.floor(Math.random() * resources.length)],
          details: 'Real-time audit event',
          ip: '192.168.1.' + Math.floor(Math.random() * 255),
          status: 'success',
        };
        setLogs(prev => [newLog, ...prev.slice(0, 49)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const filteredLogs = logs.filter(log => {
    if (filter.action && log.action !== filter.action) return false;
    if (filter.status && log.status !== filter.status) return false;
    if (filter.search && !log.details.toLowerCase().includes(filter.search.toLowerCase()) && !log.user.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const statusColors = { success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700' };
  const actionColors: Record<string, string> = { LOGIN: 'bg-blue-100 text-blue-700', UPDATE: 'bg-purple-100 text-purple-700', CREATE: 'bg-green-100 text-green-700', DELETE: 'bg-red-100 text-red-700', SYNC: 'bg-cyan-100 text-cyan-700', VIEW: 'bg-gray-100 text-gray-700', WEBHOOK: 'bg-orange-100 text-orange-700', MFA: 'bg-indigo-100 text-indigo-700', CONFIG: 'bg-pink-100 text-pink-700' };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-gray-500">Real-time activity monitoring and compliance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsLive(!isLive)} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isLive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Export Logs</button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-semibold text-gray-900">{logs.length}</p>
          <p className="text-xs text-gray-500">Total Events</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-semibold text-green-600">{logs.filter(l => l.status === 'success').length}</p>
          <p className="text-xs text-gray-500">Successful</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-semibold text-yellow-600">{logs.filter(l => l.status === 'warning').length}</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-semibold text-red-600">{logs.filter(l => l.status === 'error').length}</p>
          <p className="text-xs text-gray-500">Errors</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <input type="text" placeholder="Search logs..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <select value={filter.action} onChange={(e) => setFilter({ ...filter, action: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="UPDATE">Update</option>
            <option value="CREATE">Create</option>
            <option value="DELETE">Delete</option>
            <option value="SYNC">Sync</option>
          </select>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{log.user}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>{log.action}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-900">{log.resource}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[log.status]}`}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditModule;
