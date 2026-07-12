import { Clock } from 'lucide-react';

interface TimelineChartProps {
  title?: string;
  data?: { label: string; start: string; end?: string; color?: string }[];
  height?: number;
  className?: string;
}

export const TimelineChart = ({
  title,
  height = 300,
  className = '',
}: TimelineChartProps) => {
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
          <Clock className="w-12 h-12 text-neutral-60 mx-auto" />
          <p className="text-sm text-neutral-60 mt-2">Timeline</p>
          <p className="text-xs text-neutral-60">Placeholder</p>
        </div>
      </div>
    </div>
  );
};
