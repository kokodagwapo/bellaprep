import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  event: string;
  module: string;
  ipAddress: string;
  details: string;
}

const AuditLogsSettings: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-01-20 14:32:15',
      user: 'Jane Doe',
      event: 'Login',
      module: 'Auth',
      ipAddress: '192.168.1.100',
      details: 'User logged in successfully'
    },
    {
      id: '2',
      timestamp: '2024-01-20 14:28:42',
      user: 'John Smith',
      event: 'Form Submission',
      module: 'Prep4Loan',
      ipAddress: '192.168.1.101',
      details: 'Submitted Prep4Loan application'
    },
    {
      id: '3',
      timestamp: '2024-01-20 14:25:18',
      user: 'Jane Doe',
      event: 'Settings Update',
      module: 'Organization',
      ipAddress: '192.168.1.100',
      details: 'Updated organization name'
    },
    {
      id: '4',
      timestamp: '2024-01-20 14:20:05',
      user: 'Sarah Johnson',
      event: 'QR Scan',
      module: 'QR Codes',
      ipAddress: '192.168.1.102',
      details: 'Scanned QR code: Borrower Portal Start'
    },
    {
      id: '5',
      timestamp: '2024-01-20 14:15:33',
      user: 'Jane Doe',
      event: 'User Created',
      module: 'Users',
      ipAddress: '192.168.1.100',
      details: 'Created new user: Mike Wilson'
    },
  ]);

  const [filters, setFilters] = useState({
    event: '',
    module: '',
    user: '',
    dateFrom: '',
    dateTo: '',
  });

  const events = ['Login', 'Logout', 'Form Submission', 'Settings Update', 'User Created', 'User Deleted', 'QR Scan', 'MFA Setup'];
  const modules = ['Auth', 'Prep4Loan', 'URLA 1003', 'Organization', 'Users', 'QR Codes', 'Integrations'];

  return (
    <div className="p-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Audit Logs</h1>
            <p className="text-base text-muted-foreground font-light" style={{ color: '#6b7280' }}>
              View and filter all system activity and user actions
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors">
              Real-time Stream
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-light text-foreground mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Event</label>
              <select
                value={filters.event}
                onChange={(e) => setFilters({ ...filters, event: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
              >
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Module</label>
              <select
                value={filters.module}
                onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">User</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                placeholder="Search user..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-gray-700">{log.timestamp}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-foreground">{log.user}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-light">
                        {log.event}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-gray-700">{log.module}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs font-mono text-gray-600">{log.ipAddress}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-light text-gray-700">{log.details}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-light">
            Showing 1-5 of 1,234 logs
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditLogsSettings;

