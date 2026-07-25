import { useState, useEffect } from 'react';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { ExecutionRunResponse } from '../types/execution';

type Tab = 'execution' | 'history';

export function MigrationPage() {
  const { userRoles } = useAuth();
  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling, stopPolling } = usePollBatchStatus();
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

  const getStatusColor = (statusVal: string) => {
    switch (statusVal?.toUpperCase()) {
      case 'COMPLETED': return '#22c55e';
      case 'RUNNING': return '#3b82f6';
      case 'FAILED': return '#ef4444';
      case 'NOT_FOUND': return '#f59e0b';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Migration</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Migration</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Execute migration runs, monitor progress, and review past executions.
      </p>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
        <button
          role="tab"
          aria-selected={activeTab === 'execution'}
          onClick={() => setActiveTab('execution')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'execution' ? 'var(--color-sidebar-active)' : 'transparent',
            color: activeTab === 'execution' ? '#fff' : 'var(--color-text)',
            border: 'none',
            borderBottom: activeTab === 'execution' ? '2px solid var(--color-sidebar-active)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Execution
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'history' ? 'var(--color-sidebar-active)' : 'transparent',
            color: activeTab === 'history' ? '#fff' : 'var(--color-text)',
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--color-sidebar-active)' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          History
        </button>
      </div>

      {/* Execution Tab */}
      {activeTab === 'execution' && (
        <>
          {(runError || pollError) && <ErrorMessage message={runError || pollError || ''} />}

          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Start Migration</h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Execute a migration run for a project.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Enter project ID (or use default)"
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  width: 300,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={handleStartExecution}
                disabled={running || polling}
                style={{
                  padding: '10px 20px',
                  background: running || polling ? 'var(--color-background)' : 'rgba(34, 197, 94, 0.1)',
                  color: running || polling ? 'var(--color-text-secondary)' : '#22c55e',
                  border: `1px solid ${running || polling ? 'var(--color-border)' : 'rgba(34, 197, 94, 0.3)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: running || polling ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {running ? 'Starting...' : polling ? 'Migration Running...' : 'Start Migration'}
              </button>
              {lastRun && (
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Batch: {lastRun.batch_id.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>

          {/* Progress Section */}
          {status && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: 20,
              marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Migration Progress</h3>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Progress</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {getProgressPercent(status.completed_controls, status.total_controls)}%
                  </span>
                </div>
                <div style={{
                  height: 8,
                  background: 'var(--color-background)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${getProgressPercent(status.completed_controls, status.total_controls)}%`,
                    background: status.status === 'FAILED' ? '#ef4444' : '#3b82f6',
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

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
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Total Controls</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{status.total_controls}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Completed</div>
                  <div style={{ fontSize: 14, color: '#22c55e' }}>{status.completed_controls}</div>
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

      {/* History Tab */}
      {activeTab === 'history' && (
        <>
          {historyError && <ErrorMessage message={historyError} />}

          {historyLoading && <LoadingSpinner />}

          {!historyLoading && historyItems.length === 0 && (
            <div style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              No executions yet
            </div>
          )}

          {!historyLoading && historyItems.length > 0 && (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                fontWeight: 600,
                fontSize: 16,
              }}>
                Execution History ({total} total)
              </div>
              {historyItems.map((item, idx) => (
                <div
                  key={item.batch_id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: idx < historyItems.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 13 }}>
                      {item.batch_id.slice(0, 8)}...
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      Project: {item.project_id || 'N/A'}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {item.total_controls ?? 0} controls
                  </div>
                  <div style={{ fontSize: 13, color: '#22c55e' }}>
                    {item.completed_controls ?? 0} completed
                  </div>
                  <div style={{ fontSize: 13, color: (item.failed_controls ?? 0) > 0 ? '#ef4444' : 'inherit' }}>
                    {item.failed_controls ?? 0} failed
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    background: `${getStatusColor(item.batch_status || '')}15`,
                    color: getStatusColor(item.batch_status || ''),
                  }}>
                    {item.batch_status}
                  </span>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                  <button
                    onClick={() => fetchHistory(page - 1)}
                    disabled={page <= 1}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: page <= 1 ? 'var(--color-text-secondary)' : 'var(--color-text)',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => fetchHistory(page + 1)}
                    disabled={page >= totalPages}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: page >= totalPages ? 'var(--color-text-secondary)' : 'var(--color-text)',
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                      fontSize: 13,
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
