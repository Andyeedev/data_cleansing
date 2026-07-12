import { Gauge } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';

export const GaugeWidget = ({ config, data }: WidgetProps) => {
  const chartData = data as { height?: number } | undefined;

  return (
    <WidgetBody>
      <div
        className="flex items-center justify-center bg-neutral-20 rounded-lg"
        style={{ height: chartData?.height || 250 }}
      >
        <div className="text-center">
          <Gauge className="w-12 h-12 text-neutral-60 mx-auto" />
          <p className="text-sm text-neutral-60 mt-2">Gauge</p>
          <p className="text-xs text-neutral-60">{config.title || 'Placeholder'}</p>
        </div>
      </div>
    </WidgetBody>
  );
};
