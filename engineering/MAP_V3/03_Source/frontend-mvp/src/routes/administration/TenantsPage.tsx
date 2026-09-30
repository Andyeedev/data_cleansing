import { useState, useEffect } from 'react';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ErrorState, EmptyState, LoadingSkeleton } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useTenants } from '../../hooks/useTenants';
import { useTenantScope } from '../../tenant/TenantContext';
import { apiGet, apiPost, apiPut } from '../../utils/apiClient';

interface PlanOption {
  plan_id: string;
  name: string;
  tier: string;
}

export function TenantsPage() {
  const { tenants, total, loading, error, refetch } = useTenants();
  // Phase C: the directory is a Super-Admin-global list. In a scoped view it
  // filters to the selected tenant from the same payload (labeled scoped);
  // no second fetch, no manufactured aggregation.
  const { scope, scopeTenantId, isSuperAdmin } = useTenantScope();
  const isScopedView = isSuperAdmin && scope.kind === 'tenant' && scopeTenantId !== null;
  const visibleTenants = isScopedView ? tenants.filter((t) => t.tenant_id === scopeTenantId) : tenants;
  const activeCount = visibleTenants.filter((tenant) => tenant.status === 'ACTIVE').length;

  // Phase E (E6): SA create/suspend affordances on the existing tenant
  // endpoints (route is Super-Admin-only; backend still enforces).
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [planTier, setPlanTier] = useState('professional');
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    let cancelled = false;
    apiGet<PlanOption[]>('/tenants/plans')
      .then((res) => {
        if (!cancelled) setPlans(res || []);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, [modalOpen]);

  const openModal = () => {
    setTenantName('');
    setAdminEmail('');
    setAdminPassword('');
    setPlanTier('professional');
    setActionError(null);
    setModalOpen(true);
  };

  const handleCreate = async () => {
    setSaving(true);
    setActionError(null);
    try {
      await apiPost('/tenants', {
        tenant_name: tenantName.trim(),
        admin_email: adminEmail.trim(),
        admin_password: adminPassword,
        plan_tier: planTier,
      });
      setModalOpen(false);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create tenant');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (tenantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (currentStatus !== 'ACTIVE' && currentStatus !== 'SUSPENDED') return;
    if (!confirm(`Set tenant status to ${nextStatus}?`)) return;
    setActingId(tenantId);
    setActionError(null);
    try {
      await apiPut(`/tenants/${tenantId}`, { status: nextStatus });
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update tenant');
    } finally {
      setActingId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tenants"
        description={
          isScopedView
            ? 'Scoped view: showing the selected tenant only.'
            : 'Tenants registered in the workspace, their lifecycle state, and access controls.'
        }
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <button
          onClick={openModal}
          aria-label="Create new tenant"
          style={{
            padding: 'var(--space-xs) var(--space-md)',
            background: 'var(--color-sidebar-active)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
          }}
        >
          New Tenant
        </button>
      </div>

      {actionError && (
        <div role="alert" style={{ padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius)', color: 'var(--color-danger)', marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
          {actionError}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox label="Total tenants" value={loading ? '—' : isScopedView ? visibleTenants.length : total} tone="info" />
        <KpiBox label="Active" value={loading ? '—' : activeCount} tone="success" />
        <KpiBox label="Lifecycle" value="Managed" tone="neutral" />
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} variant="table" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : visibleTenants.length === 0 ? (
        <EmptyState message={isScopedView ? 'Selected tenant not found in the directory.' : 'No tenants registered yet.'} />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Tenant</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Tenant ID</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Status</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Plan</th>
              <th style={{ textAlign: 'left', padding: 'var(--space-sm)' }}>Max Users</th>
              <th style={{ textAlign: 'right', padding: 'var(--space-sm)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTenants.map((tenant) => (
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
                <td style={{ padding: 'var(--space-sm)', textAlign: 'right' }}>
                  {(tenant.status === 'ACTIVE' || tenant.status === 'SUSPENDED') && (
                    <button
                      onClick={() => handleToggleStatus(tenant.tenant_id, tenant.status)}
                      disabled={actingId === tenant.tenant_id}
                      aria-label={`${tenant.status === 'ACTIVE' ? 'Suspend' : 'Activate'} tenant ${tenant.tenant_name}`}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius)',
                        padding: 'var(--space-xs) var(--space-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {actingId === tenant.tenant_id
                        ? 'Working...'
                        : tenant.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </td>
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full space-y-4" role="dialog" aria-label="Create new tenant">
            <h2 className="text-xl font-bold text-gray-900">New Tenant</h2>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenantName">
                Tenant name
              </label>
              <input
                id="tenantName"
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenantAdminEmail">
                Admin email
              </label>
              <input
                id="tenantAdminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenantAdminPassword">
                Admin password
              </label>
              <input
                id="tenantAdminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenantPlanTier">
                Plan tier
              </label>
              <select
                id="tenantPlanTier"
                value={planTier}
                onChange={(e) => setPlanTier(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
              >
                {plans.length === 0 && <option value="professional">professional</option>}
                {plans.map((plan) => (
                  <option key={plan.plan_id} value={plan.tier}>
                    {plan.name ?? plan.tier}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Cancel tenant creation"
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !tenantName.trim() || !adminEmail.trim() || !adminPassword}
                aria-label="Confirm tenant creation"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}