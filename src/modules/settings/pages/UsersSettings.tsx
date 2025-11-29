import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UsersSettings: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', role: 'Tenant Admin', status: 'active' },
    { id: '2', name: 'John Smith', email: 'john@example.com', role: 'Loan Officer', status: 'active' },
    { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Processor', status: 'active' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Loan Officer');

  const roles = ['Super Admin', 'Tenant Admin', 'Loan Officer', 'Processor', 'Underwriter', 'Closer'];

  const handleInvite = () => {
    if (inviteEmail) {
      // TODO: Implement API call
      showToast(`Invitation sent to ${inviteEmail}`, 'success');
      setInviteEmail('');
      setShowInviteModal(false);
    } else {
      showToast('Please enter an email address', 'warning');
    }
  };

  return (
    <div className="p-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Users & Roles</h1>
            <p className="text-base text-muted-foreground font-light" style={{ color: '#6b7280' }}>
              Manage team members and their permissions
            </p>
          </div>
          <motion.button
            onClick={() => setShowInviteModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
          >
            Invite User
          </motion.button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold mr-3">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-light text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-gray-700">{user.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md font-light">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-md font-light ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                      <button className="text-primary hover:text-primary/80 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Remove</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roles Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Available Roles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {roles.map((role) => (
              <div key={role} className="text-xs text-blue-800 font-light">
                • {role}
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInviteModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <h2 className="text-xl font-light text-foreground mb-4">Invite User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-light transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleInvite}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
                  >
                    Send Invitation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UsersSettings;

