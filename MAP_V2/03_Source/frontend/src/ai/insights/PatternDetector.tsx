const DEMO_PATTERNS = [
  {
    id: '1',
    type: 'correlation',
    title: 'Data Quality vs. Source System Age',
    description: 'Strong positive correlation (r=0.82) between source system age and data quality issues.',
    confidence: 0.82,
    severity: 'medium',
    entities: ['Customer Table', 'Account Table'],
    detectedAt: '2026-07-10T14:30:00Z'
  },
  {
    id: '2',
    type: 'trend',
    title: 'Migration Speed Increasing',
    description: 'Migration velocity has increased by 15% over the past week.',
    confidence: 0.91,
    severity: 'info',
    entities: ['Migration Engine'],
    detectedAt: '2026-07-10T12:00:00Z'
  },
  {
    id: '3',
    type: 'seasonality',
    title: 'Peak Processing Hours',
    description: 'Validation errors spike between 2-4 AM UTC during batch processing.',
    confidence: 0.88,
    severity: 'low',
    entities: ['Validation Engine'],
    detectedAt: '2026-07-09T08:00:00Z'
  },
  {
    id: '4',
    type: 'clustering',
    title: 'Error Clustering in Transaction Data',
    description: 'Related errors cluster around transaction records from Q4 2025.',
    confidence: 0.79,
    severity: 'high',
    entities: ['Transaction Table'],
    detectedAt: '2026-07-09T16:45:00Z'
  }
];

export const PatternDetector: React.FC = () => {
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'correlation': return '🔗';
      case 'trend': return '📈';
      case 'seasonality': return '🔄';
      case 'clustering': return '🎯';
      case 'association': return '🤝';
      case 'sequential': return '➡️';
      default: return '🔍';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
      case 'info': return '#6b7280';
      default: return '#6b7280';
    }
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
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Pattern Detection</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          AI-powered analysis to identify correlations, trends, and patterns in your data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {DEMO_PATTERNS.map((pattern) => (
          <div
            key={pattern.id}
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{getPatternIcon(pattern.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                    {pattern.title}
                  </h4>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getSeverityColor(pattern.severity),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    textTransform: 'capitalize'
                  }}>
                    {pattern.severity}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                  {pattern.description}
                </p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#9ca3af' }}>
                  <span>Type: {pattern.type}</span>
                  <span>Confidence: {Math.round(pattern.confidence * 100)}%</span>
                  <span>Entities: {pattern.entities.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternDetector;
