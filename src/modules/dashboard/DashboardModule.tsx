import React from 'react';

const DashboardModule: React.FC = () => {
  const stats = [
    { label: 'Active Applications', value: '127', change: '+12', positive: true, icon: '📋' },
    { label: 'Submitted Today', value: '23', change: '+5', positive: true, icon: '✅' },
    { label: 'Pending Documents', value: '45', change: '-8', positive: true, icon: '📄' },
    { label: 'Avg. Processing Time', value: '3.2d', change: '-0.5d', positive: true, icon: '⏱️' },
  ];

  const recentApplications = [
    { id: '12345', borrower: 'John Smith', type: 'Conventional', amount: '$425,000', status: 'In Review', date: '2 hours ago' },
    { id: '12344', borrower: 'Sarah Wilson', type: 'FHA', amount: '$285,000', status: 'Documents Needed', date: '3 hours ago' },
    { id: '12343', borrower: 'Mike Johnson', type: 'VA', amount: '$550,000', status: 'Submitted', date: '5 hours ago' },
    { id: '12342', borrower: 'Emily Davis', type: 'Jumbo', amount: '$1,200,000', status: 'Approved', date: '1 day ago' },
    { id: '12341', borrower: 'Tom Brown', type: 'Conventional', amount: '$375,000', status: 'Closed', date: '2 days ago' },
  ];

  const statusColors: Record<string, string> = {
    'In Review': 'bg-blue-100 text-blue-700',
    'Documents Needed': 'bg-yellow-100 text-yellow-700',
    'Submitted': 'bg-purple-100 text-purple-700',
    'Approved': 'bg-green-100 text-green-700',
    'Closed': 'bg-gray-100 text-gray-700',
  };

  const quickActions = [
    { label: 'New Application', icon: '➕', color: 'bg-blue-500' },
    { label: 'Send QR Code', icon: '📱', color: 'bg-purple-500' },
    { label: 'Schedule Call', icon: '📞', color: 'bg-green-500' },
    { label: 'Run Reports', icon: '📊', color: 'bg-orange-500' },
  ];

  const teamActivity = [
    { user: 'Jane Doe', action: 'Approved loan #12340', time: '10 min ago', avatar: 'JD' },
    { user: 'Mike Smith', action: 'Uploaded documents for #12339', time: '25 min ago', avatar: 'MS' },
    { user: 'Sarah Lee', action: 'Started new application', time: '1 hour ago', avatar: 'SL' },
    { user: 'Tom Wilson', action: 'Completed verification for #12338', time: '2 hours ago', avatar: 'TW' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium text-gray-900">Recent Applications</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentApplications.map(app => (
              <div key={app.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{app.borrower}</span>
                      <span className="text-sm text-gray-500">#{app.id}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{app.type}</span>
                      <span>•</span>
                      <span>{app.amount}</span>
                      <span>•</span>
                      <span>{app.date}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[app.status]}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(action => (
                <button key={action.label} className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-center transition-colors">
                  <span className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                    {action.icon}
                  </span>
                  <span className="text-xs text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="font-medium text-gray-900 mb-4">Team Activity</h2>
            <div className="space-y-3">
              {teamActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {activity.avatar}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-medium text-gray-900 mb-4">Pipeline Overview</h2>
          <div className="space-y-4">
            {[
              { stage: 'Pre-Qualification', count: 45, color: 'bg-blue-500' },
              { stage: 'Application', count: 32, color: 'bg-purple-500' },
              { stage: 'Processing', count: 28, color: 'bg-yellow-500' },
              { stage: 'Underwriting', count: 15, color: 'bg-orange-500' },
              { stage: 'Closing', count: 7, color: 'bg-green-500' },
            ].map(item => (
              <div key={item.stage} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{item.stage}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`}
                    style={{ width: `${(item.count / 45) * 100}%` }}>
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bella Insights */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-medium">Bella Insights</h2>
              <p className="text-sm opacity-80">AI-powered recommendations</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-sm">📈 Application volume is up 15% this week. Consider adding more processing capacity.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-sm">⚠️ 3 applications have been in "Documents Needed" status for over 5 days.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-sm">🎯 FHA loans are converting 23% better than average. Focus marketing efforts here.</p>
            </div>
          </div>
          <button className="mt-4 w-full py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors">
            Ask Bella for More Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
