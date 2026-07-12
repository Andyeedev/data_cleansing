import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { StatusWidgetProps } from '../types/WidgetProps';
import type { LucideIcon } from 'lucide-react';

const statusConfig: Record<string, { icon: LucideIcon; bgClass: string; textClass: string }> = {
  success: { icon: CheckCircle, bgClass: 'bg-success-50', textClass: 'text-success-500' },
  warning: { icon: AlertTriangle, bgClass: 'bg-warning-50', textClass: 'text-warning-500' },
  error: { icon: XCircle, bgClass: 'bg-error-50', textClass: 'text-error-500' },
  info: { icon: Info, bgClass: 'bg-info-50', textClass: 'text-info-500' },
  neutral: { icon: Info, bgClass: 'bg-neutral-20', textClass: 'text-neutral-60' },
};

export const StatusWidget = ({ data }: WidgetProps) => {
  const statusData = data as StatusWidgetProps['data'];

  if (!statusData) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-neutral-60">No data</p>
        </div>
      </WidgetBody>
    );
  }

  const config_ = statusConfig[statusData.status] || statusConfig.neutral;
  const Icon = config_.icon;

  return (
    <WidgetBody>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config_.bgClass}`}>
          <Icon className={`w-5 h-5 ${config_.textClass}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-100">{statusData.title}</p>
          {statusData.description && (
            <p className="text-xs text-neutral-60 mt-1">{statusData.description}</p>
          )}
        </div>
      </div>
    </WidgetBody>
  );
};
