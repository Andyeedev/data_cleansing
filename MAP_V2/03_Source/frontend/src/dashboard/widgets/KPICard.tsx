import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPICardProps } from '../framework/dashboard.types';

const variantStyles = {
  positive: 'border-success-200 bg-success-50',
  negative: 'border-error-200 bg-error-50',
  neutral: 'border-neutral-30 bg-white',
  warning: 'border-warning-200 bg-warning-50',
  critical: 'border-error-200 bg-error-50',
};

const deltaColors = {
  up: 'text-success-500',
  down: 'text-error-500',
  neutral: 'text-neutral-60',
};

export const KPICard = ({
  title,
  value,
  delta,
  trend,
  variant = 'neutral',
  icon,
  footer,
  className = '',
}: KPICardProps) => {
  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-2xl font-bold text-neutral-100 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="p-2 bg-white rounded-lg border border-neutral-30">
            {icon}
          </div>
        )}
      </div>

      {(delta || trend) && (
        <div className="flex items-center gap-4 mt-3">
          {delta && (
            <div className={`flex items-center gap-1 ${deltaColors[delta.direction]}`}>
              {delta.direction === 'up' && <TrendingUp className="w-4 h-4" />}
              {delta.direction === 'down' && <TrendingDown className="w-4 h-4" />}
              {delta.direction === 'neutral' && <Minus className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {delta.percentage ? `${delta.value}%` : delta.value}
              </span>
            </div>
          )}

          {trend && (
            <div className="flex items-center gap-1">
              <div className="flex items-end gap-0.5 h-4">
                {trend.value.slice(-7).map((point, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${
                      trend.direction === 'up'
                        ? 'bg-success-500'
                        : trend.direction === 'down'
                        ? 'bg-error-500'
                        : 'bg-neutral-40'
                    }`}
                    style={{ height: `${Math.max(20, (point / Math.max(...trend.value)) * 100)}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {footer && <div className="mt-3 pt-3 border-t border-neutral-30">{footer}</div>}
    </div>
  );
};
