const DEMO_KPIS = [
  { id: '1', label: 'Total Insights', value: '247', change: '+12%', trend: 'up', color: '#3b82f6' },
  { id: '2', label: 'Critical Alerts', value: '3', change: '-2', trend: 'down', color: '#ef4444' },
  { id: '3', label: 'Patterns Detected', value: '18', change: '+5', trend: 'up', color: '#8b5cf6' },
  { id: '4', label: 'Predictions Active', value: '8', change: '+1', trend: 'up', color: '#22c55e' }
];

const DEMO_RECENT_INSIGHTS = [
  { id: '1', title: 'Migration velocity increasing', category: 'migration', severity: 'info', time: '2 min ago' },
  { id: '2', title: 'Validation error rate spike detected', category: 'validation', severity: 'high', time: '15 min ago' },
  { id: '3', title: 'Cost projection within budget', category: 'financial', severity: 'low', time: '1 hour ago' },
  { id: '4', title: 'New correlation: data quality vs. source system', category: 'operational', severity: 'medium', time: '2 hours ago' }
];

const DEMO_ANOMALIES = [
  { id: '1', title: 'Error rate: 12% (normal: 2%)', severity: 'critical', module: 'validation' },
  { id: '2', title: 'Processing time: 45s (normal: 12s)', severity: 'high', module: 'operations' },
  { id: '3', title: 'Memory usage: 89% (normal: 60%)', severity: 'medium', module: 'system' }
];

export const InsightDashboard: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {DEMO_KPIS.map((kpi) => (
          <div
            key={kpi.id}
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 600, color: '#374151' }}>{kpi.value}</span>
              <span style={{
                fontSize: '12px',
                color: kpi.trend === 'up' ? '#22c55e' : '#ef4444'
              }}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Recent Insights */}
        <div style={{
          padding: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Recent Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_RECENT_INSIGHTS.map((insight) => (
              <div
                key={insight.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getSeverityColor(insight.severity)
                  }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>{insight.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    color: '#6b7280'
                  }}>
                    {insight.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{insight.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Anomalies */}
        <div style={{
          padding: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Active Anomalies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_ANOMALIES.map((anomaly) => (
              <div
                key={anomaly.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${getSeverityColor(anomaly.severity)}`
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  {anomaly.title}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Module: {anomaly.module}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDashboard;
