import { PieChart } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';

export const PieChartWidget = ({ config, data }: WidgetProps) => {
  const chartData = data as { height?: number } | undefined;

  return (
    <WidgetBody>
      <div
        className="flex items-center justify-center bg-neutral-20 rounded-lg"
        style={{ height: chartData?.height || 250 }}
      >
        <div className="text-center">
          <PieChart className="w-12 h-12 text-neutral-60 mx-auto" />
          <p className="text-sm text-neutral-60 mt-2">Pie Chart</p>
          <p className="text-xs text-neutral-60">{config.title || 'Placeholder'}</p>
        </div>
      </div>
    </WidgetBody>
  );
};
