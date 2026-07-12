import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { StatusCardProps } from '../framework/dashboard.types';
import type { LucideIcon } from 'lucide-react';

const statusConfig: Record<string, { icon: LucideIcon; bgClass: string; borderClass: string; iconClass: string }> = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-success-50',
    borderClass: 'border-success-200',
    iconClass: 'text-success-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-warning-50',
    borderClass: 'border-warning-200',
    iconClass: 'text-warning-500',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-error-50',
    borderClass: 'border-error-200',
    iconClass: 'text-error-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-info-50',
    borderClass: 'border-info-200',
    iconClass: 'text-info-500',
  },
  neutral: {
    icon: Info,
    bgClass: 'bg-neutral-20',
    borderClass: 'border-neutral-30',
    iconClass: 'text-neutral-60',
  },
};

export const StatusCard = ({
  title,
  status,
  description,
  className = '',
}: StatusCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.bgClass} ${config.borderClass} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${config.iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-100">{title}</p>
          {description && (
            <p className="text-sm text-neutral-60 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
