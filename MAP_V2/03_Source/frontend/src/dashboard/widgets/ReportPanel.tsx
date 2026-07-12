import { FileText } from 'lucide-react';
import type { ReportPanelProps } from '../framework/dashboard.types';

export const ReportPanel = ({
  title,
  description,
  children,
  className = '',
}: ReportPanelProps) => {
  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <FileText className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
          {description && (
            <p className="text-xs text-neutral-60 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {children || (
        <div className="flex items-center justify-center h-32 bg-neutral-20 rounded-lg">
          <p className="text-sm text-neutral-60">Report content placeholder</p>
        </div>
      )}
    </div>
  );
};
