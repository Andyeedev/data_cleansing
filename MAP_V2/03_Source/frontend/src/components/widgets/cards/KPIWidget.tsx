import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { KPIWidgetProps } from '../types/WidgetProps';

const deltaColors = {
  up: 'text-success-500',
  down: 'text-error-500',
  neutral: 'text-neutral-60',
};

export const KPIWidget = ({ data }: WidgetProps) => {
  const kpiData = data as KPIWidgetProps['data'];

  if (!kpiData) {
    return (
      <WidgetBody>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-neutral-60">No data</p>
        </div>
      </WidgetBody>
    );
  }

  return (
    <WidgetBody>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-2xl font-bold text-neutral-100">{kpiData.value}</p>
          {kpiData.label && (
            <p className="text-sm text-neutral-60 mt-1">{kpiData.label}</p>
          )}
        </div>
        {kpiData.icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            {kpiData.icon}
          </div>
        )}
      </div>

      {kpiData.delta && (
        <div className={`flex items-center gap-1 mt-3 ${deltaColors[kpiData.delta.direction]}`}>
          {kpiData.delta.direction === 'up' && <TrendingUp className="w-4 h-4" />}
          {kpiData.delta.direction === 'down' && <TrendingDown className="w-4 h-4" />}
          {kpiData.delta.direction === 'neutral' && <Minus className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {kpiData.delta.percentage ? `${kpiData.delta.value}%` : kpiData.delta.value}
          </span>
        </div>
      )}

      {kpiData.trend && kpiData.trend.length > 0 && (
        <div className="flex items-end gap-0.5 h-4 mt-3">
          {kpiData.trend.slice(-7).map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-500 rounded-t"
              style={{ height: `${Math.max(20, (point / Math.max(...kpiData.trend!)) * 100)}%` }}
            />
          ))}
        </div>
      )}

      {kpiData.footer && <div className="mt-3 pt-3 border-t border-neutral-30">{kpiData.footer}</div>}
    </WidgetBody>
  );
};
