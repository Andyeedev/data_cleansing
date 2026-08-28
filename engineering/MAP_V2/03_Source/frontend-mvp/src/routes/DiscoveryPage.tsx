import { useState, useMemo } from 'react';
import { useSystemList } from '../hooks/useSystems';
import { useMigrationTenants } from '../hooks/useMigration';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useClearAllDiscovery } from '../hooks/useDiscovery';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import type { ExecutionRunResponse } from '../types/execution';

export function DiscoveryPage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
  const { data: systems, loading: systemsLoading, error: systemsError } = useSystemList();
  const { tenants } = useMigrationTenants();

  const selectedTenantName = useMemo(() =>
    tenants.find((t) => t.tenant_id === selectedTenant)?.tenant_name || selectedTenant,
    [tenants, selectedTenant]
  );

  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling } = usePollBatchStatus();
  const { clearAll, loading: clearingAll } = useClearAllDiscovery();
  const [lastRun, setLastRun] = useState<ExecutionRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; count: number }>({ open: false, count: 0 });
  const [confirmText, setConfirmText] = useState('');
  const [clearProgress, setClearProgress] = useState<{ active: boolean; message: string }>({ active: false, message: '' });

  const handleRunDiscovery = async (projectId: string) => {
    setRunError(null);
    const result = await run(projectId);
    if (result) {
      setLastRun(result);
      startPolling(result.batch_id);
    } else {
      setRunError('Failed to start discovery execution');
    }
  };

  const handleClearAllClick = () => {
    setConfirmModal({ open: true, count: systems?.length || 0 });
    setConfirmText('');
  };

  const handleCancelClear = () => {
    setConfirmModal({ open: false, count: 0 });
    setConfirmText('');
  };

  const handleConfirmClear = async () => {
    setConfirmModal({ open: false, count: 0 });
    setClearProgress({ active: true, message: 'Removing discovery mappings...' });

    const ok = await clearAll(selectedTenant || undefined);

    setClearProgress({ active: true, message: 'Refreshing data...' });
    if (ok) {
      setClearProgress({ active: true, message: 'Complete!' });
      setTimeout(() => setClearProgress({ active: false, message: '' }), 800);
    } else {
      setClearProgress({ active: false, message: '' });
    }
  };

  const isConfirmValid = confirmText.toLowerCase() === 'clear all';

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Discovery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Discover source and target system metadata, then run dataset discovery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          <button
            onClick={() => handleRunDiscovery('default')}
            disabled={running || polling}
            className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              running || polling
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            {running ? 'Starting...' : polling ? 'Discovery Running...' : 'Start Discovery'}
          </button>
          <button
            onClick={handleClearAllClick}
            disabled={clearingAll || !selectedTenant}
            className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              clearingAll || !selectedTenant
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            {clearingAll ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {(runError || pollError) && <ErrorState message={runError || pollError || ''} onRetry={() => setRunError(null)} />}
      {systemsError && <ErrorState message={systemsError} />}

      {systemsLoading && <LoadingSkeleton rows={3} variant="list" />}

      {!systemsLoading && !systemsError && systems && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <KpiBox label="Total Systems" value={systems.length} tone="neutral" />
            <KpiBox label="Source" value={systems.filter(s => s.system_role === 'SOURCE').length} tone="info" />
            <KpiBox label="Target" value={systems.filter(s => s.system_role === 'TARGET').length} tone="success" />
            <KpiBox label="Health" value={status ? `${getProgressPercent(status.completed_controls, status.total_controls)}%` : '—'} tone="neutral" />
          </div>

          <ReportCard title="Registered Systems">
            {systems.length === 0 ? (
              <EmptyState title="No systems registered" description="Add source and target systems first." />
            ) : (
              <div className="divide-y divide-gray-100">
                {systems.map((system) => (
                  <div key={system.system_id} className="flex items-center gap-3 px-4 py-2.5">
                    <StatusPill status={system.system_role === 'SOURCE' ? 'info' : 'success'} />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{system.system_name}</div>
                      <div className="text-xs text-gray-500">
                        {system.system_role} · {system.database_type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ReportCard>

          {lastRun && (
            <div className="mt-3 text-xs text-gray-500">
              Batch: {lastRun.batch_id.slice(0, 8)}...
            </div>
          )}

          {clearProgress.active && (
            <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <span className="text-xs font-medium text-red-600">{clearProgress.message}</span>
            </div>
          )}

          {status && (
            <ReportCard title="Discovery Progress" className="mt-6">
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{getProgressPercent(status.completed_controls, status.total_controls)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status.status === 'FAILED' ? 'bg-red-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${getProgressPercent(status.completed_controls, status.total_controls)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiBox label="Status" value={status.status} tone={status.status === 'FAILED' ? 'error' : 'success'} />
                <KpiBox label="Progress" value={status.progress} tone="neutral" />
                <KpiBox label="Completed" value={status.completed_controls} tone="success" />
                <KpiBox label="Failed" value={status.failed_controls} tone={status.failed_controls > 0 ? 'error' : 'neutral'} />
              </div>

              {polling && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <LoadingSkeleton rows={1} variant="text" height={14} width={120} />
                  <span>Polling for updates...</span>
                </div>
              )}
            </ReportCard>
          )}
        </>
      )}

      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-[500px] w-[90%] shadow-xl border border-gray-200 relative z-[10000]">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              {'\u26A0\uFE0F'} Warning: Clear Discovery Data
            </h3>
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600 mb-5">
              <p className="text-sm text-gray-900 mb-3 leading-relaxed">
                You are about to remove all discovered dataset mappings for tenant <strong className="text-red-600">{selectedTenantName}</strong>.
              </p>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Column mappings and auto-mapped relationships derived from these datasets will also be cleared.
              </p>
              <p className="text-sm font-bold text-red-600 leading-relaxed">
                This action cannot be undone.
              </p>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Type "clear all" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-blue-500"
                placeholder="clear all"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelClear}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                disabled={!isConfirmValid || clearingAll}
                className={`px-5 py-2.5 rounded-md text-sm font-medium border-none ${
                  isConfirmValid
                    ? 'bg-red-600 text-white cursor-pointer hover:bg-red-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                }`}
              >
                {clearingAll ? 'Clearing...' : 'Clear Discovery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
