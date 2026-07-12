import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { ProgressPanelProps } from '../framework/dashboard.types';

const statusConfig = {
  idle: { icon: null, color: 'text-neutral-60' },
  running: { icon: Loader2, color: 'text-primary-500' },
  completed: { icon: CheckCircle, color: 'text-success-500' },
  error: { icon: XCircle, color: 'text-error-500' },
};

export const ProgressPanel = ({
  title,
  progress,
  total,
  status = 'idle',
  className = '',
}: ProgressPanelProps) => {
  const config = statusConfig[status];
  const percentage = total ? Math.round((progress / total) * 100) : progress;

  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
        {config.icon && (
          <config.icon
            className={`w-5 h-5 ${config.color} ${status === 'running' ? 'animate-spin' : ''}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-neutral-60">
          {total ? `${progress} of ${total}` : `${percentage}%`}
        </span>
        <span className="font-medium text-neutral-100">{percentage}%</span>
      </div>

      <div className="h-2 bg-neutral-30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            status === 'error'
              ? 'bg-error-500'
              : status === 'completed'
              ? 'bg-success-500'
              : 'bg-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
