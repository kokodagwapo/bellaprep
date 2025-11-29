import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
  status: 'active' | 'revoked';
}

const ApiKeysSettings: React.FC = () => {
  const { showToast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_••••••••••••••••••••••••••••',
      lastUsed: '2 hours ago',
      created: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_test_••••••••••••••••••••••••••••',
      lastUsed: 'Never',
      created: '2024-01-10',
      status: 'active'
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCreateKey = () => {
    if (newKeyName) {
      // TODO: Implement API call
      showToast(`API key "${newKeyName}" created successfully!`, 'success');
      setNewKeyName('');
      setShowCreateModal(false);
    } else {
      showToast('Please enter a key name', 'warning');
    }
  };

  const handleRevoke = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k));
      showToast('API key revoked successfully', 'success');
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
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">API Keys & Webhooks</h1>
            <p className="text-base text-muted-foreground font-light" style={{ color: '#6b7280' }}>
              Manage API keys for programmatic access and configure webhooks
            </p>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
          >
            + Create API Key
          </motion.button>
        </div>

        {/* API Keys Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80">
                {apiKeys.map((key) => (
                  <motion.tr
                    key={key.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-foreground">{key.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {key.key}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-gray-700">{key.lastUsed}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-light text-gray-700">{key.created}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-md font-light ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                      <button className="text-primary hover:text-primary/80 mr-4">Copy</button>
                      {key.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Webhooks Section */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          <h2 className="text-xl font-light text-foreground mb-4">Webhooks</h2>
          <p className="text-sm text-muted-foreground mb-4 font-light">
            Configure webhooks to receive real-time notifications about events in your account.
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-light transition-colors">
            + Add Webhook
          </button>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <h2 className="text-xl font-light text-foreground mb-4">Create API Key</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-light transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleCreateKey}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
                  >
                    Create Key
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

export default ApiKeysSettings;

