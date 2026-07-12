import { Info } from 'lucide-react';
import type { InformationCardProps } from '../framework/dashboard.types';

export const InformationCard = ({
  title,
  value,
  description,
  icon,
  className = '',
}: InformationCardProps) => {
  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-info-50 rounded-lg">
          {icon || <Info className="w-5 h-5 text-info-500" />}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-60">{title}</p>
          <p className="text-xl font-bold text-neutral-100 mt-1">{value}</p>
          {description && (
            <p className="text-sm text-neutral-60 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
