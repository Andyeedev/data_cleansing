import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useValidationDashboard, useExecutionHistory } from '../hooks/useValidation';
import { useControls, useExecutionOutcomes } from '../hooks/useControls';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill, EmptyState } from '../components/reports/reportWidgets';

const PAGE_SIZE = 10;
const AUTO_REFRESH_MS = 15000;

export function ValidationCentrePage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();
  const { tenantId } = useValidationFilter();
  const [isLive, setIsLive] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearch, setHistorySearch] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: dashboardData, loading: dashLoading, error: dashError, refetch: dashRefetch } = useValidationDashboard(tenantId || undefined);
  const { data: controlsData, loading: ctrlLoading, error: ctrlError } = useControls(tenantId || undefined);
  const { data: outcomesData, loading: outLoading, error: outError, refetch: outRefetch } = useExecutionOutcomes(tenantId || undefined);
  const { data: historyData, loading: histLoading, error: histError, refetch: histRefetch } = useExecutionHistory(
    historyPage, PAGE_SIZE, tenantId || undefined, undefined, historySearch || undefined
  );

  const [controlSearch, setControlSearch] = useState('');
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const refetchAll = useCallback(() => {
    dashRefetch();
    outRefetch();
    histRefetch();
  }, [dashRefetch, outRefetch, histRefetch]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isLive) {
      intervalRef.current = setInterval(refetchAll, AUTO_REFRESH_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, refetchAll]);

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
      <PageContainer>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Validation Centre</h1>
        </div>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  const isLoading = dashLoading || ctrlLoading || outLoading;
  const hasError = dashError || ctrlError || outError;

  const summaryParts: string[] = [];
  if (outcomeSummary) {
    if (outcomeSummary.total_executed > 0) summaryParts.push(`${outcomeSummary.total_executed} Executed`);
    if (passedCount > 0) summaryParts.push(`${passedCount} Passed`);
    if (attentionCount > 0) summaryParts.push(`${attentionCount} Attention`);
    if (criticalCount > 0) summaryParts.push(`${criticalCount} Critical`);
    if (disabledCount > 0) summaryParts.push(`${disabledCount} Disabled`);
  }

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validation Centre</h1>
          <p className="text-sm text-gray-500 mt-1">
            {summaryParts.length > 0 ? summaryParts.join(' \u2014 ') : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CascadeDropdowns showProject={false} showBatch={false} />
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isLive
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={refetchAll}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {hasError && <ErrorState message={dashError || ctrlError || outError || ''} onRetry={dashRefetch} />}
      {isLoading && <LoadingSkeleton rows={4} variant="card" />}

      {!isLoading && !hasError && (
        <>

          {/* KPI Cards — Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            <KpiBox label="Total Controls" value={outcomeSummary?.total_controls || totalControls} tone="info" />
            <KpiBox label="Passed" value={passedCount} tone="success" />
            <KpiBox label="Attention" value={attentionCount} tone={attentionCount > 0 ? 'warning' : 'neutral'} />
            <KpiBox label="Critical" value={criticalCount} tone={criticalCount > 0 ? 'error' : 'neutral'} />
            <KpiBox label="Disabled" value={disabledCount} tone="neutral" />
            <KpiBox label="Skipped" value={skippedCount} tone="neutral" />
          </div>

          {/* Donut Chart + Control Results Table — Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Donut Chart Card */}
            <ReportCard title="Validation Distribution">
              {donutSvgData.segments.length === 0 ? (
                <EmptyState message="No validation data available." />
              ) : (
                <div className="flex items-center justify-center gap-8">
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
                      <span className="text-lg font-bold text-gray-900">{outcomeSummary?.total_executed || 0}</span>
                    </div>

                    {/* Tooltip */}
                    {hoveredSegment !== null && donutSvgData.segments[hoveredSegment] && (
                      <div
                        className="absolute bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none z-10 whitespace-nowrap"
                        style={{
                          left: '50%',
                          top: '-8px',
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <div className="font-bold text-[13px]">{donutSvgData.segments[hoveredSegment].label}</div>
                        <div className="text-gray-400 mt-0.5">
                          {donutSvgData.segments[hoveredSegment].value} controls ({Math.round(donutSvgData.segments[hoveredSegment].pct * 100)}%)
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {outcomeDistribution.map((d) => (
                      <div key={d.label} className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-600 min-w-[110px]">{d.label}</span>
                        <span className="text-xs font-semibold text-gray-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ReportCard>

            {/* Control Results Table Card */}
            <ReportCard title="Control Results" subtitle={`${filteredControls.length} controls`}>
              <div className="overflow-auto max-h-[320px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 z-[1]">
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Control</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passed</th>
                      <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.length === 0 ? (
                      <tr>
                        <td colSpan={5}><EmptyState message="No controls found." /></td>
                      </tr>
                    ) : (
                      filteredControls.map((control) => {
                        const outcome = outcomesData?.controls?.find((o) => o.control_id === control.control_id);
                        return (
                          <tr
                            key={control.control_id}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => navigate('/validation/rules')}
                          >
                            <td className="px-3 py-2.5 font-mono text-gray-900">{control.control_id}</td>
                            <td className="px-3 py-2.5 text-gray-700">{control.control_name || '\u2014'}</td>
                            <td className="px-3 py-2.5">
                              <StatusPill status={outcome?.overall_status || (control.enabled_flag ? 'N/A' : 'DISABLED')} />
                            </td>
                            <td className="px-3 py-2.5 text-right text-green-700 font-semibold">{outcome?.passed_rules || 0}</td>
                            <td className="px-3 py-2.5 text-right text-red-700 font-semibold">{outcome?.failed_rules || 0}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          </div>

          {/* Recent Executions — Row 3 */}
          <ReportCard
            title="Recent Executions"
            subtitle={`${historyData?.total || 0} total`}
          >
            <div className="flex items-center justify-between mb-4">
              <div />
              <SearchBar
                value={historySearch}
                onChange={setHistorySearch}
                placeholder="Search batches..."
              />
            </div>

            {histLoading ? (
              <LoadingSkeleton rows={3} variant="table" />
            ) : histError ? (
              <ErrorState message={histError} onRetry={histRefetch} />
            ) : !historyData || historyData.items.length === 0 ? (
              <EmptyState message="No execution history found. Start a migration execution to see history here." />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch ID</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Controls</th>
                        <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Failed</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Started</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.items.map((item) => (
                        <tr
                          key={item.batch_id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/validation/results/${item.batch_id}`)}
                        >
                          <td className="px-3 py-2.5 font-mono text-[11px] text-gray-700">
                            {item.batch_id.slice(0, 8)}...
                          </td>
                          <td className="px-3 py-2.5">
                            <StatusPill status={item.batch_status} />
                          </td>
                          <td className="px-3 py-2.5 text-right text-gray-700">{item.total_controls}</td>
                          <td className="px-3 py-2.5 text-right text-gray-700">{item.completed_controls}</td>
                          <td className="px-3 py-2.5 text-right text-red-700 font-semibold">{item.failed_controls}</td>
                          <td className="px-3 py-2.5 text-[11px] text-gray-500">
                            {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '\u2014'}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/validation/results/${item.batch_id}`);
                              }}
                              className="px-2.5 py-1 text-[10px] font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
                <div className="flex items-center justify-between px-3 py-3 border-t border-gray-200 mt-2">
                  <span className="text-[11px] text-gray-500">
                    Page {historyPage} of {Math.max(1, Math.ceil((historyData.total || 1) / PAGE_SIZE))}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setHistoryPage((p) => p + 1)}
                      disabled={historyPage >= Math.ceil((historyData.total || 1) / PAGE_SIZE)}
                      className="px-2.5 py-1 text-[11px] rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </ReportCard>

        </>
      )}
    </PageContainer>
  );
}
