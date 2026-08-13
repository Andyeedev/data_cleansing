import { useState } from 'react';
import { useSystemList } from '../hooks/useSystems';
import { useMigrationTenants } from '../hooks/useMigration';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useClearAllDiscovery } from '../hooks/useDiscovery';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { TenantFilter } from '../components/shared/TenantFilter';
import type { ExecutionRunResponse } from '../types/execution';

export function DiscoveryPage() {
  const { userRoles, tenantId: userTenantId } = useAuth();
  const { data: systems, loading: systemsLoading, error: systemsError } = useSystemList();
  const { tenants } = useMigrationTenants();

  const selectedTenantName = tenants.find((t) => t.tenant_id === selectedTenant)?.tenant_name || selectedTenant;
  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling } = usePollBatchStatus();
  const { clearAll, loading: clearingAll } = useClearAllDiscovery();
  const [lastRun, setLastRun] = useState<ExecutionRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string>(userTenantId || '');
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
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Discovery</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Discovery</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Discover source and target system metadata, then run dataset discovery.
      </p>

      {(runError || pollError) && <ErrorState message={runError || pollError || ''} onRetry={() => setRunError(null)} />}
      {systemsError && <ErrorState message={systemsError} />}

      {systemsLoading && <LoadingSkeleton rows={3} variant="list" />}

      {!systemsLoading && !systemsError && systems && (
        <>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
          }}>
            <div style={{
              padding: 'var(--space-md) var(--space-lg)',
              borderBottom: '1px solid var(--color-border)',
              fontWeight: 600,
              fontSize: 'var(--font-size-h4)',
            }}>
              Registered Systems
            </div>
            {systems.length === 0 ? (
              <EmptyState title="No systems registered" description="Add source and target systems first." />
            ) : (
              systems.map((system, idx) => (
                <div
                  key={system.system_id}
                  style={{
                    padding: 'var(--space-sm) var(--space-lg)',
                    borderBottom: idx < systems.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}
                >
                  <StatusBadge
                    status={system.system_role === 'SOURCE' ? 'info' : 'success'}
                    ariaLabel={`${system.system_role} system`}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{system.system_name}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {system.system_role} &middot; {system.database_type}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Run Discovery</h3>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Trigger dataset discovery to scan source/target systems and create dataset mappings.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
              <button
                onClick={() => handleRunDiscovery('default')}
                disabled={running || polling}
                aria-label={running ? 'Starting discovery...' : polling ? 'Discovery running...' : 'Start Discovery'}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  background: running || polling ? 'var(--color-bg-secondary)' : 'rgba(59, 130, 246, 0.1)',
                  color: running || polling ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                  border: `1px solid ${running || polling ? 'var(--color-border)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: running || polling ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                }}
              >
                {running ? 'Starting...' : polling ? 'Discovery Running...' : 'Start Discovery'}
              </button>
              <button
                onClick={handleClearAllClick}
                disabled={clearingAll || !selectedTenant}
                aria-label={clearingAll ? 'Clearing discovery data...' : 'Clear All Discovery'}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  background: clearingAll || !selectedTenant ? 'var(--color-bg-secondary)' : 'rgba(239, 68, 68, 0.1)',
                  color: clearingAll || !selectedTenant ? 'var(--color-text-secondary)' : 'var(--color-danger)',
                  border: `1px solid ${clearingAll || !selectedTenant ? 'var(--color-border)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: clearingAll || !selectedTenant ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                }}
              >
                {clearingAll ? 'Clearing...' : 'Clear All'}
              </button>
              {lastRun && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Batch: {lastRun.batch_id.slice(0, 8)}...
                </span>
              )}
            </div>
            {clearProgress.active && (
              <div style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)', fontWeight: 500 }}>{clearProgress.message}</span>
              </div>
            )}
          </div>

          {status && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>Discovery Progress</h3>

              <ProgressBar
                value={getProgressPercent(status.completed_controls, status.total_controls)}
                label="Progress"
                showPercentage
                color={status.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-primary)'}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Status</div>
                  <StatusBadge status={status.status} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Progress</div>
                  <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{status.progress}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Completed</div>
                  <div style={{ fontSize: 'var(--font-size-base)' }}>{status.completed_controls}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Failed</div>
                  <div style={{ fontSize: 'var(--font-size-base)', color: status.failed_controls > 0 ? 'var(--color-danger)' : 'inherit' }}>
                    {status.failed_controls}
                  </div>
                </div>
              </div>

              {polling && (
                <div style={{ marginTop: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <LoadingSkeleton rows={1} variant="text" height={14} width={120} />
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Polling for updates...
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {confirmModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#ffffff', borderRadius: '8px', padding: '24px', maxWidth: 500, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid #e5e7eb', position: 'relative', zIndex: 10000 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#dc2626', fontWeight: 700, margin: '0 0 16px 0' }}>
              {'\u26A0\uFE0F'} Warning: Clear Discovery Data
            </h3>
            <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '2px solid #dc2626', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#1f2937', lineHeight: 1.5 }}>
                You are about to remove all discovered dataset mappings for tenant <strong style={{ color: '#dc2626' }}>{selectedTenantName}</strong>.
              </p>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#4b5563', lineHeight: 1.5 }}>
                Column mappings and auto-mapped relationships derived from these datasets will also be cleared.
              </p>
              <p style={{ fontSize: '14px', margin: 0, fontWeight: 700, color: '#dc2626', lineHeight: 1.5 }}>
                This action cannot be undone.
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#4b5563', fontWeight: 500 }}>
                Type "clear all" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#f9fafb', color: '#1f2937', boxSizing: 'border-box', outline: 'none' }}
                placeholder="clear all"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelClear}
                style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                disabled={!isConfirmValid || clearingAll}
                style={{ padding: '10px 20px', background: isConfirmValid ? '#dc2626' : '#e5e7eb', color: isConfirmValid ? '#ffffff' : '#9ca3af', border: 'none', borderRadius: '6px', cursor: isConfirmValid ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 500, opacity: isConfirmValid ? 1 : 0.7 }}
              >
                {clearingAll ? 'Clearing...' : 'Clear Discovery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
