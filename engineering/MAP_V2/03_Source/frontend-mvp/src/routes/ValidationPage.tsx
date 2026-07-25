import { useState } from 'react';
import { useWorkflowList } from '../hooks/useWorkflows';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { ExecutionRunResponse } from '../types/execution';

export function ValidationPage() {
  const { userRoles } = useAuth();
  const { data: workflowData, loading: workflowsLoading, error: workflowsError } = useWorkflowList({ type: 'validation' });
  const { run, loading: running } = useRunExecution();
  const { status, loading: polling, error: pollError, startPolling } = usePollBatchStatus();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [lastRun, setLastRun] = useState<ExecutionRunResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRunValidation = async () => {
    setRunError(null);
    const projectId = selectedWorkflowId || 'default';
    const result = await run(projectId);
    if (result) {
      setLastRun(result);
      startPolling(result.batch_id);
    } else {
      setRunError('Failed to start validation execution');
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
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Validation</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const workflows = workflowData?.workflows || [];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Validation</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Run pre-migration validation to check data integrity across source and target systems.
      </p>

      {(runError || pollError) && <ErrorMessage message={runError || pollError || ''} />}
      {workflowsError && <ErrorMessage message={workflowsError} />}

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 20,
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Run Validation</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Execute validation rules against registered dataset mappings.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Project ID
          </label>
          <input
            type="text"
            value={selectedWorkflowId}
            onChange={(e) => setSelectedWorkflowId(e.target.value)}
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
            onClick={handleRunValidation}
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
            {running ? 'Starting...' : polling ? 'Validation Running...' : 'Start Validation'}
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
          marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Validation Progress</h3>

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

      {workflowsLoading && <LoadingSpinner />}
      {!workflowsLoading && workflows.length > 0 && (
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
            Validation Workflows
          </div>
          {workflows.map((wf, idx) => (
            <div
              key={wf.id}
              style={{
                padding: '12px 20px',
                borderBottom: idx < workflows.length - 1 ? '1px solid var(--color-border)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{wf.name}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {wf.type} &middot; {wf.status}
                </div>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: wf.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: wf.status === 'active' ? '#22c55e' : '#f59e0b',
              }}>
                {wf.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
