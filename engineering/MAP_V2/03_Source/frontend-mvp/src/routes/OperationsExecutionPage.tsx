import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { apiGet, apiPost } from '../utils/apiClient';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { TabBar } from '../components/shared/TabBar';
import { SearchBar } from '../components/shared/SearchBar';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Pagination } from '../components/shared/Pagination';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';

const STEPS = [
  { key: 'health_check', label: 'Connection Health Check' },
  { key: 'auto_discovery', label: 'Auto Discovery' },
  { key: 'mapping_verification', label: 'Mapping Verification' },
  { key: 'rule_execution', label: 'Rule Execution' },
  { key: 'full_map_validation', label: 'Full MAP Validation' },
];

interface StepResult {
  step: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED' | string;
  details: unknown;
  duration_ms: number;
  error: string | null;
}

interface RunRecord {
  run_id: string;
  tenant_id: string;
  project_id: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  started_by: string;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  step_results: StepResult[];
  error_message: string | null;
}

interface HistoryItem {
  run_id: string;
  tenant_id: string;
  project_id: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  step_results?: StepResult[];
}

interface StatusBreakdown {
  breakdown: Record<string, number>;
  total: number;
  today_breakdown: { completed: number; scheduled: number };
}

type SortField = 'run_id' | 'tenant_id' | 'project_id' | 'status' | 'started_at' | 'completed_at' | 'duration_ms' | 'execution_type';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const STATUS_OPTIONS = ['all', 'COMPLETED', 'FAILED', 'RUNNING', 'PENDING', 'CANCELLED'];
const SORT_FIELDS: { key: SortField; label: string }[] = [
  { key: 'status', label: 'Status' },
  { key: 'run_id', label: 'Run ID' },
  { key: 'tenant_id', label: 'Tenant' },
  { key: 'project_id', label: 'Project' },
  { key: 'started_at', label: 'Started' },
  { key: 'completed_at', label: 'Completed' },
  { key: 'duration_ms', label: 'Duration (ms)' },
  { key: 'execution_type', label: 'Execution Type' },
];

type TabKey = 'execution' | 'history';

const STEP_STATUS_BG: Record<string, string> = {
  PASSED: 'bg-green-50',
  FAILED: 'bg-red-50',
  RUNNING: 'bg-yellow-50',
};

const STEP_STATUS_CIRCLE: Record<string, string> = {
  PASSED: 'bg-green-500',
  FAILED: 'bg-red-500',
  RUNNING: 'bg-yellow-500',
};

const BREAKDOWN_BAR_COLOR: Record<string, string> = {
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
  RUNNING: 'bg-yellow-500',
  PENDING: 'bg-gray-400',
  CANCELLED: 'bg-gray-300',
};

const BREAKDOWN_TEXT_COLOR: Record<string, string> = {
  COMPLETED: 'text-green-600',
  FAILED: 'text-red-600',
  RUNNING: 'text-yellow-600',
  PENDING: 'text-gray-500',
  CANCELLED: 'text-gray-500',
};

const STEP_LABELS: Record<string, string> = {
  health_check: 'Connection Health Check',
  auto_discovery: 'Auto Discovery',
  mapping_verification: 'Mapping Verification',
  rule_execution: 'Rule Execution',
  full_map_validation: 'Full MAP Validation',
};

