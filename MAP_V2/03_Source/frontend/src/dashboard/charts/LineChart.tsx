import { TrendingUp } from 'lucide-react';

interface LineChartProps {
  title?: string;
  data?: { label: string; value: number }[];
  height?: number;
  className?: string;
}

export const LineChart = ({
  title,
  height = 300,
  className = '',
}: LineChartProps) => {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-sm font-semibold text-neutral-100 mb-4">{title}</h3>
      )}
      <div
        className="flex items-center justify-center bg-neutral-20 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-neutral-60 mx-auto" />
          <p className="text-sm text-neutral-60 mt-2">Line Chart</p>
          <p className="text-xs text-neutral-60">Placeholder</p>
        </div>
      </div>
    </div>
  );
};
