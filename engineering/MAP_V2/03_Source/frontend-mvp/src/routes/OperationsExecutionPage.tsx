import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { apiGet, apiPost } from '../utils/apiClient';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { TabBar } from '../components/shared/TabBar';
import { MetricCard } from '../components/shared/MetricCard';
import { ProgressBar } from '../components/shared/ProgressBar';
import { SearchBar } from '../components/shared/SearchBar';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';

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
  
  // Enhanced history state
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

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [tenantId, statusFilter]);

  // Call fetchHistory when filters change (statusFilter, search, sort, page, pageSize)
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSort = (field: SortField) => {
    if (historySort === field) {
      setHistorySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setHistorySort(field);
      setHistorySortDir('desc');
    }
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
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
    if (!tenantId) {
      setError('Please select a tenant');
      return;
    }

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
      if (next.has(stepKey)) {
        next.delete(stepKey);
      } else {
        next.add(stepKey);
      }
      return next;
    });
  };

  const toggleStepSelection = () => {
    if (selectedSteps.size === STEPS.length) {
      setSelectedSteps(new Set());
    } else {
      setSelectedSteps(new Set(STEPS.map(s => s.key)));
    }
  };

  const getStepStatus = (result: RunRecord | null, stepKey: string): string => {
    if (!result?.step_results) return 'PENDING';
    const step = result.step_results.find(s => s.step === stepKey);
    return step ? step.status : 'PENDING';
  };

  const getStepDuration = (result: RunRecord | null, stepKey: string): string => {
    if (!result?.step_results) return '—';
    const step = result.step_results.find(s => s.step === stepKey);
    if (step && step.status !== 'PENDING') {
      return `${step.duration_ms}ms`;
    }
    return '—';
  };

  const isRunActive = isRunning || (runResults && ['RUNNING', 'PENDING'].includes(runResults.status));

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Operations Execution</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Operations Execution</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Run end-to-end validation across connection health, auto-discovery, mapping verification, rule execution, and governance.
      </p>

      {error && (
        <div style={{ padding: 'var(--space-md)', background: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-danger)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-md)' }}>
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
          if (key === 'history' && history.length === 0) {
            fetchHistory();
          }
        }}
      />

      {activeTab === 'execution' && (
        <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
          {/* Left Sidebar: Quick Actions */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{
              background: 'var(--color-surface)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: 'var(--space-md)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Quick Actions</h3>

              <button
                onClick={handleRunNow}
                disabled={isRunActive || !tenantId}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: isRunActive ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: isRunActive || !tenantId ? 'not-allowed' : 'pointer',
                  marginBottom: 'var(--space-sm)',
                  fontWeight: 600,
                }}
              >
                {isRunActive ? 'Running...' : 'Run End-to-End Validation'}
              </button>

              <button
                onClick={() => setIsConfiguring(!isConfiguring)}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-secondary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  marginBottom: isConfiguring ? 'var(--space-md)' : '0',
                  fontWeight: 600,
                }}
              >
                {isConfiguring ? '▼ Configuring' : '▶ Configure Steps'}
              </button>

              {isConfiguring && (
                <div style={{ animation: 'fadeIn 0.2s ease-in' }}>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--space-xs)' }}>
                    Steps to Execute
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                    <button
                      onClick={toggleStepSelection}
                      style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-surface)', cursor: 'pointer' }}
                    >
                      {selectedSteps.size === STEPS.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {STEPS.map(step => (
                      <label key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                        <input
                          type="checkbox"
                          checked={selectedSteps.has(step.key)}
                          onChange={() => handleToggleStep(step.key)}
                          style={{ pointerEvents: 'none' }}
                        />
                        <span style={{ fontSize: 'var(--font-size-xs)' }}>{step.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentRunId && (
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Current Run</h4>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    {currentRunId.slice(0, 8)}...
                  </p>
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div style={{
                background: 'var(--color-surface)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-md)',
                marginTop: 'var(--space-md)',
              }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Recent Runs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.slice(0, 5).map(run => (
                    <div key={run.run_id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', cursor: 'pointer' }} onClick={() => setRunResults(run)}>
                      <StatusBadge status={run.status} size="sm" />
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        {run.tenant_id.slice(0, 8)}... • {run.started_at}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content: Step Results */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <CascadeDropdowns showTenant={true} showProject={true} showBatch={false} />
            </div>

            <div style={{
              background: 'var(--color-surface)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              {STEPS.map(step => {
                const status = getStepStatus(runResults, step.key);
                const isExpanded = true; // Always show all steps for now

                return (
                  <div key={step.key} style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}>
                    <div style={{
                      padding: 'var(--space-md)',
                      background: status === 'PASSED' ? 'rgba(40, 167, 69, 0.05)' : status === 'FAILED' ? 'rgba(220, 53, 69, 0.05)' : status === 'RUNNING' ? 'rgba(255, 193, 7, 0.05)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: status === 'PASSED' ? 'var(--color-success)' : status === 'FAILED' ? 'var(--color-danger)' : status === 'RUNNING' ? 'var(--color-warning)' : 'var(--color-border)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 600
                        }}>
                          {STEPS.findIndex(s => s.key === step.key) + 1}
                        </div>
                        <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{step.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{getStepDuration(runResults, step.key)}</span>
                        <StatusBadge status={status} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {runResults && runResults.status === 'COMPLETED' && (
              <div style={{
                background: 'var(--color-surface)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-md)',
                marginTop: 'var(--space-md)',
              }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Run Summary</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>
                  Run ID: <code>{runResults.run_id}</code>
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>
                  Duration: {runResults.duration_ms ? `${Math.round(runResults.duration_ms / 1000)}s` : '—'}
                </p>
                {runResults.error_message && (
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>
                    Error: {runResults.error_message}
                  </p>
                )}
              </div>
            )}

            {!runResults && !isRunning && (
              <EmptyState
                title="Ready to Run"
                description="Select a tenant and project, then click 'Run End-to-End Validation' to start."
                icon="🚀"
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Run History</h2>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <button
                onClick={() => { fetchHistory(); fetchBreakdown(); }}
                disabled={historyLoading}
                style={{
                  padding: 'var(--space-xs) var(--space-md)',
                  background: 'var(--color-secondary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                {historyLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {historyLoading && (
            <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <LoadingSkeleton variant="table" rows={5} />
            </div>
          )}

          {!breakdownLoading && breakdown && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <MetricCard title="Total Runs" value={breakdown.total} color="var(--color-text)" />
              <MetricCard title="Completed" value={breakdown.breakdown?.COMPLETED || 0} color="var(--color-success)" />
              <MetricCard title="Failed" value={breakdown.breakdown?.FAILED || 0} color="var(--color-danger)" />
              <MetricCard title="Running" value={breakdown.breakdown?.RUNNING || 0} color="var(--color-warning)" />
            </div>
          )}

          {!breakdownLoading && breakdown && (
            <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Status Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>COMPLETED</span>
                    <span style={{ color: 'var(--color-success)' }}>{breakdown.breakdown?.COMPLETED || 0}</span>
                  </div>
                  <ProgressBar value={breakdown.breakdown?.COMPLETED || 0} max={Math.max(breakdown.total, 1)} color="var(--color-success)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>FAILED</span>
                    <span style={{ color: 'var(--color-danger)' }}>{breakdown.breakdown?.FAILED || 0}</span>
                  </div>
                  <ProgressBar value={breakdown.breakdown?.FAILED || 0} max={Math.max(breakdown.total, 1)} color="var(--color-danger)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>RUNNING</span>
                    <span style={{ color: 'var(--color-warning)' }}>{breakdown.breakdown?.RUNNING || 0}</span>
                  </div>
                  <ProgressBar value={breakdown.breakdown?.RUNNING || 0} max={Math.max(breakdown.total, 1)} color="var(--color-warning)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>PENDING</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{breakdown.breakdown?.PENDING || 0}</span>
                  </div>
                  <ProgressBar value={breakdown.breakdown?.PENDING || 0} max={Math.max(breakdown.total, 1)} color="var(--color-text-secondary)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>CANCELLED</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{breakdown.breakdown?.CANCELLED || 0}</span>
                  </div>
                  <ProgressBar value={breakdown.breakdown?.CANCELLED || 0} max={Math.max(breakdown.total, 1)} color="var(--color-text-secondary)" height={12} />
                </div>
              </div>
            </div>
          )}

          <div style={{
            padding: 'var(--space-md)',
            background: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            marginBottom: 'var(--space-md)',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
              <CascadeDropdowns showTenant={true} showProject={true} showBatch={false} />
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by run ID, tenant, project, status..."
                style={{ flex: 1, minWidth: '200px' }}
              />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-sm)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  minWidth: '140px',
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-sm)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!historyLoading && history.length === 0 && (
            <EmptyState
              title="No Runs Yet"
              description="No end-to-end validation runs have been performed."
            />
          )}

          {!historyLoading && history.length > 0 && (
            <>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                Showing {history.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, historyTotal)} of {historyTotal} runs
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead>
                    <tr>
                      {SORT_FIELDS.map((field) => (
                        <th
                          key={field.key}
                          onClick={() => handleSort(field.key)}
                          style={{
                            textAlign: 'left',
                            padding: 'var(--space-sm) var(--space-md)',
                            color: 'var(--color-text)',
                            fontWeight: 700,
                            fontSize: 'var(--font-size-xs)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            background: 'var(--color-bg-secondary)',
                            borderBottom: '2px solid var(--color-border)',
                            whiteSpace: 'nowrap' as const,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {field.label}
                            {historySort === field.key && (
                              <span>{historySortDir === 'asc' ? '▲' : '▼'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(run => (
                      <tr key={run.run_id} style={{ cursor: 'pointer' }} onClick={() => { setRunResults(run as any); setActiveTab('execution'); }}>
                        <td style={{ padding: 'var(--space-sm)', verticalAlign: 'top' }}>
                          <StatusBadge status={run.status} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', verticalAlign: 'top' }}>
                          {run.run_id.slice(0, 8)}...
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', verticalAlign: 'top' }}>
                          {run.tenant_id.slice(0, 8)}...
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', verticalAlign: 'top' }}>
                          {run.project_id ? run.project_id.slice(0, 8) + '...' : '—'}
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', verticalAlign: 'top' }}>
                          {new Date(run.started_at).toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', verticalAlign: 'top' }}>
                          {run.completed_at ? new Date(run.completed_at).toLocaleString() : '—'}
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', verticalAlign: 'top' }}>
                          {run.duration_ms ? `${Math.round(run.duration_ms / 1000)}s` : '—'}
                        </td>
                        <td style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', verticalAlign: 'top', color: 'var(--color-text-secondary)' }}>
                          {run.step_results ? run.step_results.map(s => {
                            const labels: Record<string, string> = {
                              'health_check': 'Connection Health Check',
                              'auto_discovery': 'Auto Discovery',
                              'mapping_verification': 'Mapping Verification',
                              'rule_execution': 'Rule Execution',
                              'full_map_validation': 'Full MAP Validation',
                            };
                            return labels[s.step] || s.step;
                          }).join(', ') : '—'}
                        </td>
                        <td style={{ padding: 'var(--space-sm)', verticalAlign: 'top' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReExecute(run.run_id); }}
                            style={{
                              padding: 'var(--space-xs) var(--space-sm)',
                              background: 'var(--color-primary)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                              fontSize: 'var(--font-size-xs)',
                              fontWeight: 500,
                            }}
                          >
                            Re-run
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Page {page} of {Math.ceil(historyTotal / pageSize) || 1}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    style={{
                      padding: 'var(--space-xs) var(--space-md)',
                      background: page <= 1 ? 'var(--color-bg-secondary)' : 'var(--color-secondary)',
                      color: page <= 1 ? 'var(--color-text-secondary)' : '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(Math.ceil(historyTotal / pageSize) || 1, p + 1))}
                    disabled={page >= Math.ceil(historyTotal / pageSize) || 1}
                    style={{
                      padding: 'var(--space-xs) var(--space-md)',
                      background: page >= Math.ceil(historyTotal / pageSize) || 1 ? 'var(--color-bg-secondary)' : 'var(--color-secondary)',
                      color: page >= Math.ceil(historyTotal / pageSize) || 1 ? 'var(--color-text-secondary)' : '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: page >= Math.ceil(historyTotal / pageSize) || 1 ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
