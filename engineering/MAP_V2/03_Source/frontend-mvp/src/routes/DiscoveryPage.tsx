import { useState } from 'react';
import { useSystemList } from '../hooks/useSystems';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
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

  const getStatusColor = (statusVal: string) => {
    switch (statusVal?.toUpperCase()) {
      case 'COMPLETED': return '#22c55e';
      case 'RUNNING': return '#3b82f6';
      case 'FAILED': return '#ef4444';
      case 'NOT_FOUND': return '#f59e0b';
      default: return 'var(--color-text-secondary)';
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Discovery</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Discovery</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Discover source and target system metadata, then run dataset discovery.
      </p>

      {(runError || pollError) && <ErrorMessage message={runError || pollError || ''} />}

      {systemsLoading && <LoadingSpinner />}
      {systemsError && <ErrorMessage message={systemsError} />}

      {!systemsLoading && !systemsError && systems && (
        <>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            marginBottom: 24,
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-border)',
              fontWeight: 600,
              fontSize: 16,
            }}>
              Registered Systems
            </div>
            {systems.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                No systems registered. Add source and target systems first.
              </div>
            ) : (
              systems.map((system, idx) => (
                <div
                  key={system.system_id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: idx < systems.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: system.system_role === 'SOURCE' ? '#3b82f6' : '#22c55e',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{system.system_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {system.system_role} &middot; {system.database_type}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Run Discovery</h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Trigger dataset discovery to scan source/target systems and create dataset mappings.
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={() => handleRunDiscovery('default')}
                disabled={running || polling}
                style={{
                  padding: '10px 20px',
                  background: running || polling ? 'var(--color-background)' : 'rgba(59, 130, 246, 0.1)',
                  color: running || polling ? 'var(--color-text-secondary)' : '#3b82f6',
                  border: `1px solid ${running || polling ? 'var(--color-border)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: running || polling ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {running ? 'Starting...' : polling ? 'Discovery Running...' : 'Start Discovery'}
              </button>
              {lastRun && (
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Batch: {lastRun.batch_id.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>

          {status && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: 20,
            }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Discovery Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 500,
                    background: `${getStatusColor(status.status)}15`,
                    color: getStatusColor(status.status),
                  }}>
                    {status.status}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Progress</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{status.progress}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Completed</div>
                  <div style={{ fontSize: 14 }}>{status.completed_controls}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Failed</div>
                  <div style={{ fontSize: 14, color: status.failed_controls > 0 ? '#ef4444' : 'inherit' }}>
                    {status.failed_controls}
                  </div>
                </div>
              </div>
              {polling && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LoadingSpinner />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
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
