/**
 * OC-REPORT-001 — the Super Admin parent (tenant) scope selector.
 *
 * The approved mockup puts a parent selector in the topbar, right-aligned,
 * showing the tenant display name ("Acme Financial" in the mockup, the real
 * tenant names in the app). This is that control.
 *
 * Scoped deliberately to Super Admin: `setScopeTenant` in TenantContext is a
 * no-op for anyone else, and the backing endpoint is admin-gated, so a
 * non-Super-Admin never sees the control. Hiding it is therefore not a
 * convenience — it prevents offering a filter that could not work.
 */
import { useTenantScope } from '../../tenant/TenantContext';
import { useTenantOptions } from '../../hooks/useReportStudio';

interface Props {
  /** Called after the scope changes, so the page can refetch / navigate. */
  onChange?: (tenantId: string | null) => void;
}

const ALL = '__all__';

export function TenantScopeSelect({ onChange }: Props) {
  const { scopeTenantId, isSuperAdmin, setScopeTenant, setScopeAll } = useTenantScope();
  const { tenants, loading, error } = useTenantOptions(isSuperAdmin);

  if (!isSuperAdmin) return null;

  const onSelect = (value: string) => {
    if (value === ALL) {
      setScopeAll();
      onChange?.(null);
    } else {
      setScopeTenant(value);
      onChange?.(value);
    }
  };

  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Parent</span>
      <select
        aria-label="Parent tenant"
        value={scopeTenantId ?? ALL}
        onChange={(e) => onSelect(e.target.value)}
        disabled={loading}
        title="Filter the Report Studio to one tenant"
        className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 hover:bg-gray-50 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
      >
        <option value={ALL}>All tenants</option>
        {tenants.map((t) => (
          <option key={t.tenant_id} value={t.tenant_id}>
            {t.tenant_name}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[11px] text-red-600">{error}</span>
      )}
    </label>
  );
}
