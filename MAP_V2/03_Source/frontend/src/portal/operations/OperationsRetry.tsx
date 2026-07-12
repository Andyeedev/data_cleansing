import { RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useOperationsDashboard } from '../hooks/useOperationsDashboard';

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  queued: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
  running: { icon: RefreshCw, color: 'text-primary-600', bg: 'bg-primary-50' },
  completed: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
  failed: { icon: XCircle, color: 'text-error-600', bg: 'bg-error-50' },
};

export const OperationsRetry = () => {
  const { metrics } = useOperationsDashboard();

  const retryItems = [
    { id: 'r1', name: 'Customer Batch 17', status: 'queued', priority: 'high', error: 'Validation timeout', attempts: 2, maxAttempts: 3, createdAt: '30 min ago' },
    { id: 'r2', name: 'Transaction Batch 12', status: 'queued', priority: 'medium', error: 'Connection reset', attempts: 1, maxAttempts: 3, createdAt: '45 min ago' },
    { id: 'r3', name: 'Account Batch 5', status: 'running', priority: 'high', error: 'Schema mismatch', attempts: 3, maxAttempts: 5, createdAt: '1 hour ago' },
    { id: 'r4', name: 'Product Batch 8', status: 'completed', priority: 'low', error: 'Network timeout', attempts: 2, maxAttempts: 3, createdAt: '2 hours ago' },
    { id: 'r5', name: 'Order Batch 3', status: 'failed', priority: 'critical', error: 'Data corruption detected', attempts: 3, maxAttempts: 3, createdAt: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Retry Centre</h1>
        <p className="text-neutral-60">Manage and monitor retry queues for failed operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <p className="text-sm text-neutral-60">Retry Queue</p>
          <p className="text-2xl font-bold text-neutral-100">{metrics.retryQueue}</p>
        </div>
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <p className="text-sm text-neutral-60">Retry Success</p>
          <p className="text-2xl font-bold text-success-600">{metrics.retrySuccess}</p>
        </div>
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <p className="text-sm text-neutral-60">Retry Failure</p>
          <p className="text-2xl font-bold text-error-600">{metrics.retryFailure}</p>
        </div>
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <p className="text-sm text-neutral-60">Retry Controls</p>
          <p className="text-2xl font-bold text-neutral-100">{metrics.retryControls}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Priority</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Error</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Attempts</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Created</th>
            </tr>
          </thead>
          <tbody>
            {retryItems.map((item) => {
              const config = statusConfig[item.status] ?? statusConfig.queued;
              const Icon = config.icon;
              return (
                <tr key={item.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                  <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                      <Icon className={`w-3 h-3 ${item.status === 'running' ? 'animate-spin' : ''}`} />
                      {item.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{item.priority}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{item.error}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{item.attempts}/{item.maxAttempts}</td>
                  <td className="px-4 py-3 text-sm text-neutral-50">{item.createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
