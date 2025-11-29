import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Clock,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </motion.div>
  );
};

interface RecentLoan {
  id: string;
  borrower: string;
  amount: number;
  product: string;
  status: string;
  date: string;
}

interface DashboardPageProps {
  stats?: {
    totalLoans: number;
    totalValue: number;
    avgProcessingTime: number;
    activeUsers: number;
  };
  recentLoans?: RecentLoan[];
  pipelineData?: Array<{ status: string; count: number; value: number }>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats = {
    totalLoans: 156,
    totalValue: 45200000,
    avgProcessingTime: 18,
    activeUsers: 24,
  },
  recentLoans = [
    { id: '1', borrower: 'John Smith', amount: 450000, product: 'Conventional', status: 'Processing', date: '2 hours ago' },
    { id: '2', borrower: 'Sarah Johnson', amount: 320000, product: 'FHA', status: 'Underwriting', date: '4 hours ago' },
    { id: '3', borrower: 'Mike Wilson', amount: 580000, product: 'Jumbo', status: 'Submitted', date: '6 hours ago' },
    { id: '4', borrower: 'Emily Davis', amount: 275000, product: 'VA', status: 'Approved', date: '1 day ago' },
  ],
  pipelineData = [
    { status: 'Draft', count: 12, value: 3500000 },
    { status: 'Submitted', count: 28, value: 8200000 },
    { status: 'Processing', count: 34, value: 10500000 },
    { status: 'Underwriting', count: 18, value: 5800000 },
    { status: 'Approved', count: 42, value: 12400000 },
    { status: 'Closed', count: 22, value: 4800000 },
  ],
}) => {
  const statusColors: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Submitted: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Underwriting: 'bg-purple-100 text-purple-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Closed: 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" />
          New Loan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Loans"
          value={stats.totalLoans}
          change={12}
          changeLabel="vs last month"
          icon={<FileText className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Total Value"
          value={`$${(stats.totalValue / 1000000).toFixed(1)}M`}
          change={8}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Avg. Processing"
          value={`${stats.avgProcessingTime} days`}
          change={-5}
          changeLabel="improvement"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change={3}
          changeLabel="this week"
          icon={<Users className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Pipeline and Recent Loans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {pipelineData.map((item, index) => {
              const maxCount = Math.max(...pipelineData.map(d => d.count));
              const percentage = (item.count / maxCount) * 100;

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.status}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{item.count} loans</span>
                      <span className="text-gray-900 font-medium">
                        ${(item.value / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            {recentLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                    {loan.borrower.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{loan.borrower}</p>
                    <p className="text-xs text-gray-500">
                      ${loan.amount.toLocaleString()} • {loan.product}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusColors[loan.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {loan.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{loan.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

