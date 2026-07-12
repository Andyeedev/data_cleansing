import { AlertTriangle } from 'lucide-react';
import type { RiskCardProps } from '../framework/dashboard.types';

const levelConfig = {
  low: { bgClass: 'bg-success-50', borderClass: 'border-success-200', textClass: 'text-success-500' },
  medium: { bgClass: 'bg-warning-50', borderClass: 'border-warning-200', textClass: 'text-warning-500' },
  high: { bgClass: 'bg-error-50', borderClass: 'border-error-200', textClass: 'text-error-500' },
  critical: { bgClass: 'bg-error-50', borderClass: 'border-error-200', textClass: 'text-error-700' },
};

export const RiskCard = ({
  title,
  level,
  score,
  icon,
  className = '',
}: RiskCardProps) => {
  const config = levelConfig[level];

  return (
    <div className={`rounded-xl border p-4 ${config.bgClass} ${config.borderClass} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">{score}</p>
          <p className={`text-sm font-semibold mt-1 ${config.textClass}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)} Risk
          </p>
        </div>
        <div className={`p-2 ${config.textClass}`}>
          {icon || <AlertTriangle className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
};
