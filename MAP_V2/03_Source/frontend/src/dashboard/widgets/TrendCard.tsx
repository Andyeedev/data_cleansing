import type { TrendCardProps } from '../framework/dashboard.types';

const variantStyles = {
  positive: 'border-success-200 bg-success-50',
  negative: 'border-error-200 bg-error-50',
  neutral: 'border-neutral-30 bg-white',
  warning: 'border-warning-200 bg-warning-50',
  critical: 'border-error-200 bg-error-50',
};

export const TrendCard = ({
  title,
  value,
  trend,
  period = '7 days',
  variant = 'neutral',
  className = '',
}: TrendCardProps) => {
  const maxVal = Math.max(...trend);
  const minVal = Math.min(...trend);
  const range = maxVal - minVal || 1;

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]} ${className}`}>
      <p className="text-sm font-medium text-neutral-60">{title}</p>
      <p className="text-2xl font-bold text-neutral-100 mt-1">{value}</p>

      <div className="mt-3">
        <div className="flex items-end gap-0.5 h-12">
          {trend.map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-500 rounded-t"
              style={{ height: `${((point - minVal) / range) * 100}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-60 mt-2">Last {period}</p>
      </div>
    </div>
  );
};
