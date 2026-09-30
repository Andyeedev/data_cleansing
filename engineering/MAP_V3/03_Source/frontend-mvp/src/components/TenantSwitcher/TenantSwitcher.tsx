import { useTenants } from '../../hooks/useTenants';
import { useTenantScope } from '../../tenant/TenantContext';

/**
 * Phase C — console tenant switcher (spec §6), rendered in the
 * AdminConsole header.
 *
 * - Super Admin: `All Tenants` aggregate option + tenant list (real
 *   `GET /api/v1/tenants` source). Selecting a tenant changes the
 *   viewing/working scope, never the role.
 * - Everyone else: non-switchable current-tenant label. No picker, no
 *   aggregate, no cross-tenant access.
 */
export function TenantSwitcher() {
  const { scope, setScopeTenant, setScopeAll, isSuperAdmin, lockedTenantId } = useTenantScope();
  const { tenants, loading } = useTenants();

  if (!isSuperAdmin) {
    return (
      <span
        title={lockedTenantId ?? 'No tenant assigned'}
        style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}
      >
        Tenant: Current Tenant
      </span>
    );
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
      Tenant:
      <select
        aria-label="Select working tenant scope"
        value={scope.kind === 'all' ? '' : scope.tenantId}
        disabled={loading}
        onChange={(e) => {
          if (e.target.value === '') setScopeAll();
          else setScopeTenant(e.target.value);
        }}
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '4px 8px',
          fontSize: 13,
          cursor: 'pointer',
          minWidth: 160,
        }}
      >
        <option value="">All Tenants</option>
        {tenants.map((tenant) => (
          <option key={tenant.tenant_id} value={tenant.tenant_id}>
            {tenant.tenant_name}
          </option>
        ))}
      </select>
    </label>
  );
}
