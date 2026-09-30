import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ErrorState, LoadingSkeleton } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useHealth } from '../../hooks/useHealth';

export function MaintenancePage() {
  const { health, loading, error, refetch } = useHealth();

  const databaseOk = health?.database ?? false;
  const apiOk = health?.api ?? false;

  return (
    <PageContainer>
      <PageHeader
        title="Maintenance"
        description="Workspace health monitoring and diagnostic checks for the Admin workbench."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox label="API" value={loading ? '—' : apiOk ? 'Online' : 'Offline'} tone={apiOk ? 'success' : 'error'} />
        <KpiBox
          label="Database"
          value={loading ? '—' : databaseOk ? 'Online' : 'Offline'}
          tone={databaseOk ? 'success' : 'error'}
        />
        <KpiBox
          label="Last check"
          value={health?.timestamp ? new Date(health.timestamp).toLocaleString() : '—'}
          tone="neutral"
        />
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} variant="card" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
          <ReportCard title="API endpoint" subtitle="Backend API service">
            <StatusPill status={apiOk ? 'Operational' : 'Down'} />
          </ReportCard>
          <ReportCard title="Database" subtitle="Workspace persistence layer">
            <StatusPill status={databaseOk ? 'Operational' : 'Down'} />
          </ReportCard>
        </div>
      )}

      <ReportCard title="Maintenance runbook" subtitle="Guided diagnostics for common workspace issues">
        <ul style={{ color: 'var(--color-text-secondary)' }}>
          <li>
            Run{' '}
            <Link
              to="/migration/connections/diagnostics"
              aria-label="Open connection diagnostics"
              style={{ color: 'var(--color-sidebar-active)' }}
            >
              connection diagnostics
            </Link>{' '}
            from the Migration workbench Connection screen.
          </li>
          <li>Check API reachability at <code>/api/v1/monitoring/health</code>.</li>
          <li>Verify database connectivity before scheduling new migration runs.</li>
        </ul>
      </ReportCard>
    </PageContainer>
  );
}