export function OperationsExecutionPage() {
  const { userRoles } = useAuth();
  const { tenantId, projectId, setTenantId, setProjectId, reset } = useValidationFilter();

  const [activeTab, setActiveTab] = useState<TabKey>('execution');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(new Set(STEPS.map(s => s.key)));
  const [selectedControls, setSelectedControls] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [runResults, setRunResults] = useState<RunRecord | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [historySort, setHistorySort] = useState<SortField>('started_at');
  const [historySortDir, setHistorySortDir] = useState<SortDir>('desc');
  const [breakdown, setBreakdown] = useState<StatusBreakdown | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(true);
  const [historyTotal, setHistoryTotal] = useState(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        page_size: pageSize,
      };
      if (tenantId) params.tenant_id = tenantId;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      params.sort_by = historySort;
      params.sort_dir = historySortDir;

      const result = await apiGet<{ items: HistoryItem[]; total: number }>('/operations/runs', params);
      setHistory(result.items || []);
      setHistoryTotal(result.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load run history');
    } finally {
      setHistoryLoading(false);
    }
  }, [tenantId, page, pageSize, statusFilter, debouncedSearch, historySort, historySortDir]);

  const fetchBreakdown = useCallback(async () => {
    setBreakdownLoading(true);
    try {
      const tenantParam = tenantId ? `?tenant_id=${tenantId}` : '';
      const result = await apiGet<StatusBreakdown>(`/operations/runs/status-breakdown${tenantParam}`);
      setBreakdown(result);
    } catch {
      setBreakdown(null);
    } finally {
      setBreakdownLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchBreakdown(); }, [fetchBreakdown]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [tenantId, statusFilter]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSort = (field: SortField) => {
    if (historySort === field) {
      setHistorySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setHistorySort(field);
      setHistorySortDir('desc');
    }
    setPage(1);
  };

  const handleReExecute = async (runId: string) => {
    setError(null);
    try {
      await apiPost(`/operations/run/${runId}/re-execute`, {});
      fetchHistory();
      fetchBreakdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-execute run');
    }
  };

  const pollRunStatus = useCallback(async (runId: string) => {
    try {
      const result = await apiGet<RunRecord>(`/operations/run/${runId}`);
      setRunResults(result);
      if (result.status === 'RUNNING' || result.status === 'PENDING') {
        setTimeout(() => pollRunStatus(runId), 2000);
      } else {
        setIsRunning(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch run status');
      setIsRunning(false);
    }
  }, []);

  const handleRunNow = async () => {
    if (!tenantId) { setError('Please select a tenant'); return; }
    setIsRunning(true);
    setError(null);
    try {
      const steps = Array.from(selectedSteps);
      const response = await apiPost<{ run_id: string }>(
        '/operations/run',
        {
          tenant_id: tenantId,
          project_id: projectId || undefined,
          steps: steps.length > 0 ? steps : undefined,
          controls: selectedControls.length > 0 ? selectedControls : undefined,
        }
      );
      setCurrentRunId(response.run_id);
      pollRunStatus(response.run_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start run');
      setIsRunning(false);
    }
  };

  const handleToggleStep = (stepKey: string) => {
    setSelectedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  const toggleStepSelection = () => {
    if (selectedSteps.size === STEPS.length) setSelectedSteps(new Set());
    else setSelectedSteps(new Set(STEPS.map(s => s.key)));
  };

  const getStepStatus = (result: RunRecord | null, stepKey: string): string => {
    if (!result?.step_results) return 'PENDING';
    const step = result.step_results.find(s => s.step === stepKey);
    return step ? step.status : 'PENDING';
  };

  const getStepDuration = (result: RunRecord | null, stepKey: string): string => {
    if (!result?.step_results) return '—';
    const step = result.step_results.find(s => s.step === stepKey);
    if (step && step.status !== 'PENDING') return `${step.duration_ms}ms`;
    return '—';
  };

  const isRunActive = isRunning || (runResults && ['RUNNING', 'PENDING'].includes(runResults.status));

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Operations Execution</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Operations Execution</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Run end-to-end validation across connection health, auto-discovery, mapping verification, rule execution, and governance.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <TabBar
        tabs={[
          { key: 'execution', label: 'End-to-End Execution' },
          { key: 'history', label: 'Run History' },
        ]}
        activeTab={activeTab}
        onTabChange={(key) => {
          setActiveTab(key as TabKey);
          if (key === 'history' && history.length === 0) fetchHistory();
        }}
      />

      {activeTab === 'execution' && (
        <div className="flex gap-6 mt-4">
          <div className="w-[260px] flex-shrink-0">
            <ReportCard title="Quick Actions">
              <button
                onClick={handleRunNow}
                disabled={isRunActive || !tenantId}
                className={`w-full py-2 px-3 text-sm font-semibold rounded-md mb-2 ${
                  isRunActive || !tenantId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {isRunActive ? 'Running...' : 'Run End-to-End Validation'}
              </button>

              <button
                onClick={() => setIsConfiguring(!isConfiguring)}
                className={`w-full py-2 px-3 text-sm font-semibold rounded-md bg-gray-600 text-white hover:bg-gray-700 cursor-pointer ${isConfiguring ? 'mb-3' : ''}`}
              >
                {isConfiguring ? '\u25BC Configuring' : '\u25B6 Configure Steps'}
              </button>

              {isConfiguring && (
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Steps to Execute</label>
                  <div className="flex justify-between mb-1">
                    <button onClick={toggleStepSelection} className="text-[10px] px-2 py-0.5 border border-gray-200 rounded bg-white cursor-pointer hover:bg-gray-50">
                      {selectedSteps.size === STEPS.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {STEPS.map(step => (
                      <label key={step.key} className="flex items-center gap-1.5 cursor-pointer text-[10px]">
                        <input type="checkbox" checked={selectedSteps.has(step.key)} onChange={() => handleToggleStep(step.key)} className="pointer-events-none" />
                        <span>{step.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentRunId && (
                <div className="mt-3">
                  <h4 className="text-[10px] font-semibold text-gray-500 mb-1">Current Run</h4>
                  <p className="text-[10px] text-gray-500 break-all">{currentRunId.slice(0, 8)}...</p>
                </div>
              )}
            </ReportCard>

            {history.length > 0 && (
              <ReportCard title="Recent Runs" className="mt-4">
                <div className="flex flex-col gap-2">
                  {history.slice(0, 5).map(run => (
                    <div key={run.run_id} className="border-b border-gray-100 pb-2 cursor-pointer hover:bg-gray-50 rounded px-1" onClick={() => setRunResults(run)}>
                      <StatusPill status={run.status} />
                      <p className="text-[10px] text-gray-500 mt-1">
                        {run.tenant_id.slice(0, 8)}... · {run.started_at}
                      </p>
                    </div>
                  ))}
                </div>
              </ReportCard>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <CascadeDropdowns showTenant={true} showProject={true} showBatch={false} />
            </div>

            <ReportCard title="Step Results">
              {STEPS.map(step => {
                const status = getStepStatus(runResults, step.key);
                return (
                  <div key={step.key} className="border-b border-gray-100 last:border-b-0">
                    <div className={`flex items-center justify-between px-4 py-3 ${STEP_STATUS_BG[status] || ''}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${STEP_STATUS_CIRCLE[status] || 'bg-gray-300'}`}>
                          {STEPS.findIndex(s => s.key === step.key) + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{step.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">{getStepDuration(runResults, step.key)}</span>
                        <StatusPill status={status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </ReportCard>

            {runResults && runResults.status === 'COMPLETED' && (
              <ReportCard title="Run Summary" className="mt-4">
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Run ID: <code className="text-xs bg-gray-100 px-1 rounded">{runResults.run_id}</code></p>
                  <p>Duration: {runResults.duration_ms ? `${Math.round(runResults.duration_ms / 1000)}s` : '—'}</p>
                  {runResults.error_message && <p className="text-red-600">Error: {runResults.error_message}</p>}
                </div>
              </ReportCard>
            )}

            {!runResults && !isRunning && (
              <EmptyState title="Ready to Run" description="Select a tenant and project, then click 'Run End-to-End Validation' to start." icon="🚀" />
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Run History</h2>
            <button onClick={() => { fetchHistory(); fetchBreakdown(); }} disabled={historyLoading} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50">
              {historyLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {historyLoading && <LoadingSkeleton variant="table" rows={5} />}

          {!breakdownLoading && breakdown && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KpiBox label="Total Runs" value={breakdown.total} tone="neutral" />
              <KpiBox label="Completed" value={breakdown.breakdown?.COMPLETED || 0} tone="success" />
              <KpiBox label="Failed" value={breakdown.breakdown?.FAILED || 0} tone="error" />
              <KpiBox label="Running" value={breakdown.breakdown?.RUNNING || 0} tone="warning" />
            </div>
          )}

          {!breakdownLoading && breakdown && (
            <ReportCard title="Status Distribution" className="mb-6">
              <div className="flex flex-col gap-4">
                {['COMPLETED', 'FAILED', 'RUNNING', 'PENDING', 'CANCELLED'].map((status) => {
                  const count = breakdown.breakdown?.[status] || 0;
                  const pct = breakdown.total > 0 ? (count / breakdown.total) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700">{status}</span>
                        <span className={BREAKDOWN_TEXT_COLOR[status] || 'text-gray-500'}>{count}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${BREAKDOWN_BAR_COLOR[status] || 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ReportCard>
          )}

          <ReportCard title="Runs" className="mb-4">
            <div className="flex gap-3 items-center flex-wrap">
              <CascadeDropdowns showTenant={true} showProject={true} showBatch={false} />
              <div className="flex-1 min-w-[200px]">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by run ID, tenant, project, status..." />
              </div>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white text-gray-700 min-w-[140px]">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
              </select>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white text-gray-700">
                {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size} rows</option>)}
              </select>
            </div>
          </ReportCard>

          {!historyLoading && history.length === 0 && (
            <EmptyState title="No Runs Yet" description="No end-to-end validation runs have been performed." />
          )}

          {!historyLoading && history.length > 0 && (
            <>
              <div className="text-xs text-gray-500 mb-2">
                Showing {history.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, historyTotal)} of {historyTotal} runs
              </div>
              <ReportCard title="">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" aria-label="Run history">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        {SORT_FIELDS.map((field) => (
                          <th
                            key={field.key}
                            onClick={() => handleSort(field.key)}
                            className="text-left px-3 py-2 text-xs font-bold text-gray-700 cursor-pointer select-none whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              {field.label}
                              {historySort === field.key && <span>{historySortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>}
                            </div>
                          </th>
                        ))}
                        <th className="text-left px-3 py-2 text-xs font-bold text-gray-700 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(run => (
                        <tr key={run.run_id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => { setRunResults(run as any); setActiveTab('execution'); }}>
                          <td className="px-3 py-2 align-top"><StatusPill status={run.status} /></td>
                          <td className="px-3 py-2 font-mono text-[10px] text-gray-700 align-top">{run.run_id.slice(0, 8)}...</td>
                          <td className="px-3 py-2 text-[10px] text-gray-500 align-top">{run.tenant_id.slice(0, 8)}...</td>
                          <td className="px-3 py-2 text-[10px] text-gray-500 align-top">{run.project_id ? run.project_id.slice(0, 8) + '...' : '—'}</td>
                          <td className="px-3 py-2 text-[10px] text-gray-500 align-top">{new Date(run.started_at).toLocaleString()}</td>
                          <td className="px-3 py-2 text-[10px] text-gray-500 align-top">{run.completed_at ? new Date(run.completed_at).toLocaleString() : '—'}</td>
                          <td className="px-3 py-2 text-[10px] align-top">{run.duration_ms ? `${Math.round(run.duration_ms / 1000)}s` : '—'}</td>
                          <td className="px-3 py-2 text-[10px] align-top text-gray-500">
                            {run.step_results ? run.step_results.map(s => STEP_LABELS[s.step] || s.step).join(', ') : '—'}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleReExecute(run.run_id); }}
                              className="px-2 py-1 text-[10px] font-medium text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
                            >
                              Re-run
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ReportCard>
              <div className="flex justify-end items-center mt-4">
                <Pagination page={page} pageSize={pageSize} total={historyTotal} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
}
