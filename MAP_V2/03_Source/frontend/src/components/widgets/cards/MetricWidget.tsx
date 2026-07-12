import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { MetricWidgetProps } from '../types/WidgetProps';

const variantStyles = {
  default: 'bg-white border-neutral-30',
  primary: 'bg-primary-50 border-primary-200',
  success: 'bg-success-50 border-success-200',
  warning: 'bg-warning-50 border-warning-200',
  error: 'bg-error-50 border-error-200',
};

export const MetricWidget = ({ data }: WidgetProps) => {
  const metricData = data as MetricWidgetProps['data'];

  if (!metricData) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-neutral-60">No data</p>
        </div>
      </WidgetBody>
    );
  }

  const variant = metricData.variant || 'default';

  return (
    <WidgetBody>
      <div className={`p-4 rounded-lg border ${variantStyles[variant]}`}>
        <div className="flex items-center gap-3">
          {metricData.icon && (
            <div className="p-2 bg-white rounded-lg border border-neutral-30">
              {metricData.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-neutral-60">{metricData.label}</p>
            <p className="text-xl font-bold text-neutral-100">{metricData.value}</p>
            {metricData.subtitle && (
              <p className="text-xs text-neutral-60 mt-0.5">{metricData.subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </WidgetBody>
  );
};
