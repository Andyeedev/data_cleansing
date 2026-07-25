import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';

export function ExecutionHistoryPage() {
  const { userRoles } = useAuth();

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Execution History</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Execution History</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        View and filter past validation executions.
      </p>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 48,
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        background: 'var(--color-background)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-text)' }}>No Execution History Available</h3>
        <p style={{ fontSize: 14, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
          The <code>/api/v1/execution/history</code> endpoint is not yet implemented.
        </p>
        <p style={{ fontSize: 13, maxWidth: 480, margin: '0 auto' }}>
          Once backend Phase 07.6.1 is complete, this page will display a paginated list of past execution batches
          with filtering by status, date range, and project. Each entry will link to detailed validation results.
        </p>
      </div>
    </div>
  );
}