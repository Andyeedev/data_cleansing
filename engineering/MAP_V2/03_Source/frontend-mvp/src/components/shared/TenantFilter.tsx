import { useMigrationTenants } from '../../hooks/useMigration';

interface TenantFilterProps {
  selectedTenant: string;
  onChange: (tenantId: string) => void;
  style?: React.CSSProperties;
}

export function TenantFilter({ selectedTenant, onChange, style }: TenantFilterProps) {
  const { tenants, loading } = useMigrationTenants();

  if (loading) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', ...style }}>
      <label style={labelStyle}>Tenant:</label>
      <select
        style={selectStyle}
        value={selectedTenant}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by tenant"
      >
        <option value="">All Tenants</option>
        {tenants.map((t) => (
          <option key={t.tenant_id} value={t.tenant_id}>
            {t.tenant_name}
          </option>
        ))}
      </select>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'nowrap',
};

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-sm)',
  cursor: 'pointer',
  minWidth: '140px',
};
