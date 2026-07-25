import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePollBatchStatus } from '../hooks/useExecution';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

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
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Validation Results</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (!batchId) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Validation Results</h1>
        <ErrorMessage message="No batch ID provided. Navigate from Validation page with a batch ID." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Validation Results</h1>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
          Batch: {batchId}
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading && !status && <LoadingSpinner />}

      {status && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>Execution Status</h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              background: `${getStatusColor(status.status)}15`,
              color: getStatusColor(status.status),
            }}>
              {status.status}
            </span>
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Total Controls</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{status.total_controls}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Completed</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#22c55e' }}>{status.completed_controls}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Failed</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: status.failed_controls > 0 ? '#ef4444' : 'inherit' }}>
                {status.failed_controls}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Progress</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{status.progress}</div>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--color-background)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              <strong>Note:</strong> Rule-level results, governance decisions, and detailed reports require backend API expansion (Phase 07.6.1).
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Current batch status reflects overall pipeline progress. Per-rule execution details, exception reports, and compliance scores
              will be available when <code>/execution/${batchId}/rules</code>, <code>/execution/${batchId}/report</code>, and
              <code>/execution/${batchId}/governance</code> endpoints are implemented.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}