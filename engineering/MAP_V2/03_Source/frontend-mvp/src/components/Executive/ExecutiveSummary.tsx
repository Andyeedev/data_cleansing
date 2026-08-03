interface ExecutiveSummaryProps {
  completionPercent: number;
  confidencePercent: number;
  totalSystems: number;
  totalBatches: number;
  loading?: boolean;
}

export function ExecutiveSummary({ 
  completionPercent, 
  confidencePercent, 
  totalSystems, 
  totalBatches,
  loading 
}: ExecutiveSummaryProps) {
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={skeletonStyle} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div>
          <h2 style={titleStyle}>Migration Programme Overview</h2>
          <p style={subtitleStyle}>
            {totalSystems} systems • {totalBatches} batches
          </p>
        </div>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Completion</span>
            <span style={statValueStyle}>{completionPercent}%</span>
          </div>
          <div style={dividerStyle} />
          <div style={statItemStyle}>
            <span style={statLabelStyle}>Confidence</span>
            <span style={statValueStyle}>{confidencePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-lg)',
  color: 'white',
  marginBottom: 'var(--space-lg)',
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 'var(--space-md)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h2)',
  fontWeight: 'var(--font-weight-bold)',
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  opacity: 0.8,
  marginTop: 'var(--space-xs)',
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-lg)',
};

const statItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  opacity: 0.8,
};

const statValueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h2)',
  fontWeight: 'var(--font-weight-bold)',
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 40,
  background: 'rgba(255,255,255,0.3)',
};

const skeletonStyle: React.CSSProperties = {
  height: 100,
  background: 'rgba(255,255,255,0.1)',
  borderRadius: 'var(--radius)',
  animation: 'pulse 1.5s infinite',
};
