import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { PipelineMetrics, FunnelAnalytics } from '../../../lib/api/types';

const Dashboard: React.FC = () => {
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [funnel, setFunnel] = useState<FunnelAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pipelineData, funnelData] = await Promise.all([
          apiClient.get<PipelineMetrics>('/analytics/pipeline'),
          apiClient.get<FunnelAnalytics>('/analytics/funnel'),
        ]);
        setPipeline(pipelineData);
        setFunnel(funnelData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {pipeline && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pipeline Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Borrowers</p>
              <p className="text-2xl font-bold">{pipeline.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">By Status</p>
              <div className="space-y-1">
                {Object.entries(pipeline.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span>{status}:</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {funnel && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Borrower Funnel</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Started:</span>
              <span className="font-semibold">{funnel.started}</span>
            </div>
            <div className="flex justify-between">
              <span>Submitted:</span>
              <span className="font-semibold">{funnel.submitted}</span>
            </div>
            <div className="flex justify-between">
              <span>In Review:</span>
              <span className="font-semibold">{funnel.inReview}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved:</span>
              <span className="font-semibold">{funnel.approved}</span>
            </div>
            <div className="flex justify-between">
              <span>Closed:</span>
              <span className="font-semibold">{funnel.closed}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

