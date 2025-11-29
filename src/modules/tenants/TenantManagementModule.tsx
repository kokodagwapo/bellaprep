import React, { useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  users: number;
  applications: number;
  createdAt: string;
  logo?: string;
}

const mockTenants: Tenant[] = [
  { id: '1', name: 'TerraVerde Mortgage', subdomain: 'teraverde', plan: 'enterprise', status: 'active', users: 25, applications: 1247, createdAt: '2023-06-15' },
  { id: '2', name: 'Summit Home Loans', subdomain: 'summit', plan: 'professional', status: 'active', users: 12, applications: 534, createdAt: '2023-08-20' },
  { id: '3', name: 'Pacific Coast Lending', subdomain: 'pacific', plan: 'professional', status: 'active', users: 8, applications: 289, createdAt: '2023-10-01' },
  { id: '4', name: 'First Choice Mortgage', subdomain: 'firstchoice', plan: 'starter', status: 'trial', users: 3, applications: 45, createdAt: '2024-01-10' },
  { id: '5', name: 'Legacy Home Finance', subdomain: 'legacy', plan: 'starter', status: 'suspended', users: 5, applications: 112, createdAt: '2023-11-15' },
];

const TenantManagementModule: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', subdomain: '', plan: 'starter' as Tenant['plan'] });

  const planColors: Record<string, string> = { starter: 'bg-gray-100 text-gray-700', professional: 'bg-blue-100 text-blue-700', enterprise: 'bg-purple-100 text-purple-700' };
  const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', suspended: 'bg-red-100 text-red-700', trial: 'bg-yellow-100 text-yellow-700' };

  const createTenant = () => {
    const tenant: Tenant = {
      id: Date.now().toString(),
      ...newTenant,
      status: 'trial',
      users: 1,
      applications: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTenants([...tenants, tenant]);
    setShowCreateModal(false);
    setNewTenant({ name: '', subdomain: '', plan: 'starter' });
  };

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t));
  };

  const totalUsers = tenants.reduce((sum, t) => sum + t.users, 0);
  const totalApplications = tenants.reduce((sum, t) => sum + t.applications, 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tenant Management</h1>
          <p className="mt-1 text-gray-500">Manage lender organizations and their subscriptions.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Tenant</button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-2xl font-semibold text-gray-900">{tenants.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-semibold text-green-600">{tenants.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-semibold text-purple-600">{totalApplications.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <input type="text" placeholder="Search tenants..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="divide-y divide-gray-100">
              {tenants.map(tenant => (
                <div key={tenant.id} className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedTenant?.id === tenant.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedTenant(tenant)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-500">{tenant.subdomain}.bellaprep.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${planColors[tenant.plan]}`}>{tenant.plan}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusColors[tenant.status]}`}>{tenant.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedTenant ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {selectedTenant.name.charAt(0)}
                </div>
                <h2 className="font-semibold text-gray-900 mt-2">{selectedTenant.name}</h2>
                <p className="text-sm text-gray-500">{selectedTenant.subdomain}.bellaprep.com</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className={`px-2 py-0.5 rounded text-xs ${planColors[selectedTenant.plan]}`}>{selectedTenant.plan}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 rounded text-xs ${statusColors[selectedTenant.status]}`}>{selectedTenant.status}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Users</span><span className="font-medium">{selectedTenant.users}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Applications</span><span className="font-medium">{selectedTenant.applications.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{selectedTenant.createdAt}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Edit Tenant</button>
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">View Dashboard</button>
                <button onClick={() => toggleStatus(selectedTenant.id)}
                  className={`w-full py-2 rounded-lg text-sm ${selectedTenant.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedTenant.status === 'active' ? 'Suspend Tenant' : 'Activate Tenant'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select a tenant to view details</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Tenant</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input type="text" value={newTenant.name} onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                <div className="flex items-center">
                  <input type="text" value={newTenant.subdomain} onChange={(e) => setNewTenant({ ...newTenant, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg" />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-500">.bellaprep.com</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select value={newTenant.plan} onChange={(e) => setNewTenant({ ...newTenant, plan: e.target.value as Tenant['plan'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="starter">Starter - $99/mo</option>
                  <option value="professional">Professional - $299/mo</option>
                  <option value="enterprise">Enterprise - Custom</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                <button onClick={createTenant} disabled={!newTenant.name || !newTenant.subdomain} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Create Tenant</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagementModule;
