interface MetricCardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function MetricCard({ title, value, color, icon, subtitle, trend, loading, error, onRetry }: MetricCardProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={labelStyle}>{title}</div>
        <div style={{ height: 28, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <div style={labelStyle}>{title}</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>{error}</div>
        {onRetry && (
          <button onClick={onRetry} style={retryStyle}>Retry</button>
        )}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {icon && <span style={{ fontSize: 'var(--icon-lg)' }}>{icon}</span>}
        <span style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, color: color || 'var(--color-text)' }}>
          {value}
        </span>
      </div>
      {subtitle && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
          {subtitle}
        </div>
      )}
      {trend && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: trend.isPositive ? 'var(--color-success)' : 'var(--color-danger)', marginTop: 'var(--space-xs)' }}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 12,
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-xs)',
};

const retryStyle: React.CSSProperties = {
  marginTop: 'var(--space-sm)',
  padding: '4px 8px',
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
};
