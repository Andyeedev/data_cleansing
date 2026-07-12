import type { SummaryCardProps } from '../framework/dashboard.types';

const variantStyles = {
  positive: 'border-success-200 bg-success-50',
  negative: 'border-error-200 bg-error-50',
  neutral: 'border-neutral-30 bg-white',
  warning: 'border-warning-200 bg-warning-50',
  critical: 'border-error-200 bg-error-50',
};

export const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'neutral',
  className = '',
}: SummaryCardProps) => {
  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-white rounded-lg border border-neutral-30">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-xl font-bold text-neutral-100">{value}</p>
          {subtitle && <p className="text-xs text-neutral-60 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};
