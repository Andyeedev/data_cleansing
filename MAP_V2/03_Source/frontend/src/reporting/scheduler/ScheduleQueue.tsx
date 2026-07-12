import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';
import type { QueueStatus } from './types/SchedulerTypes';

const statusTabs: { id: QueueStatus | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Clock className="w-4 h-4" /> },
  { id: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
  { id: 'running', label: 'Running', icon: <Loader2 className="w-4 h-4" /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'failed', label: 'Failed', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
];

export const ScheduleQueue = () => {
  const { queue } = useReportScheduler();
  const [activeTab, setActiveTab] = useState<QueueStatus | 'all'>('all');

  const filteredQueue = activeTab === 'all'
    ? queue
    : queue.filter((q) => q.status === activeTab);

  const getStatusColor = (status: QueueStatus) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'completed': return 'bg-success-100 text-success-700';
      case 'failed': return 'bg-danger-100 text-danger-700';
      case 'cancelled': return 'bg-neutral-200 text-neutral-60';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Queue Manager</h1>
        <p className="text-neutral-60">Manage pending, running and completed report jobs</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-10 text-neutral-70 hover:bg-neutral-20'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Started At</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Progress</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Error</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-50">
                  No items in queue
                </td>
              </tr>
            ) : (
              filteredQueue.map((item) => (
                <tr key={item.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                  <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{item.reportName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{item.startedAt || '-'}</td>
                  <td className="px-4 py-3">
                    {item.progress !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-neutral-20 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-xs text-neutral-60">{item.progress}%</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-danger-600">{item.error || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
