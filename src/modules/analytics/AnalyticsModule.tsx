import React, { useState } from 'react';

const AnalyticsModule: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');

  const stats = [
    { label: 'Total Applications', value: '1,247', change: '+12%', positive: true },
    { label: 'Conversion Rate', value: '34.2%', change: '+5.3%', positive: true },
    { label: 'Avg. Time to Submit', value: '4.2 days', change: '-18%', positive: true },
    { label: 'Doc Completion', value: '78%', change: '+8%', positive: true },
  ];

  const productData = [
    { name: 'Conventional', applications: 456, percentage: 37 },
    { name: 'FHA', applications: 312, percentage: 25 },
    { name: 'VA', applications: 234, percentage: 19 },
    { name: 'Jumbo', applications: 145, percentage: 12 },
    { name: 'Other', applications: 100, percentage: 7 },
  ];

  const loPerformance = [
    { name: 'John Smith', applications: 89, conversion: '42%', avgTime: '3.1 days' },
    { name: 'Jane Doe', applications: 76, conversion: '38%', avgTime: '3.8 days' },
    { name: 'Mike Johnson', applications: 65, conversion: '35%', avgTime: '4.2 days' },
    { name: 'Sarah Wilson', applications: 54, conversion: '31%', avgTime: '4.5 days' },
  ];

  const funnelData = [
    { stage: 'Started', count: 2500, percentage: 100 },
    { stage: 'Personal Info', count: 2100, percentage: 84 },
    { stage: 'Property Details', count: 1800, percentage: 72 },
    { stage: 'Income & Assets', count: 1500, percentage: 60 },
    { stage: 'Documents', count: 1100, percentage: 44 },
    { stage: 'Submitted', count: 850, percentage: 34 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-500">Track performance metrics and borrower insights.</p>
        </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Applications by Product</h2>
          <div className="space-y-4">
            {productData.map(product => (
              <div key={product.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-gray-500">{product.applications} ({product.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: product.percentage + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Borrower Funnel</h2>
          <div className="space-y-3">
            {funnelData.map((stage, i) => (
              <div key={stage.stage} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-700">{stage.stage}</div>
                <div className="flex-1 h-8 bg-gray-100 rounded relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded flex items-center justify-end pr-2"
                    style={{ width: stage.percentage + '%' }}>
                    <span className="text-xs text-white font-medium">{stage.count}</span>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-500 text-right">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Officer Performance</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Loan Officer</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Applications</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Conversion</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Avg. Time</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Trend</th>
            </tr>
          </thead>
          <tbody>
            {loPerformance.map(lo => (
              <tr key={lo.name} className="border-b border-gray-100">
                <td className="py-3 text-sm text-gray-900">{lo.name}</td>
                <td className="py-3 text-sm text-gray-700">{lo.applications}</td>
                <td className="py-3 text-sm text-gray-700">{lo.conversion}</td>
                <td className="py-3 text-sm text-gray-700">{lo.avgTime}</td>
                <td className="py-3"><span className="text-green-500">↑</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-2">Bella Usage</h3>
          <p className="text-3xl font-semibold text-gray-900">3,421</p>
          <p className="text-sm text-gray-500">conversations this month</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div><span className="text-gray-500">Voice:</span> <span className="font-medium">1,234</span></div>
            <div><span className="text-gray-500">Chat:</span> <span className="font-medium">2,187</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-2">QR Scans</h3>
          <p className="text-3xl font-semibold text-gray-900">892</p>
          <p className="text-sm text-gray-500">total scans this month</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div><span className="text-gray-500">Login:</span> <span className="font-medium">456</span></div>
            <div><span className="text-gray-500">Docs:</span> <span className="font-medium">436</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-2">Plaid Connections</h3>
          <p className="text-3xl font-semibold text-gray-900">567</p>
          <p className="text-sm text-gray-500">bank accounts linked</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div><span className="text-gray-500">New:</span> <span className="font-medium">89</span></div>
            <div><span className="text-gray-500">Active:</span> <span className="font-medium">478</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;
