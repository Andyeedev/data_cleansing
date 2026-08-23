const WIDTH_CLASSES: Record<number, string> = {
  0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]',
  30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]', 55: 'w-[55%]',
  60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]',
  90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full',
};

function widthClass(percent: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  return WIDTH_CLASSES[Math.round(clamped / 5) * 5] ?? 'w-0';
}

const toneClasses: Record<string, string> = {
  success: 'border-l-green-500 bg-green-50 text-green-800',
  error: 'border-l-red-500 bg-red-50 text-red-800',
  warning: 'border-l-yellow-400 bg-yellow-50 text-yellow-800',
  info: 'border-l-blue-500 bg-blue-50 text-blue-800',
  neutral: 'border-l-gray-300 bg-gray-50 text-gray-800',
};

export function KpiBox({ label, value, tone = 'neutral' }: { label: string; value: string | number; tone?: string }) {
  const cls = toneClasses[tone] ?? toneClasses.neutral;
  return (
    <div className={`rounded-lg border-l-4 p-4 shadow-sm ${cls}`}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

export function ReportCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 shadow-sm ${className}`}>
      <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = (status ?? '').toUpperCase();
  const colorMap: Record<string, string> = {
    PASS: 'bg-green-100 text-green-800',
    PASSED: 'bg-green-100 text-green-800',
    GOOD: 'bg-green-100 text-green-800',
    MET: 'bg-green-100 text-green-800',
    READY: 'bg-green-100 text-green-800',
    FAIL: 'bg-red-100 text-red-800',
    FAILED: 'bg-red-100 text-red-800',
    CRITICAL: 'bg-red-100 text-red-800',
    BLOCKED: 'bg-red-100 text-red-800',
    BELOW: 'bg-red-100 text-red-800',
    NOT_READY: 'bg-red-100 text-red-800',
    HIGH: 'bg-red-100 text-red-800',
    FAILING: 'bg-red-100 text-red-800',
    WARN: 'bg-yellow-100 text-yellow-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    FAIR: 'bg-yellow-100 text-yellow-800',
    OPEN: 'bg-yellow-100 text-yellow-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    INFO: 'bg-blue-100 text-blue-800',
    SKIPPED: 'bg-gray-100 text-gray-600',
    DISABLED: 'bg-gray-100 text-gray-600',
    NONE: 'bg-gray-100 text-gray-600',
    AUTO_MATCHED: 'bg-green-100 text-green-800',
    MANUAL: 'bg-blue-100 text-blue-800',
    REVIEW_REQUIRED: 'bg-yellow-100 text-yellow-800',
    GO: 'bg-green-100 text-green-800',
    'NO-GO': 'bg-red-100 text-red-800',
    LOW: 'bg-green-100 text-green-800',
  };
  const cls = colorMap[s] ?? 'bg-gray-100 text-gray-600';
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}

export function BarList({ items, colorClass = 'bg-blue-600' }: { items: { label: string; value: number }[]; colorClass?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 py-4 text-center">No data available.</p>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 truncate pr-2" title={item.label}>{item.label}</span>
            <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${colorClass} ${widthClass((item.value / max) * 100)}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-gray-400">-</span>;
  const color = score >= 90 ? 'bg-green-600' : score >= 70 ? 'bg-yellow-400' : 'bg-red-600';
  const text = score >= 90 ? 'text-green-700' : score >= 70 ? 'text-yellow-700' : 'text-red-700';
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} ${widthClass(score)}`} />
      </div>
      <span className={`text-sm font-semibold tabular-nums ${text}`}>{score}%</span>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-gray-400 py-8 text-center">{message}</p>;
}

export function LineChart({ points }: { points: { label: string; value: number | null }[] }) {
  if (points.length < 2) {
    return <EmptyState message="Not enough data points to draw a trend." />;
  }
  const W = 560;
  const H = 220;
  const PAD_L = 36;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 28;
  const iw = W - PAD_L - PAD_R;
  const ih = H - PAD_T - PAD_B;
  const x = (i: number) => PAD_L + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => PAD_T + ih - (Math.min(100, Math.max(0, v)) / 100) * ih;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value ?? 0).toFixed(1)}`).join(' ');
  const areaPath = `${path} L${x(points.length - 1).toFixed(1)},${(PAD_T + ih).toFixed(1)} L${x(0).toFixed(1)},${(PAD_T + ih).toFixed(1)} Z`;
  const gridVals = [0, 25, 50, 75, 100];
  const labelEvery = Math.ceil(points.length / 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Quality trend line chart">
      {gridVals.map((g) => (
        <g key={g}>
          <line x1={PAD_L} y1={y(g)} x2={W - PAD_R} y2={y(g)} stroke="#E5E7EB" strokeWidth="1" />
          <text x={PAD_L - 6} y={y(g) + 3} textAnchor="end" className="fill-gray-400" fontSize="9">{g}</text>
        </g>
      ))}
      <path d={areaPath} fill="#3B82F6" opacity="0.08" />
      <path d={path} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value ?? 0)} r={p.value !== null ? 3 : 0} fill="#2563EB">
            <title>{`${p.label}: ${p.value !== null ? `${Math.round(p.value)}%` : '-'}`}</title>
          </circle>
          {(i % labelEvery === 0 || i === points.length - 1) && (
            <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-gray-400" fontSize="9">{p.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
