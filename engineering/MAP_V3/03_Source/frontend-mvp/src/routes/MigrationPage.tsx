import { useState, useEffect, useRef } from 'react';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPost } from '../utils/apiClient';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import { TabBar } from '../components/shared/TabBar';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { Modal } from '../components/shared/Modal';
import { Pagination } from '../components/shared/Pagination';
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
      <PageContainer>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Migration</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  const breakdown = statusBreakdown?.breakdown ?? {};
  const todayBreakdown = statusBreakdown?.today_breakdown ?? {};
  const completedPct = statusBreakdown && statusBreakdown.total > 0 ? (breakdown.COMPLETED || 0) / statusBreakdown.total * 100 : 0;
  const runningPct = statusBreakdown && statusBreakdown.total > 0 ? (breakdown.RUNNING || 0) / statusBreakdown.total * 100 : 0;
  const donutGradient = statusBreakdown
    ? `conic-gradient(#22c55e 0% ${completedPct}%, #f59e0b ${completedPct}% ${completedPct + runningPct}%, #ef4444 ${completedPct + runningPct}% 100%)`
    : 'none';

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

  const handleTenantChange = (v: string) => {
    setSelectedTenant(v);
    setServerPage(1);
  };

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Migration</h1>
          <p className="text-sm text-gray-500 mt-1">Execute migration runs, monitor progress, and review past executions.</p>
        </div>
        <div className="flex items-center gap-3">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as Tab)} />
          <TenantFilter selectedTenant={selectedTenant} onChange={handleTenantChange} />
        </div>
      </div>

      {runError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">{runError}</p>
          <button onClick={() => setRunError(null)} className="mt-2 text-sm text-red-700 underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* ========== EXECUTION TAB ========== */}
      {activeTab === 'execution' && (
        <>
          {statusBreakdown && (
            <ReportCard title="Execution Overview" subtitle="Today and last 7 days summary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KpiBox label="Running Today" value={todayBreakdown.running || 0} tone="warning" />
                <KpiBox label="Completed Today" value={todayBreakdown.completed || 0} tone="good" />
                <KpiBox label="Failed Today" value={todayBreakdown.failed || 0} tone="critical" />
                <KpiBox label="Scheduled Today" value={todayBreakdown.scheduled || 0} tone="neutral" />
              </div>

              <h4 className="text-sm font-medium text-gray-500 mb-3">Last 7 Days</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <KpiBox label="Running" value={breakdown.RUNNING || 0} tone="warning" />
                <KpiBox label="Completed" value={breakdown.COMPLETED || 0} tone="good" />
                <KpiBox label="Failed" value={breakdown.FAILED || 0} tone="critical" />
                <KpiBox label="Total" value={statusBreakdown.total || 0} tone="neutral" />
              </div>

              {historyItems.slice(0, 10).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Execution Queue (Last 10 runs)</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch ID</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Controls</th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Started</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyItems.slice(0, 10).map((item) => (
                          <tr key={item.batch_id} className="border-b border-gray-100 last:border-0">
                            <td className="px-3 py-2 font-mono text-gray-700">{item.batch_id.slice(0, 8)}...</td>
                            <td className="px-3 py-2">
                              <StatusPill status={item.batch_status || 'UNKNOWN'} />
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {item.total_controls ? `${item.completed_controls ?? 0}/${item.total_controls}` : '—'}
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-500">
                              {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </ReportCard>
          )}

          <div className="flex gap-3 items-center mb-6">
            <button
              onClick={() => { setModalError(null); setShowConfirmModal(true); }}
              disabled={running}
              aria-label={running ? 'Starting migration...' : 'Start Migration'}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                running
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
              }`}
            >
              {running ? 'Starting...' : 'Start Migration ▼'}
            </button>
            <button
              onClick={() => {}}
              disabled={!running}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                running
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
              }`}
            >
              Stop All
            </button>
          </div>

          {/* ========== START MIGRATION MODAL ========== */}
          <Modal
            open={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title="Start Migration"
          >
            <div className="text-sm">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tenant</label>
                <select
                  value={confirmTenantIdInternal}
                  onChange={(e) => { setConfirmTenantId(e.target.value); setSelectedProjectId(''); setModalError(null); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={tenantsLoading}
                >
                  <option value="">All Tenants</option>
                  {allTenants.map((t) => (
                    <option key={t.tenant_id} value={t.tenant_id}>{t.tenant_name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => { setSelectedProjectId(e.target.value); setConfirmProjectId(''); setModalError(null); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!confirmTenantIdInternal}
                >
                  <option value="">Select a tenant first</option>
                  {tenantProjects.map((p) => (
                    <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Project ID (manual)</label>
                <input
                  type="text"
                  value={confirmProjectId}
                  onChange={(e) => { setConfirmProjectId(e.target.value); setSelectedProjectId(''); setModalError(null); }}
                  placeholder="Or enter project ID manually"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Execution Mode</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="executionMode"
                      value="full"
                      checked={executionMode === 'full'}
                      onChange={(e) => setExecutionMode(e.target.value as 'full' | 'quick')}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">Full Validation (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="executionMode"
                      value="quick"
                      checked={executionMode === 'quick'}
                      onChange={(e) => setExecutionMode(e.target.value as 'full' | 'quick')}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">Quick Health Check</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-1">Current Status:</p>
                <p className="text-sm text-gray-700">• {breakdown.RUNNING || 0} Running (7d) | {breakdown.COMPLETED || 0} Completed (7d) | {breakdown.FAILED || 0} Failed (7d)</p>
                <p className="text-xs text-gray-500 mt-1">Estimated time: ~5 minutes</p>
              </div>

              {modalError && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 mt-4">
                  <p className="text-sm text-red-600">{modalError}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartExecution}
                disabled={running || (!selectedProjectId && !confirmProjectId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  (!selectedProjectId && !confirmProjectId)
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Start Execution
              </button>
            </div>
          </Modal>
        </>
      )}

      {/* ========== HISTORY TAB ========== */}
      {activeTab === 'history' && (
        <>
          {historyError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">{historyError}</p>
            </div>
          )}
          {historyLoading && <LoadingSkeleton rows={5} variant="table" />}
          {!historyLoading && historyItems.length === 0 && (
            <EmptyState message="No executions yet. Start a migration to see execution history." />
          )}
          {!historyLoading && historyItems.length > 0 && (
            <div>
              {/* Donut + Status Cards */}
              {statusBreakdown && (
                <ReportCard title="Status Distribution" subtitle="Last 7 days">
                  <div className="flex gap-6 items-start">
                    {/* Donut Chart */}
                    <div className="relative w-30 h-30 flex-shrink-0 rounded-full" style={{ background: donutGradient }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{statusBreakdown.total}</span>
                        <span className="text-xs text-gray-500">Total</span>
                      </div>
                    </div>

                    {/* Status Breakdown Cards */}
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <KpiBox label="Completed" value={breakdown.COMPLETED || 0} tone="good" />
                      <KpiBox label="Running" value={breakdown.RUNNING || 0} tone="warning" />
                      <KpiBox label="Failed" value={breakdown.FAILED || 0} tone="critical" />
                    </div>
                  </div>

                  {statusBreakdown.unscored > 0 && (
                    <p className="text-sm text-gray-500 mt-3">{statusBreakdown.unscored} batches have no score data</p>
                  )}
                </ReportCard>
              )}

              {/* Filters */}
              <ReportCard title={`Execution History (${total} total)`}>
                <div className="flex gap-3 mb-4 items-center">
                  <div className="flex-1">
                    <SearchBar value={historySearch} onChange={handleSearchChange} placeholder="Search by batch ID, status, or project..." />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setServerPage(1); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
                    ))}
                  </select>
                  <select
                    value={historyPageSize}
                    onChange={(e) => { setHistoryPageSize(Number(e.target.value)); setServerPage(1); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size} rows</option>
                    ))}
                  </select>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('batch_id')}>
                          Batch ID {historySort === 'batch_id' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('batch_status')}>
                          Status {historySort === 'batch_status' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('total_controls')}>
                          Controls {historySort === 'total_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('completed_controls')}>
                          Completed {historySort === 'completed_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('failed_controls')}>
                          Failed {historySort === 'failed_controls' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleHistorySort('batch_start_time')}>
                          Started {historySort === 'batch_start_time' ? (historySortDir === 'asc' ? '↑' : '↓') : ''}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItems.map((item) => (
                        <tr key={item.batch_id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono text-gray-700">{item.batch_id.slice(0, 8)}...</td>
                          <td className="px-3 py-2">
                            <StatusPill status={item.batch_status || 'UNKNOWN'} />
                          </td>
                          <td className="px-3 py-2 text-gray-700">{item.total_controls ?? 0}</td>
                          <td className="px-3 py-2 text-green-600">{item.completed_controls ?? 0}</td>
                          <td className={`px-3 py-2 ${(item.failed_controls ?? 0) > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                            {item.failed_controls ?? 0}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Showing {historyItems.length > 0 ? (serverPage - 1) * historyPageSize + 1 : 0}–{Math.min(serverPage * historyPageSize, total)} of {total} rows
                  </span>
                  <Pagination page={serverPage} pageSize={historyPageSize} total={total} onPageChange={setServerPage} />
                </div>
              </ReportCard>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
