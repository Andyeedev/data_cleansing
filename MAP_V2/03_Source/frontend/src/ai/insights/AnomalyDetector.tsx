const DEMO_ANOMALIES = [
  {
    id: '1',
    type: 'threshold',
    title: 'Error Rate Spike',
    description: 'Validation error rate increased from 2% to 12% in the last hour.',
    current: 12,
    expected: 2,
    unit: '%',
    severity: 'critical',
    module: 'validation',
    detectedAt: '2026-07-10T15:30:00Z'
  },
  {
    id: '2',
    type: 'statistical',
    title: 'Processing Time Outlier',
    description: 'Average processing time (45s) is 3.5 standard deviations above mean.',
    current: 45,
    expected: 12,
    unit: 'seconds',
    severity: 'high',
    module: 'operations',
    detectedAt: '2026-07-10T14:00:00Z'
  },
  {
    id: '3',
    type: 'distribution',
    title: 'Memory Usage Anomaly',
    description: 'Memory consumption (89%) exceeds normal distribution threshold.',
    current: 89,
    expected: 60,
    unit: '%',
    severity: 'medium',
    module: 'system',
    detectedAt: '2026-07-10T12:15:00Z'
  },
  {
    id: '4',
    type: 'temporal',
    title: 'Unusual Login Pattern',
    description: 'Login attempts from new IP range during off-hours.',
    current: 15,
    expected: 0,
    unit: 'attempts',
    severity: 'high',
    module: 'security',
    detectedAt: '2026-07-10T03:45:00Z'
  }
];

export const AnomalyDetector: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return '#fef2f2';
      case 'high': return '#fffbeb';
      case 'medium': return '#eff6ff';
      default: return '#f9fafb';
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
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Anomaly Detection</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          Real-time detection of threshold violations, statistical outliers, and unusual patterns.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {DEMO_ANOMALIES.map((anomaly) => (
          <div
            key={anomaly.id}
            style={{
              padding: '16px',
              backgroundColor: getSeverityBg(anomaly.severity),
              borderRadius: '8px',
              border: `1px solid ${getSeverityColor(anomaly.severity)}20`,
              borderLeft: `4px solid ${getSeverityColor(anomaly.severity)}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                {anomaly.title}
              </h4>
              <span style={{
                padding: '2px 8px',
                backgroundColor: getSeverityColor(anomaly.severity),
                color: 'white',
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'capitalize'
              }}>
                {anomaly.severity}
              </span>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
              {anomaly.description}
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '10px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Current</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: getSeverityColor(anomaly.severity) }}>
                  {anomaly.current}{anomaly.unit}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Expected</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#22c55e' }}>
                  {anomaly.expected}{anomaly.unit}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Module</div>
                <div style={{ fontSize: '13px', color: '#374151' }}>
                  {anomaly.module}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Type</div>
                <div style={{ fontSize: '13px', color: '#374151', textTransform: 'capitalize' }}>
                  {anomaly.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyDetector;
