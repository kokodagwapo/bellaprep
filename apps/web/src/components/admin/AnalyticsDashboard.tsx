import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  sparkline?: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color,
  sparkline,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              {changeLabel && <span className="text-sm text-gray-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50`}>
          <div className={`text-${color}-600`}>{icon}</div>
        </div>
      </div>
      
      {sparkline && (
        <div className="mt-4 flex items-end gap-1 h-12">
          {sparkline.map((value, i) => (
            <div
              key={i}
              className={`flex-1 bg-${color}-200 rounded-t`}
              style={{ height: `${(value / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const pipelineData: ChartData[] = [
    { label: 'Draft', value: 12, color: 'gray' },
    { label: 'Submitted', value: 28, color: 'blue' },
    { label: 'Processing', value: 34, color: 'yellow' },
    { label: 'Underwriting', value: 18, color: 'purple' },
    { label: 'Approved', value: 42, color: 'emerald' },
    { label: 'Closed', value: 22, color: 'teal' },
  ];

  const productData: ChartData[] = [
    { label: 'Conventional', value: 45, color: 'blue' },
    { label: 'FHA', value: 28, color: 'emerald' },
    { label: 'VA', value: 15, color: 'purple' },
    { label: 'Jumbo', value: 8, color: 'orange' },
    { label: 'Other', value: 4, color: 'gray' },
  ];

  const loPerformance = [
    { name: 'Sarah Johnson', loans: 45, value: 12500000, rate: 92 },
    { name: 'Mike Wilson', loans: 38, value: 9800000, rate: 88 },
    { name: 'Emily Davis', loans: 32, value: 8200000, rate: 95 },
    { name: 'John Smith', loans: 28, value: 7100000, rate: 85 },
    { name: 'Lisa Brown', loans: 24, value: 6400000, rate: 90 },
  ];

  const trendData = [
    { month: 'Jan', loans: 45, value: 12 },
    { month: 'Feb', loans: 52, value: 14 },
    { month: 'Mar', loans: 48, value: 13 },
    { month: 'Apr', loans: 61, value: 16 },
    { month: 'May', loans: 55, value: 15 },
    { month: 'Jun', loans: 67, value: 18 },
    { month: 'Jul', loans: 72, value: 19 },
    { month: 'Aug', loans: 69, value: 18 },
    { month: 'Sep', loans: 78, value: 21 },
    { month: 'Oct', loans: 82, value: 22 },
    { month: 'Nov', loans: 88, value: 24 },
    { month: 'Dec', loans: 94, value: 26 },
  ];

  const maxLoans = Math.max(...trendData.map(d => d.loans));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights into your loan operations</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Loans"
          value="156"
          change={12}
          changeLabel="vs last period"
          icon={<FileText className="w-5 h-5" />}
          color="emerald"
          sparkline={[12, 19, 15, 22, 18, 25, 28, 24, 32, 35, 38, 42]}
        />
        <MetricCard
          title="Loan Volume"
          value="$45.2M"
          change={8.5}
          changeLabel="vs last period"
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          sparkline={[8, 12, 10, 15, 14, 18, 20, 19, 24, 26, 28, 32]}
        />
        <MetricCard
          title="Avg. Processing"
          value="18 days"
          change={-12}
          changeLabel="improvement"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Approval Rate"
          value="87%"
          change={3}
          changeLabel="vs last period"
          icon={<TrendingUp className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Loan Trend</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-500">Loans</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2">
            {trendData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.loans / maxLoans) * 100}%` }}
                  transition={{ delay: i * 0.05 }}
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md"
                />
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pipeline Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Distribution</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {pipelineData.map((item, i) => {
              const total = pipelineData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{item.value} loans</span>
                      <span className="text-gray-900 font-medium">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`h-full bg-${item.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* LO Performance & Product Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LO Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Loan Officers</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {loPerformance.map((lo, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                  {lo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{lo.name}</span>
                    <span className="text-sm text-gray-500">{lo.loans} loans</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${lo.rate}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{lo.rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Mix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Product Mix</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {productData.map((product, i) => {
              const total = productData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((product.value / total) * 100).toFixed(0);
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl bg-${product.color}-50 border border-${product.color}-100`}
                >
                  <p className={`text-${product.color}-600 text-sm font-medium`}>{product.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{percentage}%</p>
                  <p className="text-sm text-gray-500 mt-1">{product.value} loans</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Conversion Funnel</h2>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          {[
            { label: 'Started', value: 1000, rate: 100 },
            { label: 'Submitted', value: 680, rate: 68 },
            { label: 'Processing', value: 520, rate: 52 },
            { label: 'Approved', value: 420, rate: 42 },
            { label: 'Closed', value: 380, rate: 38 },
          ].map((stage, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex-1 text-center">
                <div
                  className="mx-auto mb-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"
                  style={{
                    width: `${60 + stage.rate * 0.4}px`,
                    height: `${60 + stage.rate * 0.4}px`,
                  }}
                >
                  <span className="text-lg font-bold text-emerald-600">{stage.rate}%</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{stage.label}</p>
                <p className="text-xs text-gray-400 mt-1">{stage.value}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="text-gray-300">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;

