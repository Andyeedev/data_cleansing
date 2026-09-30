/**
 * OC-REPORT-001 â€” read-only renderers for a saved report definition.
 *
 * Reuses the existing report primitives (KpiBox, ReportCard, StatusPill,
 * DataTable) from components/reports/reportWidgets.tsx and
 * components/shared/DataTable.tsx rather than introducing a parallel set.
 *
 * Nothing here decides access. Authorisation has already happened server-side on
 * the /data call; a 403 is rendered as a denied state, not worked around.
 */
import { KpiBox, ReportCard, StatusPill } from './reportWidgets';
import { DataTable } from '../shared/DataTable';
import type { ReportComponent } from '../../types/reportStudio';

// DataTable keeps `Column` private, so the shape is declared locally rather than
// widening the shared component's public API for one consumer.
type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
};

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function Bar({ rows }: { rows: unknown[][]; columns: string[] }) {
  if (!rows.length) return <Empty />;
  const max = Math.max(...rows.map((r) => Math.abs(num(r[rows[0]?.length ? 1 : 0]) ?? 0)), 1);
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r, i) => {
        const label = String(r[0] ?? '');
        const value = num(r[1]) ?? 0;
        const pct = Math.max(2, (Math.abs(value) / max) * 100);
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs text-gray-600" title={label}>{label}</span>
            <div className="h-2.5 flex-1 rounded bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded ${value < 0 ? 'bg-red-600' : 'bg-blue-600'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-xs text-gray-700">
              {value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Line({ rows }: { rows: unknown[][]; columns: string[] }) {
  if (rows.length < 2) return <Empty />;
  const values = rows.map((r) => num(r[1]) ?? 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const W = 640;
  const H = 160;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (W - 20) + 10;
    const y = H - 18 - ((v - min) / span) * (H - 40);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" role="img" aria-label="trend">
        <defs>
          <linearGradient id="ocre001fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((f) => (
          <line key={f} x1="10" y1={18 + f * (H - 40)} x2={W - 10} y2={18 + f * (H - 40)} stroke="#e2e8f0" />
        ))}
        <polygon points={`10,${H - 18} ${pts.join(' ')} ${W - 10},${H - 18}`} fill="url(#ocre001fill)" />
        <polyline points={pts.join(' ')} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => {
          const [cx, cy] = p.split(',');
          return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#2563eb" />;
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{String(rows[0]?.[0] ?? '')}</span>
        <span>{String(rows[rows.length - 1]?.[0] ?? '')}</span>
      </div>
    </div>
  );
}

function Donut({ rows }: { rows: unknown[][] }) {
  if (!rows.length) return <Empty />;
  const palette = ['#2563eb', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#64748b'];
  const total = rows.reduce((s, r) => s + Math.abs(num(r[1]) ?? 0), 0) || 1;
  let angle = 0;
  const R = 54;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 140 140" className="h-36 w-36" role="img" aria-label="composition">
        {rows.map((r, i) => {
          const frac = Math.abs(num(r[1]) ?? 0) / total;
          const dash = frac * C;
          const el = (
            <circle
              key={i}
              cx="70" cy="70" r={R}
              fill="none"
              stroke={palette[i % palette.length]}
              strokeWidth="22"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-angle}
              transform="rotate(-90 70 70)"
            />
          );
          angle += dash;
          return el;
        })}
        <text x="70" y="74" textAnchor="middle" className="fill-gray-700" fontSize="18" fontWeight="700">
          {total.toLocaleString()}
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 text-xs">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: palette[i % palette.length] }} />
            <span className="text-gray-600 w-32 truncate">{String(r[0] ?? '')}</span>
            <span className="font-mono text-gray-800">{String(num(r[1]) ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ rows }: { rows: unknown[][]; columns: string[] }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => {
        const score = num(r[1]);
        const label = String(r[0] ?? '');
        const tone = score === null ? 'bg-gray-300' : score >= 90 ? 'bg-green-600' : score >= 70 ? 'bg-amber-500' : 'bg-red-600';
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-xs text-gray-600" title={label}>{label}</span>
            <div className="h-2.5 flex-1 rounded bg-gray-200 overflow-hidden">
              <div className={`h-full ${tone}`} style={{ width: `${Math.max(2, Math.min(100, score ?? 0))}%` }} />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-xs">{score === null ? 'â€”' : `${score}%`}</span>
          </div>
        );
      })}
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-xs text-gray-400">No data in this section for the current filters.</p>;
}

export function ReportComponentView({ component }: { component: ReportComponent }) {
  const { type, title, rows, columns, is_row_query, row_count } = component;

  if (type === 'kpi') {
    const value = rows[0]?.[0];
    const numeric = num(value);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBox
          label={title ?? 'Value'}
          value={numeric !== null ? numeric.toLocaleString() : String(value ?? 'â€”')}
          tone={numeric === null ? 'neutral' : numeric >= 0 ? 'success' : 'error'}
        />
        <div className="sm:col-span-1 lg:col-span-3 self-center text-xs text-gray-500">
          Aggregated over the saved filters.
        </div>
      </div>
    );
  }

  if (type === 'table' && is_row_query) {
    const cols: Column[] = columns.map((c, i) => ({
      key: `${c}-${i}`,
      label: c.replace(/_/g, ' '),
      sortable: false,
      render: (value: unknown) => {
        const n = num(value);
        return n === null ? String(value ?? 'â€”') : n.toLocaleString();
      },
    }));
    // DataTable is generic over Record<string, any> and requires keyExtractor;
    // pagination additionally requires onPageChange, so the simple case omits it
    // and lets the component size itself from the data.
    const data = rows.map((r, ri) =>
      Object.fromEntries([...cols.map((c, ci) => [c.key, r[ci]]), ['__row', ri]]),
    );
    return (
      <DataTable
        columns={cols}
        data={data}
        empty="No rows matched the saved filters."
        keyExtractor={(r) => String(r.__row)}
      />
    );
  }

  return (
    <ReportCard title={title ?? type}>
      {type === 'bar' && <Bar rows={rows} columns={columns} />}
      {type === 'line' && <Line rows={rows} columns={columns} />}
      {type === 'donut' && <Donut rows={rows} />}
      {type === 'scorebar' && <ScoreBar rows={rows} columns={columns} />}
      {type === 'barlist' && <Bar rows={rows} columns={columns} />}
      {rows.length > 0 && (
        <p className="mt-3 text-[10px] text-gray-400">
          {row_count.toLocaleString()} row{row_count === 1 ? '' : 's'}
        </p>
      )}
    </ReportCard>
  );
}

export { StatusPill };
