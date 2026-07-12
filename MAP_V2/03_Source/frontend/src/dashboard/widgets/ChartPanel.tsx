import { BarChart3 } from 'lucide-react';
import type { ChartPanelProps } from '../framework/dashboard.types';

export const ChartPanel = ({
  title,
  chartType,
  height = 300,
  className = '',
}: ChartPanelProps) => {
  return (
    <div className={`rounded-xl border p-4 border-neutral-30 bg-white ${className}`}>
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">{title}</h3>
      <div
        className="flex items-center justify-center bg-neutral-20 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-neutral-60 mx-auto" />
          <p className="text-sm text-neutral-60 mt-2">{chartType} Chart</p>
          <p className="text-xs text-neutral-60">Placeholder</p>
        </div>
      </div>
    </div>
  );
};
