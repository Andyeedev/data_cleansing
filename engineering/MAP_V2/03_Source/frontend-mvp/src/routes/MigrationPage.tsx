import { useState, useEffect } from 'react';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { useAuth } from '../context/AuthContext';
import { TabBar } from '../components/shared/TabBar';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import type { ExecutionRunResponse } from '../types/execution';

type Tab = 'execution' | 'history';

const tabs = [
  { key: 'execution', label: 'Execution' },
  { key: 'history', label: 'History' },
];

export function MigrationPage() {
  const { userRoles } = useAuth();
  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling, stopPolling: _stopPolling } = usePollBatchStatus();
  const { items: historyItems, total, page, pageSize, loading: historyLoading, error: historyError, fetchHistory } = useExecutionHistory();

  const [activeTab, setActiveTab] = useState<Tab>('execution');
  const [projectId, setProjectId] = useState('');
  const [lastRun, setLastRun] = useState<ExecutionRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory(page);
    }
  }, [activeTab, page, fetchHistory]);

  const handleStartExecution = async () => {
    setRunError(null);
    const id = projectId || 'default';
    const result = await run(id);
    if (result) {
      setLastRun(result);
      startPolling(result.batch_id);
    } else {
      setRunError('Failed to start migration execution');
    }
  };

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Migration</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Migration</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Execute migration runs, monitor progress, and review past executions.
      </p>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as Tab)} />

      {(runError || pollError) && <ErrorState message={runError || pollError || ''} onRetry={() => { setRunError(null); }} />}

      {activeTab === 'execution' && (
        <>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Start Migration</h3>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
              Execute a migration run for a project.
            </p>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Enter project ID (or use default)"
                aria-label="Project ID"
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                  width: 300,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <button
                onClick={handleStartExecution}
                disabled={running || polling}
                aria-label={running ? 'Starting migration...' : polling ? 'Migration running...' : 'Start Migration'}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  background: running || polling ? 'var(--color-bg-secondary)' : 'rgba(34, 197, 94, 0.1)',
                  color: running || polling ? 'var(--color-text-secondary)' : 'var(--color-success)',
                  border: `1px solid ${running || polling ? 'var(--color-border)' : 'rgba(34, 197, 94, 0.3)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: running || polling ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                }}
              >
                {running ? 'Starting...' : polling ? 'Migration Running...' : 'Start Migration'}
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
              marginBottom: 'var(--space-lg)',
            }}>
              <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>Migration Progress</h3>

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
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Total Controls</div>
                  <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{status.total_controls}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Completed</div>
                  <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-success)' }}>{status.completed_controls}</div>
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

      {activeTab === 'history' && (
        <>
          {historyError && <ErrorState message={historyError} />}

          {historyLoading && <LoadingSkeleton rows={5} variant="table" />}

          {!historyLoading && historyItems.length === 0 && (
            <EmptyState title="No executions yet" description="Start a migration to see execution history." />
          )}

          {!historyLoading && historyItems.length > 0 && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--color-border)',
                fontWeight: 600,
                fontSize: 'var(--font-size-h4)',
              }}>
                Execution History ({total} total)
              </div>
              {historyItems.map((item, idx) => (
                <div
                  key={item.batch_id}
                  style={{
                    padding: 'var(--space-sm) var(--space-lg)',
                    borderBottom: idx < historyItems.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>
                      {item.batch_id.slice(0, 8)}...
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Project: {item.project_id || 'N/A'}
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {item.total_controls ?? 0} controls
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>
                    {item.completed_controls ?? 0} completed
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: (item.failed_controls ?? 0) > 0 ? 'var(--color-danger)' : 'inherit' }}>
                    {item.failed_controls ?? 0} failed
                  </div>
                  <StatusBadge status={item.batch_status || ''} />
                </div>
              ))}

              {totalPages > 1 && (
                <div style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                }}>
                  <button
                    onClick={() => fetchHistory(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                    style={{
                      padding: 'var(--space-xs) var(--space-sm)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: page <= 1 ? 'var(--color-text-secondary)' : 'var(--color-text)',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => fetchHistory(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    style={{
                      padding: 'var(--space-xs) var(--space-sm)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: page >= totalPages ? 'var(--color-text-secondary)' : 'var(--color-text)',
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
