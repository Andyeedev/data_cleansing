import { useState, useEffect, useRef } from 'react';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPost } from '../utils/apiClient';
import { TabBar } from '../components/shared/TabBar';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { Modal } from '../components/shared/Modal';
import { toastService } from '../components/shared/Toast';
import { useMigrationTenants, useMigrationProjects } from '../hooks/useMigration';

interface StatusBreakdown {
  breakdown: Record<string, number>;
  total: number;
  unscored: number;
  today_breakdown: Record<string, number>;
}

type Tab = 'execution' | 'history';
type SortField = 'batch_id' | 'batch_status' | 'total_controls' | 'completed_controls' | 'failed_controls' | 'batch_start_time';
type SortDir = 'asc' | 'desc';

const tabs = [
  { key: 'execution', label: 'Execution' },
  { key: 'history', label: 'History' },
];

const PAGE_SIZE_OPTIONS = [10, 50, 100];
const STATUS_OPTIONS = ['all', 'COMPLETED', 'RUNNING', 'FAILED'];

export function MigrationPage() {
  const { userRoles } = useAuth();
  const { items: historyItems, total, page: _page, pageSize, loading: historyLoading, error: historyError, fetchHistory } = useExecutionHistory();
  const { tenants: allTenants, loading: tenantsLoading } = useMigrationTenants();
  const [confirmTenantIdInternal, setConfirmTenantId] = useState('');
  const { projects: tenantProjects } = useMigrationProjects(undefined, confirmTenantIdInternal);

  const [activeTab, setActiveTab] = useState<Tab>('execution');
  const [runError, setRunError] = useState<string | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown | null>(null);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmProjectId, setConfirmProjectId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [executionMode, setExecutionMode] = useState<'full' | 'quick'>('full');
  const [modalError, setModalError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const [historySearch, setHistorySearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setHistorySearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setServerPage(1);
    }, 300);
  };
  const [historySort, setHistorySort] = useState<SortField>('batch_start_time');
  const [historySortDir, setHistorySortDir] = useState<SortDir>('desc');
  const [serverPage, setServerPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const statusParam = statusFilter === 'all' ? undefined : statusFilter;
    const sortDirParam = historySortDir === 'asc' ? 'asc' : 'desc';
    fetchHistory(serverPage, selectedTenant || undefined, historyPageSize, statusParam, debouncedSearch || undefined, historySort, sortDirParam);
    const statusBreakdownParam = selectedTenant ? `?tenant_id=${selectedTenant}&time_range=week` : `?time_range=week`;
    apiGet<StatusBreakdown>(`/execution/history/status-breakdown${statusBreakdownParam}`)
      .then((data) => setStatusBreakdown(data))
      .catch(() => setStatusBreakdown(null));
  }, [selectedTenant, serverPage, historyPageSize, statusFilter, debouncedSearch, historySort, historySortDir, fetchHistory]);

  const handleStartExecution = async () => {
    setRunError(null);
    setModalError(null);

    const projectId = selectedProjectId || confirmProjectId;
    if (!projectId) {
      setModalError('Please select a project or enter a project ID');
      return;
    }

    setRunning(true);
    try {
      const schedules = await apiGet<{ items: Array<{ schedule_id: string; project_id: string }> }>('/migration/schedules', { project_id: projectId, limit: 1 });
      const schedule = schedules?.items?.[0];

      if (!schedule) {
        setModalError('No schedule found for this project. Please create a schedule first via Migration > Schedules.');
        setRunning(false);
        return;
      }

      const result = await apiPost<{ execution_id: string; status: string; duration?: number; error?: string }>(`/migration/schedules/${schedule.schedule_id}/run`);

      if (result.status === 'failed' || result.error) {
        setModalError(`Migration failed: ${result.error || result.status}`);
        toastService.error(`Migration failed: ${result.error || result.status}`);
      } else {
        toastService.success(`Migration completed for project "${projectId}" (${result.duration || 0}s)`);
        setShowConfirmModal(false);
        fetchHistory(serverPage, selectedTenant || undefined, historyPageSize, statusFilter === 'all' ? undefined : statusFilter, debouncedSearch || undefined, historySort, historySortDir === 'asc' ? 'asc' : 'desc');
        const statusBreakdownParam = selectedTenant ? `?tenant_id=${selectedTenant}` : '';
        apiGet<StatusBreakdown>('/execution/history/status-breakdown' + statusBreakdownParam)
          .then((data) => setStatusBreakdown(data))
          .catch(() => setStatusBreakdown(null));
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.detail || err?.response?.error || 'Failed to run migration';
      setModalError(msg);
      toastService.error(msg);
    } finally {
      setRunning(false);
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Migration</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const breakdown = statusBreakdown?.breakdown ?? {};
  const todayBreakdown = statusBreakdown?.today_breakdown ?? {};
  const completedPct = statusBreakdown && statusBreakdown.total > 0 ? (breakdown.COMPLETED || 0) / statusBreakdown.total * 100 : 0;
  const runningPct = statusBreakdown && statusBreakdown.total > 0 ? (breakdown.RUNNING || 0) / statusBreakdown.total * 100 : 0;
  const donutGradient = statusBreakdown
    ? `conic-gradient(var(--color-success, #22c55e) 0% ${completedPct}%, var(--color-warning, #f59e0b) ${completedPct}% ${completedPct + runningPct}%, var(--color-error, #ef4444) ${completedPct + runningPct}% 100%)`
    : 'none';

  const startBtnBg = running ? 'var(--color-bg-secondary)' : 'rgba(34, 197, 94, 0.1)';
  const startBtnColor = running ? 'var(--color-text-secondary)' : 'var(--color-success)';
  const startBtnBorder = running ? 'var(--color-border)' : 'rgba(34, 197, 94, 0.3)';
  const startBtnCursor = running ? 'not-allowed' : 'pointer';

  const handleHistorySort = (field: SortField) => {
    if (historySort === field) {
      setHistorySortDir(historySortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setHistorySort(field);
      setHistorySortDir('desc');
    }
    setServerPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  const thStyle = { textAlign: 'left' as const, padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none' as const, background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };

  const selectStyle = { padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' };

  const paginationRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' };

  const paginationStyle = { display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' };

  const paginationBtnStyle = (disabled: boolean) => ({ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: disabled ? 0.5 : 1 });

  const historyStart = historyItems.length > 0 ? (serverPage - 1) * historyPageSize + 1 : 0;
  const historyEnd = Math.min(serverPage * historyPageSize, total);

  const handleTenantChange = (v: string) => {
    setSelectedTenant(v);
    setServerPage(1);
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Migration</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Execute migration runs, monitor progress, and review past executions.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as Tab)} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <TenantFilter selectedTenant={selectedTenant} onChange={handleTenantChange} />
        </div>
      </div>

      {(runError) && <ErrorState message={runError || ''} onRetry={() => { setRunError(null); }} />}

      {activeTab === 'execution' && (
        <>
          {statusBreakdown && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              marginBottom: 'var(--space-lg)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>Execution Overview</h3>

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 100, flex: 1, minHeight: 70 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Running Today</p>
                  <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                    {todayBreakdown.running || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 100, flex: 1, minHeight: 70 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Completed Today</p>
                  <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                    {todayBreakdown.completed || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 100, flex: 1, minHeight: 70 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Failed Today</p>
                  <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
                    {todayBreakdown.failed || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 100, flex: 1, minHeight: 70 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Scheduled Today</p>
                  <p style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
                    {todayBreakdown.scheduled || 0}
                  </p>
                </div>
              </div>

              <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>Last 7 Days</h4>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', minWidth: 90, flex: 1 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Running</p>
                  <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, color: 'var(--color-warning)' }}>
                    {breakdown.RUNNING || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', minWidth: 90, flex: 1 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Completed</p>
                  <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, color: 'var(--color-success)' }}>
                    {breakdown.COMPLETED || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', minWidth: 90, flex: 1 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Failed</p>
                  <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, color: 'var(--color-danger)' }}>
                    {breakdown.FAILED || 0}
                  </p>
                </div>
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', minWidth: 90, flex: 1 }}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Total</p>
                  <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, color: 'var(--color-info)' }}>
                    {statusBreakdown.total || 0}
                  </p>
                </div>
              </div>

              {historyItems.slice(0, 10).length > 0 && (
                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>Execution Queue (Last 10 runs)</h4>
                  <div style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                      <tbody>
                        {historyItems.slice(0, 10).map((item) => (
                          <tr key={item.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{item.batch_id.slice(0, 8)}...</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={item.batch_status || 'UNKNOWN'} size="sm" />
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              {item.total_controls ? `${item.completed_controls ?? 0}/${item.total_controls}` : '—'}
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                              {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <button
                onClick={() => { setModalError(null); setShowConfirmModal(true); }}
              disabled={running}
              aria-label={running ? 'Starting migration...' : 'Start Migration'}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                background: startBtnBg,
                color: startBtnColor,
                border: `1px solid ${startBtnBorder}`,
                borderRadius: 'var(--radius)',
                cursor: startBtnCursor,
                fontSize: 'var(--font-size-base)',
                fontWeight: 500,
              }}
            >
              {running ? 'Starting...' : 'Start Migration ▼'}
            </button>
            <button
              onClick={() => {}}
              disabled={!running}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-danger)',
                border: `1px solid var(--color-border)`,
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
                fontWeight: 500,
                opacity: !running ? 0.5 : 1,
              }}
            >
              Stop All
            </button>
          </div>

          <Modal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title="Start Migration"
          >
            <div style={{ fontSize: 'var(--font-size-sm)' }}>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Tenant
                </label>
                 <select
                  value={confirmTenantIdInternal}
                  onChange={(e) => { setConfirmTenantId(e.target.value); setSelectedProjectId(''); setModalError(null); }}
                  style={{ ...selectStyle, width: '100%' }}
                  disabled={tenantsLoading}
                >
                  <option value="">All Tenants</option>
                  {allTenants.map((t) => (
                    <option key={t.tenant_id} value={t.tenant_id}>{t.tenant_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => { setSelectedProjectId(e.target.value); setConfirmProjectId(''); setModalError(null); }}
                  style={{ ...selectStyle, width: '100%' }}
                  disabled={!confirmTenantIdInternal}
                >
                  <option value="">Select a tenant first</option>
                  {tenantProjects.map((p) => (
                    <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Project ID (manual)
                </label>
                <input
                  type="text"
                  value={confirmProjectId}
                  onChange={(e) => { setConfirmProjectId(e.target.value); setSelectedProjectId(''); setModalError(null); }}
                  placeholder="Or enter project ID manually"
                  style={{ ...selectStyle, width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Execution Mode
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <input
                      type="radio"
                      name="executionMode"
                      value="full"
                      checked={executionMode === 'full'}
                      onChange={(e) => setExecutionMode(e.target.value as 'full' | 'quick')}
                    />
                    <span>Full Validation (Recommended)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <input
                      type="radio"
                      name="executionMode"
                      value="quick"
                      checked={executionMode === 'quick'}
                      onChange={(e) => setExecutionMode(e.target.value as 'full' | 'quick')}
                    />
                    <span>Quick Health Check</span>
                  </label>
                </div>
              </div>

              <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Current Status:
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)' }}>
                  • {breakdown.RUNNING || 0} Running (7d) | {breakdown.COMPLETED || 0} Completed (7d) | {breakdown.FAILED || 0} Failed (7d)
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                  Estimated time: ~5 minutes
                </p>
              </div>

              {modalError && (
                <div style={{ 
                  padding: 'var(--space-md)', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-danger)',
                  marginTop: 'var(--space-md)'
                }}>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>
                    {modalError}
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: 'var(--space-sm) var(--space-lg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartExecution}
                disabled={running || (!selectedProjectId && !confirmProjectId)}
                style={{ 
                  padding: 'var(--space-sm) var(--space-lg)', 
                  border: 'none', 
                  borderRadius: 'var(--radius)', 
                  background: (!selectedProjectId && !confirmProjectId) ? 'var(--color-bg-secondary)' : 'var(--color-primary)', 
                  color: (!selectedProjectId && !confirmProjectId) ? 'var(--color-text-secondary)' : 'var(--color-text-inverse)', 
                  cursor: (!selectedProjectId && !confirmProjectId) ? 'not-allowed' : 'pointer', 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 500,
                  opacity: (!selectedProjectId && !confirmProjectId) ? 0.5 : 1
                }}
              >
                Start Execution
              </button>
            </div>
          </Modal>
        </>
      )}

      {activeTab === 'history' && (
        <>
          {historyError && <ErrorState message={historyError} />}

          {historyLoading && <LoadingSkeleton rows={5} variant="table" />}

          {!historyLoading && historyItems.length === 0 && (
            <EmptyState title="No executions yet" description="Start a migration to see execution history." />
          )}

          {!historyLoading && historyItems.length > 0 && (
            <div>
              {statusBreakdown && (
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  marginBottom: 'var(--space-lg)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    position: 'relative',
                    flexShrink: 0,
                    background: donutGradient,
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'var(--color-background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}>
                      <span style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                        {statusBreakdown.total}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        Total
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', flex: 1 }}>
                    <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 120 }}>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Completed</p>
                      <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                        {breakdown.COMPLETED || 0}
                      </p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {statusBreakdown.total > 0 ? ((breakdown.COMPLETED || 0) / statusBreakdown.total * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 120 }}>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Running</p>
                      <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                        {breakdown.RUNNING || 0}
                      </p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {statusBreakdown.total > 0 ? ((breakdown.RUNNING || 0) / statusBreakdown.total * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 120 }}>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-xs)' }}>Failed</p>
                      <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-error)' }}>
                        {breakdown.FAILED || 0}
                      </p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {statusBreakdown.total > 0 ? ((breakdown.FAILED || 0) / statusBreakdown.total * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {statusBreakdown && statusBreakdown.unscored > 0 && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
                  {statusBreakdown.unscored} batches have no score data
                </p>
              )}

              {!historyLoading && historyItems.length > 0 && (
                <div style={{
                  fontWeight: 600,
                  fontSize: 'var(--font-size-h4)',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  Execution History ({total} total)
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <SearchBar value={historySearch} onChange={handleSearchChange} placeholder="Search by batch ID, status, or project..." />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setServerPage(1); }}
                  style={selectStyle}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
                  ))}
                </select>
                <select
                  value={historyPageSize}
                  onChange={(e) => { setHistoryPageSize(Number(e.target.value)); setServerPage(1); }}
                  style={selectStyle}
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size} rows</option>
                  ))}
                </select>
              </div>

              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                maxHeight: 400,
                overflowY: 'auto',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={thStyle} onClick={() => handleHistorySort('batch_id')}>
                        Batch ID {historySort === 'batch_id' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleHistorySort('batch_status')}>
                        Status {historySort === 'batch_status' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleHistorySort('total_controls')}>
                        Controls {historySort === 'total_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleHistorySort('completed_controls')}>
                        Completed {historySort === 'completed_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleHistorySort('failed_controls')}>
                        Failed {historySort === 'failed_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleHistorySort('batch_start_time')}>
                        Started {historySort === 'batch_start_time' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyItems.map((item) => (
                      <tr key={item.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{item.batch_id.slice(0, 8)}...</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge status={item.batch_status || 'UNKNOWN'} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{item.total_controls ?? 0}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-success)' }}>{item.completed_controls ?? 0}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: (item.failed_controls ?? 0) > 0 ? 'var(--color-danger)' : 'inherit' }}>
                          {item.failed_controls ?? 0}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={paginationRowStyle}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Showing {historyStart}–{historyEnd} of {total} rows
                </span>
                {totalPages > 1 && (
                  <div style={paginationStyle}>
                    <button onClick={() => setServerPage(p => Math.max(1, p - 1))} disabled={serverPage === 1} style={paginationBtnStyle(serverPage === 1)}>
                      Previous
                    </button>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Page {serverPage} of {totalPages}
                    </span>
                    <button onClick={() => setServerPage(p => Math.min(totalPages, p + 1))} disabled={serverPage === totalPages} style={paginationBtnStyle(serverPage === totalPages)}>
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
