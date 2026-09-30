import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ErrorState, LoadingSkeleton } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useHealth } from '../../hooks/useHealth';

export function NotificationsPage() {
  const { health, loading, error, refetch } = useHealth();

  const databaseOk = health?.database ?? false;
  const apiOk = health?.api ?? false;

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Event delivery for the workspace. Health monitors and delivery endpoint status."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox
          label="API health"
          value={loading ? '—' : apiOk ? 'Operational' : 'Degraded'}
          tone={apiOk ? 'success' : 'error'}
        />
        <KpiBox
          label="Database"
          value={loading ? '—' : databaseOk ? 'Connected' : 'Unreachable'}
          tone={databaseOk ? 'success' : 'error'}
        />
        <KpiBox label="Delivery" value="Armed" tone="neutral" />
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} variant="card" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
          <ReportCard title="API endpoint" subtitle="Backend API service">
            <StatusPill status={apiOk ? 'Operational' : 'Degraded'} />
          </ReportCard>
          <ReportCard title="Database" subtitle="Workspace persistence layer">
            <StatusPill status={databaseOk ? 'Connected' : 'Unreachable'} />
          </ReportCard>
        </div>
      )}

      <ReportCard title="About notifications" subtitle="Where workspace events are surfaced">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Notification preferences and alert routing are configured per user. Health status shown
          here reflects the live <code>/api/v1/monitoring/health</code> endpoint.
        </p>
        <p style={{ marginTop: 'var(--space-sm)' }}>
          <Link
            to="/notifications"
            aria-label="Open notification preferences"
            style={{ color: 'var(--color-sidebar-active)', fontSize: 'var(--font-size-sm)' }}
          >
            Open notification preferences
          </Link>
        </p>
      </ReportCard>
    </PageContainer>
  );
}