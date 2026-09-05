interface KPIData {
  label: string;
  value: number | string;
  trend?: { value: number; isPositive: boolean };
  icon?: string;
}

interface ExecutiveKPIProps {
  kpis: KPIData[];
  loading?: boolean;
}

export function ExecutiveKPI({ kpis, loading }: ExecutiveKPIProps) {
  if (loading) {
    return (
      <div style={gridStyle}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={cardStyle}>
            <div style={skeletonLabelStyle} />
            <div style={skeletonValueStyle} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {kpis.map((kpi) => (
        <div key={kpi.label} style={cardStyle}>
          <div style={labelStyle}>{kpi.label}</div>
          <div style={valueRowStyle}>
            {kpi.icon && <span style={iconStyle}>{kpi.icon}</span>}
            <span style={valueStyle}>{kpi.value}</span>
          </div>
          {kpi.trend && (
            <div style={{
              ...trendStyle,
              color: kpi.trend.isPositive ? 'var(--color-success)' : 'var(--color-danger)',
            }}>
              {kpi.trend.isPositive ? '↑' : '↓'} {Math.abs(kpi.trend.value)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 'var(--space-md)',
  marginBottom: 'var(--space-lg)',
};

const cardStyle: React.CSSProperties = {
  padding: 'var(--space-md)',
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-xs)',
};

const valueRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
};

const iconStyle: React.CSSProperties = {
  fontSize: 'var(--icon-lg)',
};

const valueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const trendStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  marginTop: 'var(--space-xs)',
};

const skeletonLabelStyle: React.CSSProperties = {
  width: '60%',
  height: 12,
  background: 'var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  marginBottom: 'var(--space-sm)',
};

const skeletonValueStyle: React.CSSProperties = {
  width: '40%',
  height: 24,
  background: 'var(--color-border)',
  borderRadius: 'var(--radius-sm)',
};
