import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'lo' | 'processor' | 'underwriter' | 'closer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  mfaEnabled: boolean;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@lender.com', role: 'admin', status: 'active', lastLogin: '2 hours ago', mfaEnabled: true },
  { id: '2', name: 'Jane Doe', email: 'jane.doe@lender.com', role: 'lo', status: 'active', lastLogin: '1 day ago', mfaEnabled: true },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@lender.com', role: 'processor', status: 'active', lastLogin: '3 hours ago', mfaEnabled: false },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.w@lender.com', role: 'underwriter', status: 'active', lastLogin: '5 hours ago', mfaEnabled: true },
  { id: '5', name: 'Tom Brown', email: 'tom.b@lender.com', role: 'closer', status: 'inactive', lastLogin: '1 week ago', mfaEnabled: false },
  { id: '6', name: 'New User', email: 'new@lender.com', role: 'lo', status: 'pending', lastLogin: 'Never', mfaEnabled: false },
];

const UserManagementModule: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'lo' as User['role'] });

  const roleLabels: Record<string, string> = { superadmin: 'Super Admin', admin: 'Lender Admin', lo: 'Loan Officer', processor: 'Processor', underwriter: 'Underwriter', closer: 'Closer' };
  const roleColors: Record<string, string> = { superadmin: 'bg-purple-100 text-purple-700', admin: 'bg-blue-100 text-blue-700', lo: 'bg-green-100 text-green-700', processor: 'bg-yellow-100 text-yellow-700', underwriter: 'bg-orange-100 text-orange-700', closer: 'bg-pink-100 text-pink-700' };
  const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-700', pending: 'bg-yellow-100 text-yellow-700' };

  const inviteUser = () => {
    const user: User = { id: Date.now().toString(), ...newUser, status: 'pending', lastLogin: 'Never', mfaEnabled: false };
    setUsers([...users, user]);
    setShowInviteModal(false);
    setNewUser({ name: '', email: '', role: 'lo' });
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-500">Manage team members and their permissions.</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Invite User</button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-semibold text-green-600">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">MFA Enabled</p>
          <p className="text-2xl font-semibold text-blue-600">{users.filter(u => u.mfaEnabled).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <input type="text" placeholder="Search users..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="divide-y divide-gray-100">
              {users.map(user => (
                <div key={user.id} className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedUser(user)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusColors[user.status]}`}>{user.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-xl mx-auto">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="font-semibold text-gray-900 mt-2">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Role</span><span className={`px-2 py-0.5 rounded text-xs ${roleColors[selectedUser.role]}`}>{roleLabels[selectedUser.role]}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 rounded text-xs ${statusColors[selectedUser.status]}`}>{selectedUser.status}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last Login</span><span className="font-medium">{selectedUser.lastLogin}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">MFA</span><span className={selectedUser.mfaEnabled ? 'text-green-600' : 'text-red-600'}>{selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Edit User</button>
                <button onClick={() => toggleStatus(selectedUser.id)} className={`w-full py-2 rounded-lg text-sm ${selectedUser.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Reset Password</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="lo">Loan Officer</option>
                  <option value="processor">Processor</option>
                  <option value="underwriter">Underwriter</option>
                  <option value="closer">Closer</option>
                  <option value="admin">Lender Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                <button onClick={inviteUser} disabled={!newUser.name || !newUser.email} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementModule;
