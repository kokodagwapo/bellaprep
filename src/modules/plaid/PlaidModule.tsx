import React, { useState } from 'react';

interface PlaidAccount {
  id: string;
  name: string;
  institution: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  lastSync: string;
  status: 'connected' | 'needs_reauth' | 'error';
}

const mockAccounts: PlaidAccount[] = [
  { id: '1', name: 'Primary Checking', institution: 'Chase Bank', type: 'checking', balance: 15234.56, lastSync: '2 hours ago', status: 'connected' },
  { id: '2', name: 'Savings Account', institution: 'Chase Bank', type: 'savings', balance: 45678.90, lastSync: '2 hours ago', status: 'connected' },
  { id: '3', name: 'Investment Portfolio', institution: 'Fidelity', type: 'investment', balance: 125000.00, lastSync: '1 day ago', status: 'needs_reauth' },
  { id: '4', name: 'Credit Card', institution: 'American Express', type: 'credit', balance: -2345.67, lastSync: '3 hours ago', status: 'connected' },
];

const PlaidModule: React.FC = () => {
  const [accounts, setAccounts] = useState<PlaidAccount[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<PlaidAccount | null>(null);

  const typeIcons: Record<string, string> = { checking: '🏦', savings: '💰', investment: '📈', credit: '💳' };
  const statusColors: Record<string, string> = { connected: 'bg-green-100 text-green-700', needs_reauth: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700' };

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Plaid Integration</h1>
          <p className="mt-1 text-gray-500">Manage connected bank accounts and financial data.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Connect Account</button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Connected Accounts</p>
          <p className="text-2xl font-semibold text-gray-900">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Assets</p>
          <p className="text-2xl font-semibold text-green-600">${totalAssets.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Liabilities</p>
          <p className="text-2xl font-semibold text-red-600">${totalLiabilities.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Net Worth</p>
          <p className="text-2xl font-semibold text-gray-900">${(totalAssets - totalLiabilities).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Connected Accounts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">Sync All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {accounts.map(account => (
                <div key={account.id} className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedAccount?.id === account.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedAccount(account)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{typeIcons[account.type]}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500">{account.institution}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${account.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        ${Math.abs(account.balance).toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColors[account.status]}`}>{account.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedAccount ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center mb-4">
                <span className="text-4xl">{typeIcons[selectedAccount.type]}</span>
                <h2 className="font-semibold text-gray-900 mt-2">{selectedAccount.name}</h2>
                <p className="text-sm text-gray-500">{selectedAccount.institution}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Balance</span><span className="font-medium">${Math.abs(selectedAccount.balance).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium capitalize">{selectedAccount.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Last Sync</span><span className="font-medium">{selectedAccount.lastSync}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 rounded text-xs ${statusColors[selectedAccount.status]}`}>{selectedAccount.status.replace('_', ' ')}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Sync Now</button>
                {selectedAccount.status === 'needs_reauth' && (
                  <button className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">Re-authenticate</button>
                )}
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">View Transactions</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select an account to view details</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Income Verification</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Monthly Income (Avg)</p>
            <p className="text-2xl font-semibold text-gray-900">$8,450</p>
            <p className="text-xs text-green-600 mt-1">Verified via Plaid</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Employment Status</p>
            <p className="text-2xl font-semibold text-gray-900">Active</p>
            <p className="text-xs text-gray-500 mt-1">Direct deposits detected</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Income Stability</p>
            <p className="text-2xl font-semibold text-green-600">High</p>
            <p className="text-xs text-gray-500 mt-1">24 months consistent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidModule;
