interface ExecutiveRiskProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const levelColors = {
  low: 'text-success-500 bg-success-50',
  medium: 'text-warning-500 bg-warning-50',
  high: 'text-error-500 bg-error-50',
  critical: 'text-error-600 bg-error-100',
};

export const ExecutiveRisk = ({ level, score, critical, high, medium, low }: ExecutiveRiskProps) => {

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-3">Risk Overview</h3>

      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${levelColors[level]}`}>
          {level.toUpperCase()}
        </span>
        <span className="text-2xl font-bold text-neutral-100">{score}</span>
        <span className="text-xs text-neutral-60">/ 100</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-error-500" />
          <span className="text-xs text-neutral-60">Critical</span>
          <span className="text-xs font-semibold text-neutral-100 ml-auto">{critical}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning-500" />
          <span className="text-xs text-neutral-60">High</span>
          <span className="text-xs font-semibold text-neutral-100 ml-auto">{high}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-xs text-neutral-60">Medium</span>
          <span className="text-xs font-semibold text-neutral-100 ml-auto">{medium}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-500" />
          <span className="text-xs text-neutral-60">Low</span>
          <span className="text-xs font-semibold text-neutral-100 ml-auto">{low}</span>
        </div>
      </div>
    </div>
  );
};
