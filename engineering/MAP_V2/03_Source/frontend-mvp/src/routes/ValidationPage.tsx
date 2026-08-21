import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowList } from '../hooks/useWorkflows';
import { useRunExecution, usePollBatchStatus } from '../hooks/useExecution';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import type { ExecutionRunResponse } from '../types/execution';

export function ValidationPage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();
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

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const workflows = workflowData?.workflows || [];

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Validation</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Run pre-migration validation to check data integrity across source and target systems.
      </p>

      <button
        onClick={() => navigate('/validation-centre')}
        style={{
          padding: 'var(--space-sm) var(--space-lg)',
          background: 'rgba(0, 120, 212, 0.1)',
          color: 'var(--color-primary)',
          border: '1px solid rgba(0, 120, 212, 0.3)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 500,
          marginBottom: 'var(--space-lg)',
        }}
      >
        Validation Centre
      </button>

      {(runError || pollError) && <ErrorState message={runError || pollError || ''} onRetry={() => setRunError(null)} />}
      {workflowsError && <ErrorState message={workflowsError} />}

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)',
      }}>
        <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Run Validation</h3>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
          Execute validation rules against registered dataset mappings.
        </p>

        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
            Project ID
          </label>
          <input
            type="text"
            value={selectedWorkflowId}
            onChange={(e) => setSelectedWorkflowId(e.target.value)}
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
            onClick={handleRunValidation}
            disabled={running || polling}
            aria-label={running ? 'Starting validation...' : polling ? 'Validation running...' : 'Start Validation'}
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
            {running ? 'Starting...' : polling ? 'Validation Running...' : 'Start Validation'}
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
          <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>Validation Progress</h3>

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

      {workflowsLoading && <LoadingSkeleton rows={3} variant="list" />}
      {!workflowsLoading && workflows.length === 0 && (
        <EmptyState title="No validation workflows" description="Create a workflow to get started." />
      )}
      {!workflowsLoading && workflows.length > 0 && (
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
            Validation Workflows
          </div>
          {workflows.map((wf, idx) => (
            <div
              key={wf.id}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                borderBottom: idx < workflows.length - 1 ? '1px solid var(--color-border)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{wf.name}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {wf.type} &middot; {wf.status}
                </div>
              </div>
              <StatusBadge status={wf.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
