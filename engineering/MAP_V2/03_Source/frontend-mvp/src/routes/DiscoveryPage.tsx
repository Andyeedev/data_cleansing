import { useState } from 'react';
import { useSystemList } from '../hooks/useSystems';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import type { ExecutionRunResponse } from '../types/execution';

export function DiscoveryPage() {
  const { userRoles } = useAuth();
  const { data: systems, loading: systemsLoading, error: systemsError } = useSystemList();
  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling } = usePollBatchStatus();
  const [lastRun, setLastRun] = useState<ExecutionRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

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
              {lastRun && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Batch: {lastRun.batch_id.slice(0, 8)}...
                </span>
              )}
            </div>
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
    </div>
  );
}
