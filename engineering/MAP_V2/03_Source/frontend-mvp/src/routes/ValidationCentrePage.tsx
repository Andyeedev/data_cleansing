import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useValidationDashboard, useExecutionHistory, useExecutionControl } from '../hooks/useValidation';
import { useControls, useExecutionOutcomes } from '../hooks/useControls';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';

export function ValidationCentrePage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();
  const { tenantId } = useValidationFilter();
  const [isLive, setIsLive] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearch, setHistorySearch] = useState('');

  const { data: dashboardData, loading: dashLoading, error: dashError, refetch: dashRefetch } = useValidationDashboard(tenantId || undefined);
  const { data: controlsData, loading: ctrlLoading, error: ctrlError } = useControls();
  const { data: outcomesData, loading: outLoading, error: outError, refetch: outRefetch } = useExecutionOutcomes(tenantId || undefined);
  const { data: historyData, loading: histLoading, error: histError, refetch: histRefetch } = useExecutionHistory(historyPage, 10, tenantId || undefined);

  const [controlSearch, setControlSearch] = useState('');
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const filteredControls = useMemo(() => {
    if (!controlsData?.controls) return [];
    let result = controlsData.controls;
    if (controlSearch) {
      const q = controlSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.control_id.toLowerCase().includes(q) ||
          (c.control_name && c.control_name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [controlsData?.controls, controlSearch]);

  const totalControls = controlsData?.total || 0;

  const outcomeSummary = outcomesData?.summary;
  const passedCount = outcomeSummary?.passed || 0;
  const attentionCount = outcomeSummary?.attention || 0;
  const criticalCount = outcomeSummary?.critical || 0;
  const disabledCount = outcomeSummary?.disabled || 0;
  const skippedCount = outcomeSummary?.skipped || 0;

  const outcomeDistribution = [
    { label: 'Passed', value: passedCount, color: '#107C10' },
    { label: 'Attention Required', value: attentionCount, color: '#FFB900' },
    { label: 'Critical Issue', value: criticalCount, color: '#D13438' },
    { label: 'Disabled', value: disabledCount, color: '#9E9E9E' },
    { label: 'Skipped', value: skippedCount, color: '#605E5C' },
  ].filter((d) => d.value > 0);

  const donutSvgData = useMemo(() => {
    const total = outcomeDistribution.reduce((s, d) => s + d.value, 0);
    if (total === 0) return { segments: [], circumference: 0 };
    const r = 72;
    const circumference = 2 * Math.PI * r;
    let cumulative = 0;
    const segments = outcomeDistribution.map((d) => {
      const pct = d.value / total;
      const segLen = pct * circumference;
      const offset = cumulative;
      cumulative += pct;
      return { ...d, pct, segLen, offset };
    });
    return { segments, circumference };
  }, [outcomeDistribution]);

  if (!userRoles.includes('admin')) {
    return (
      <div className="px-8 py-6">
        <h1 className="text-xl font-semibold text-neutral-100 mb-4">Validation Centre</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const isLoading = dashLoading || ctrlLoading;
  const hasError = dashError || ctrlError;

  const summaryParts: string[] = [];
  if (outcomeSummary) {
    if (outcomeSummary.total_executed > 0) summaryParts.push(`${outcomeSummary.total_executed} Executed`);
    if (passedCount > 0) summaryParts.push(`${passedCount} Passed`);
    if (attentionCount > 0) summaryParts.push(`${attentionCount} Attention`);
    if (criticalCount > 0) summaryParts.push(`${criticalCount} Critical`);
    if (disabledCount > 0) summaryParts.push(`${disabledCount} Disabled`);
  }

  return (
    <div className="px-8 py-6">

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100">Validation Centre</h1>
          <p className="text-xs text-neutral-70 mt-1">
            {summaryParts.length > 0 ? summaryParts.join(' \u2014 ') : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CascadeDropdowns showProject={false} showBatch={false} />
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isLive
                ? 'bg-success-500 text-white border-success-500'
                : 'bg-neutral-10 text-neutral-80 border-neutral-40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-neutral-60'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={() => { dashRefetch(); outRefetch(); histRefetch(); }}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-40 bg-neutral-10 text-neutral-80 hover:bg-neutral-20 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {(dashError || ctrlError || outError) && <ErrorState message={dashError || ctrlError || outError || ''} onRetry={dashRefetch} />}
      {(dashLoading || ctrlLoading || outLoading) && <LoadingSkeleton rows={4} variant="card" />}

      {!dashLoading && !ctrlLoading && !outLoading && !dashError && !ctrlError && !outError && (
        <>

          {/* KPI Cards — Row 1 */}
          <div className="grid grid-cols-6 gap-4 mb-[38px]">
            <KpiCard label="Total Controls" value={outcomeSummary?.total_controls || totalControls} borderClass="border-l-primary-500" />
            <KpiCard label="Passed" value={passedCount} borderClass="border-l-success-500" />
            <KpiCard label="Attention" value={attentionCount} borderClass="border-l-warning-500" />
            <KpiCard label="Critical" value={criticalCount} borderClass="border-l-error-500" />
            <KpiCard label="Disabled" value={disabledCount} borderClass="border-l-neutral-50" />
            <KpiCard label="Skipped" value={skippedCount} borderClass="border-l-neutral-70" />
          </div>

          {/* Donut Chart + Control Results Table — Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[38px]">

            {/* Donut Chart Card */}
            <div className="bg-white border border-neutral-30 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-neutral-10 px-6 py-3.5 border-b border-neutral-30">
                <h3 className="text-sm font-bold text-neutral-100">Validation Distribution</h3>
              </div>
              <div className="px-6 py-6 flex items-center justify-center gap-8">
                <div className="relative w-[180px] h-[180px] flex-shrink-0">
                  <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                    {donutSvgData.segments.map((seg, i) => {
                      const gapOffset = 2;
                      const adjustedLen = Math.max(0, seg.segLen - gapOffset);
                      const dashOffset = -(seg.offset * donutSvgData.circumference) - gapOffset / 2;
                      return (
                        <circle
                          key={seg.label}
                          cx="90"
                          cy="90"
                          r="72"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={hoveredSegment === i ? 28 : 24}
                          strokeDasharray={`${adjustedLen} ${donutSvgData.circumference - adjustedLen}`}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          className="transition-all duration-150 cursor-pointer"
                          style={{ opacity: hoveredSegment !== null && hoveredSegment !== i ? 0.5 : 1 }}
                          onMouseEnter={() => setHoveredSegment(i)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 m-auto w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-neutral-100">{outcomeSummary?.total_executed || 0}</span>
                  </div>

                  {/* Tooltip */}
                  {hoveredSegment !== null && donutSvgData.segments[hoveredSegment] && (
                    <div
                      className="absolute bg-neutral-1000 text-white rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none z-10 whitespace-nowrap"
                      style={{
                        left: '50%',
                        top: '-8px',
                        transform: 'translate(-50%, -100%)',
                      }}
                    >
                      <div className="font-bold text-[13px]">{donutSvgData.segments[hoveredSegment].label}</div>
                      <div className="text-neutral-40 mt-0.5">
                        {donutSvgData.segments[hoveredSegment].value} controls ({Math.round(donutSvgData.segments[hoveredSegment].pct * 100)}%)
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  {outcomeDistribution.map((d) => (
                    <div key={d.label} className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-neutral-80 min-w-[110px]">{d.label}</span>
                      <span className="text-xs font-semibold text-neutral-100">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Control Results Table Card */}
            <div className="bg-white border border-neutral-30 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-neutral-10 px-6 py-3.5 border-b border-neutral-30">
                <h3 className="text-sm font-bold text-neutral-100">Control Results</h3>
              </div>
              <div className="overflow-auto max-h-[320px]">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-neutral-10 z-[1]">
                    <tr className="border-b-2 border-neutral-30">
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Control</th>
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Name</th>
                      <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Status</th>
                      <th className="text-right px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Passed</th>
                      <th className="text-right px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-neutral-60 text-xs">No controls found</td>
                      </tr>
                    ) : (
                      filteredControls.map((control) => {
                        const outcome = outcomesData?.controls?.find((o) => o.control_id === control.control_id);
                        return (
                          <tr
                            key={control.control_id}
                            className="border-b border-neutral-30 hover:bg-primary-50 cursor-pointer transition-colors"
                            onClick={() => navigate('/validation/rules')}
                          >
                            <td className="px-4 py-2.5 font-mono text-neutral-100">{control.control_id}</td>
                            <td className="px-4 py-2.5 text-neutral-80">{control.control_name || '\u2014'}</td>
                            <td className="px-4 py-2.5">
                              <StatusBadge
                                status={outcome?.overall_status || (control.enabled_flag ? 'N/A' : 'DISABLED')}
                                size="sm"
                              />
                            </td>
                            <td className="px-4 py-2.5 text-right text-success-500 font-semibold">{outcome?.passed_rules || 0}</td>
                            <td className="px-4 py-2.5 text-right text-error-500 font-semibold">{outcome?.failed_rules || 0}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Executions — Row 3 */}
          <div className="bg-white border border-neutral-30 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-neutral-10 px-6 py-3.5 border-b border-neutral-30 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">Recent Executions</h3>
              <div className="flex items-center gap-3">
                <SearchBar
                  value={historySearch}
                  onChange={setHistorySearch}
                  placeholder="Search batches..."
                />
              </div>
            </div>

            {histLoading ? (
              <LoadingSkeleton rows={3} variant="table" />
            ) : histError ? (
              <div className="px-6 py-4"><ErrorState message={histError} onRetry={histRefetch} /></div>
            ) : !historyData || historyData.items.length === 0 ? (
              <div className="px-6 py-8 text-center text-neutral-60 text-xs">
                No execution history found. Start a migration execution to see history here.
              </div>
            ) : (
              <>
                <div className="overflow-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead className="sticky top-0 bg-neutral-10 z-[1]">
                      <tr className="border-b-2 border-neutral-30">
                        <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Batch ID</th>
                        <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Status</th>
                        <th className="text-right px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Controls</th>
                        <th className="text-right px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Completed</th>
                        <th className="text-right px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Failed</th>
                        <th className="text-left px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Started</th>
                        <th className="text-center px-4 py-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-70">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.items.map((item) => (
                        <tr
                          key={item.batch_id}
                          className="border-b border-neutral-30 hover:bg-primary-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/validation/results/${item.batch_id}`)}
                        >
                          <td className="px-4 py-2.5 font-mono text-[11px] text-neutral-80">
                            {item.batch_id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={item.batch_status} size="sm" />
                          </td>
                          <td className="px-4 py-2.5 text-right text-neutral-80">{item.total_controls}</td>
                          <td className="px-4 py-2.5 text-right text-neutral-80">{item.completed_controls}</td>
                          <td className="px-4 py-2.5 text-right text-error-500 font-semibold">{item.failed_controls}</td>
                          <td className="px-4 py-2.5 text-[11px] text-neutral-70">
                            {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '\u2014'}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/validation/results/${item.batch_id}`);
                              }}
                              className="px-2.5 py-1 text-[10px] font-medium rounded border border-neutral-40 bg-white text-neutral-80 hover:bg-neutral-10 transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-30">
                  <span className="text-[11px] text-neutral-60">
                    Page {historyPage} of {Math.ceil((historyData.total || 1) / 10)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="px-2.5 py-1 text-[11px] rounded border border-neutral-40 bg-white text-neutral-80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-10 transition-colors"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setHistoryPage((p) => p + 1)}
                      disabled={historyPage >= Math.ceil((historyData.total || 1) / 10)}
                      className="px-2.5 py-1 text-[11px] rounded border border-neutral-40 bg-white text-neutral-80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-10 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, borderClass }: { label: string; value: number; borderClass: string }) {
  return (
    <div className={`bg-white border border-neutral-30 rounded-xl px-4 py-4 shadow-sm border-l-[4px] ${borderClass} hover:shadow-md transition-shadow`}>
      <div className="text-[10px] uppercase tracking-wider text-neutral-70 font-semibold mb-1">{label}</div>
      <div className="text-2xl font-bold text-neutral-100">{value}</div>
    </div>
  );
}
