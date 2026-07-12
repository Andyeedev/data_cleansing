import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  running: { icon: Loader2, color: 'text-primary-600', bg: 'bg-primary-50' },
  pending: { icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
  failed: { icon: XCircle, color: 'text-error-600', bg: 'bg-error-50' },
  completed: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
};

export const ReportQueue = () => {
  const { queue } = useReportCentre();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Queue</h1>
        <p className="text-neutral-60">Reports currently being generated or queued</p>
      </div>
      <div className="space-y-3">
        {queue.map((item) => {
          const config = statusConfig[item.status] ?? statusConfig.pending;
          const Icon = config.icon;
          return (
            <div key={item.id} className={`${config.bg} border rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${config.color} ${item.status === 'running' ? 'animate-spin' : ''}`} />
                  <div>
                    <h3 className="font-medium text-neutral-100">{item.reportName}</h3>
                    <p className="text-sm text-neutral-60">
                      {item.status === 'running' && `Started at ${item.startedAt}`}
                      {item.status === 'pending' && `Queued at ${item.startedAt}`}
                      {item.status === 'failed' && item.error}
                      {item.status === 'completed' && `Completed at ${item.completedAt}`}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color} bg-white`}>
                  {item.status}
                </span>
              </div>
              {item.status === 'running' && item.progress !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-50 mt-1">{item.progress}% complete</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
