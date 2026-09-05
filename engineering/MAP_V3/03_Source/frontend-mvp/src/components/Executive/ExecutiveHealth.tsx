interface ExecutiveHealthProps {
  score: number; // 0-100
  label?: string;
  loading?: boolean;
}

export function ExecutiveHealth({ score, label = 'Migration Health', loading }: ExecutiveHealthProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={skeletonStyle} />
      </div>
    );
  }

  const getColor = (s: number) => {
    if (s >= 80) return 'var(--color-success)';
    if (s >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Healthy';
    if (s >= 60) return 'Needs Attention';
    return 'At Risk';
  };

  const color = getColor(score);
  const rotation = (score / 100) * 180; // Half circle

  return (
    <div style={cardStyle}>
      <div style={labelTextStyle}>{label}</div>
      <div style={gaugeContainerStyle}>
        <svg viewBox="0 0 100 60" style={svgStyle}>
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${rotation * 0.7} 126`}
          />
        </svg>
        <div style={valueContainerStyle}>
          <span style={{ ...valueStyle, color }}>{score}</span>
          <span style={unitStyle}>%</span>
        </div>
      </div>
      <div style={{ ...statusStyle, color }}>{getLabel(score)}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 'var(--space-md)',
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
  textAlign: 'center',
};

const labelTextStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-sm)',
};

const gaugeContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: 120,
  height: 70,
  margin: '0 auto',
};

const svgStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const valueContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'baseline',
  gap: 2,
};

const valueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h2)',
  fontWeight: 'var(--font-weight-bold)',
};

const unitStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
};

const statusStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  marginTop: 'var(--space-sm)',
};

const skeletonStyle: React.CSSProperties = {
  height: 100,
  background: 'var(--color-border)',
  borderRadius: 'var(--radius)',
  animation: 'pulse 1.5s infinite',
};
