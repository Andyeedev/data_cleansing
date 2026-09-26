import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ErrorState, EmptyState, LoadingSkeleton } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useTenants } from '../../hooks/useTenants';

export function TenantsPage() {
  const { tenants, total, loading, error, refetch } = useTenants();
  const activeCount = tenants.filter((tenant) => tenant.status === 'ACTIVE').length;

  return (
    <PageContainer>
      <PageHeader
        title="Tenants"
        description="Tenants registered in the workspace, their lifecycle state, and access controls."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox label="Total tenants" value={loading ? '—' : total} tone="info" />
        <KpiBox label="Active" value={loading ? '—' : activeCount} tone="success" />
        <KpiBox label="Lifecycle" value="Managed" tone="neutral" />
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} variant="table" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : tenants.length === 0 ? (
        <EmptyState message="No tenants registered yet." />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Tenant</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Tenant ID</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Status</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Plan</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Max Users</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.tenant_id}>
                <td style={{ padding: 'var(--space-sm)' }}>{tenant.tenant_name}</td>
                <td style={{ padding: 'var(--space-sm)' }}>
                  <code>{tenant.tenant_id}</code>
                </td>
                <td style={{ padding: 'var(--space-sm)' }}>
                  <StatusPill status={tenant.status} />
                </td>
                <td style={{ padding: 'var(--space-sm)' }}>{tenant.plan_id ?? '—'}</td>
                <td style={{ padding: 'var(--space-sm)' }}>{tenant.max_users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <ReportCard title="About the tenant directory" subtitle="Tenant-level administration in the Admin workbench">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            New tenants are added through the invitation and registration flows. Each tenant
            carries a stable identifier used by validation rules and migration projects.
          </p>
        </ReportCard>
      </div>
    </PageContainer>
  );
}