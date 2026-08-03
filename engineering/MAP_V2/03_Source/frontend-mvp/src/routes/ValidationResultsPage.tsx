import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePollBatchStatus } from '../hooks/useExecution';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';

export function ValidationResultsPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const { userRoles } = useAuth();
  const { status, loading, error, startPolling, stopPolling } = usePollBatchStatus();

  useEffect(() => {
    if (batchId) {
      startPolling(batchId);
    }
    return () => stopPolling();
  }, [batchId, startPolling, stopPolling]);

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Results</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (!batchId) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Results</h1>
        <ErrorState message="No batch ID provided. Navigate from Validation page with a batch ID." />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Validation Results</h1>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
          Batch: {batchId}
        </span>
      </div>

      {error && <ErrorState message={error} />}

      {loading && !status && <LoadingSkeleton rows={4} variant="card" />}

      {status && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', margin: 0 }}>Execution Status</h3>
            <StatusBadge status={status.status} />
          </div>

          <ProgressBar
            value={getProgressPercent(status.completed_controls, status.total_controls)}
            label="Progress"
            showPercentage
            color={status.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-primary)'}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Total Controls</div>
              <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 500 }}>{status.total_controls}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Completed</div>
              <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 500, color: 'var(--color-success)' }}>{status.completed_controls}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Failed</div>
              <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 500, color: status.failed_controls > 0 ? 'var(--color-danger)' : 'inherit' }}>
                {status.failed_controls}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Progress</div>
              <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 500 }}>{status.progress}</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
              <strong>Note:</strong> Rule-level results, governance decisions, and detailed reports require backend API expansion (Phase 07.6.1).
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Current batch status reflects overall pipeline progress. Per-rule execution details, exception reports, and compliance scores
              will be available when <code>/execution/{batchId}/rules</code>, <code>/execution/{batchId}/report</code>, and
              <code>/execution/{batchId}/governance</code> endpoints are implemented.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
