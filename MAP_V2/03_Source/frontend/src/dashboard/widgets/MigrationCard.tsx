import { Database } from 'lucide-react';
import type { MigrationCardProps } from '../framework/dashboard.types';

export const MigrationCard = ({
  title,
  total,
  completed,
  inProgress,
  pending,
  icon,
  className = '',
}: MigrationCardProps) => {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">{total}</p>
        </div>
        <div className="p-2 bg-primary-50 rounded-lg">
          {icon || <Database className="w-5 h-5 text-primary-500" />}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-60">Completed</span>
          <span className="text-sm font-medium text-success-500">{completed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-60">In Progress</span>
          <span className="text-sm font-medium text-warning-500">{inProgress}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-60">Pending</span>
          <span className="text-sm font-medium text-neutral-60">{pending}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-60">Progress</span>
          <span className="text-sm font-semibold text-neutral-100">{progress}%</span>
        </div>
        <div className="mt-1 h-2 bg-neutral-30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
