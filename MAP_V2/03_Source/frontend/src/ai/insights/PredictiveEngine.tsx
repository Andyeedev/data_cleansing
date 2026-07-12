const DEMO_PREDICTIONS = [
  {
    id: '1',
    type: 'completion',
    title: 'Migration Completion',
    prediction: '3 days',
    confidence: 0.87,
    range: '2-4 days',
    factors: ['Current velocity', 'Remaining records', 'Historical patterns'],
    status: 'on-track'
  },
  {
    id: '2',
    type: 'risk',
    title: 'Risk Score',
    prediction: 'Medium (65/100)',
    confidence: 0.82,
    range: '60-70',
    factors: ['Error rate trend', 'Resource utilization', 'Team capacity'],
    status: 'warning'
  },
  {
    id: '3',
    type: 'cost',
    title: 'Projected Cost',
    prediction: '$45,200',
    confidence: 0.91,
    range: '$42,000 - $48,000',
    factors: ['Current spend rate', 'Resource costs', 'Expected overage'],
    status: 'on-track'
  },
  {
    id: '4',
    type: 'quality',
    title: 'Data Quality Score',
    prediction: '94%',
    confidence: 0.85,
    range: '92% - 96%',
    factors: ['Validation pass rate', 'Error correction rate', 'Source quality'],
    status: 'on-track'
  },
  {
    id: '5',
    type: 'performance',
    title: 'Throughput Forecast',
    prediction: '12,500 records/hour',
    confidence: 0.78,
    range: '10,000 - 15,000',
    factors: ['Current throughput', 'Resource allocation', 'System load'],
    status: 'improving'
  },
  {
    id: '6',
    type: 'capacity',
    title: 'Storage Requirement',
    prediction: '2.4 TB',
    confidence: 0.88,
    range: '2.2 - 2.6 TB',
    factors: ['Data growth rate', 'Compression ratio', 'Retention policy'],
    status: 'on-track'
  }
];

export const PredictiveEngine: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'improving': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'completion': return '🏁';
      case 'risk': return '⚠️';
      case 'cost': return '💰';
      case 'quality': return '✅';
      case 'performance': return '⚡';
      case 'capacity': return '💾';
      default: return '🔮';
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
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Predictive Analytics</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
          AI-powered predictions for risk, completion, cost, and performance metrics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {DEMO_PREDICTIONS.map((pred) => (
          <div
            key={pred.id}
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>{getTypeIcon(pred.type)}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  {pred.title}
                </h4>
              </div>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(pred.status)
              }} />
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                {pred.prediction}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                Range: {pred.range}
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>Confidence</span>
                <span style={{ fontSize: '11px', color: '#374151', fontWeight: 500 }}>
                  {Math.round(pred.confidence * 100)}%
                </span>
              </div>
              <div style={{
                height: '4px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${pred.confidence * 100}%`,
                  height: '100%',
                  backgroundColor: getStatusColor(pred.status),
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              <div style={{ marginBottom: '2px' }}>Key factors:</div>
              {pred.factors.map((factor, i) => (
                <div key={i} style={{ paddingLeft: '8px' }}>• {factor}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveEngine;
