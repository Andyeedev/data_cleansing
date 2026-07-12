import { CheckCircle, XCircle } from 'lucide-react';
import type { ValidationCardProps } from '../framework/dashboard.types';

export const ValidationCard = ({
  title,
  total,
  passed,
  failed,
  icon,
  className = '',
}: ValidationCardProps) => {
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">{total}</p>
        </div>
        {icon && (
          <div className="p-2 bg-neutral-20 rounded-lg">{icon}</div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-500" />
            <span className="text-sm text-neutral-60">Passed</span>
          </div>
          <span className="text-sm font-medium text-success-500">{passed}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-error-500" />
            <span className="text-sm text-neutral-60">Failed</span>
          </div>
          <span className="text-sm font-medium text-error-500">{failed}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-30">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-60">Pass Rate</span>
          <span className="text-sm font-semibold text-neutral-100">{passRate}%</span>
        </div>
        <div className="mt-1 h-2 bg-neutral-30 rounded-full overflow-hidden">
          <div
            className="h-full bg-success-500 rounded-full"
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
