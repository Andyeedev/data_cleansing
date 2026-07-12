const DEMO_TRENDS = [
  {
    id: '1',
    type: 'linear',
    title: 'Validation Pass Rate',
    description: 'Consistent improvement in validation pass rate over the last 30 days.',
    direction: 'up',
    change: '+5%',
    period: '30 days',
    confidence: 0.94,
    dataPoints: [85, 87, 88, 90, 91, 93, 95]
  },
  {
    id: '2',
    type: 'non-linear',
    title: 'Migration Velocity',
    description: 'Exponential increase in migration speed after optimization.',
    direction: 'up',
    change: '+45%',
    period: '14 days',
    confidence: 0.89,
    dataPoints: [100, 120, 150, 190, 240, 310, 400]
  },
  {
    id: '3',
    type: 'cyclical',
    title: 'Error Rate Pattern',
    description: 'Weekly cyclical pattern with peaks on Mondays.',
    direction: 'stable',
    change: '0%',
    period: '7 days',
    confidence: 0.82,
    dataPoints: [8, 5, 4, 3, 4, 5, 8]
  },
  {
    id: '4',
    type: 'seasonal',
    title: 'Processing Load',
    description: 'Quarterly seasonal trend aligned with reporting deadlines.',
    direction: 'up',
    change: '+25%',
    period: '90 days',
    confidence: 0.78,
    dataPoints: [60, 65, 70, 85, 90, 75, 65]
  }
];

export const TrendAnalyser: React.FC = () => {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up': return '#22c55e';
      case 'down': return '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderMiniChart = (dataPoints: number[], direction: string) => {
    const max = Math.max(...dataPoints);
    const min = Math.min(...dataPoints);
    const range = max - min || 1;

    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '40px' }}>
        {dataPoints.map((point, index) => {
          const height = ((point - min) / range) * 100;
          return (
            <div
              key={index}
              style={{
                width: '8px',
                height: `${height}%`,
                backgroundColor: getDirectionColor(direction),
                borderRadius: '2px',
                opacity: 0.6 + (index / dataPoints.length) * 0.4
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Trend Analysis</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          Historical pattern analysis and forecasting across all data sources.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {DEMO_TRENDS.map((trend) => (
          <div
            key={trend.id}
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{getDirectionIcon(trend.direction)}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  {trend.title}
                </h4>
                <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>
                  {trend.type} trend
                </span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: getDirectionColor(trend.direction)
              }}>
                {trend.change}
              </span>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
              {trend.description}
            </p>
            {renderMiniChart(trend.dataPoints, trend.direction)}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
              <span>Period: {trend.period}</span>
              <span>Confidence: {Math.round(trend.confidence * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendAnalyser;
