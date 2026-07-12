import { useState } from 'react';

const DEMO_INSIGHTS = [
  { id: '1', title: 'Migration velocity increasing', description: 'Migration speed has increased by 15% over the last week.', category: 'migration', severity: 'info', source: 'Migration Engine', date: '2026-07-10', confidence: 0.92 },
  { id: '2', title: 'Validation error rate spike', description: 'Error rate jumped from 2% to 12% in the last hour.', category: 'validation', severity: 'high', source: 'Validation Engine', date: '2026-07-10', confidence: 0.98 },
  { id: '3', title: 'Cost projection on track', description: 'Current spending is within 5% of budget projections.', category: 'financial', severity: 'low', source: 'Financial Module', date: '2026-07-10', confidence: 0.87 },
  { id: '4', title: 'Data quality correlation detected', description: 'Strong correlation (r=0.82) between source system age and data quality.', category: 'operational', severity: 'medium', source: 'Analytics Engine', date: '2026-07-09', confidence: 0.85 },
  { id: '5', title: 'Security anomaly detected', description: 'Unusual login pattern from IP 192.168.1.100.', category: 'security', severity: 'high', source: 'Security Module', date: '2026-07-09', confidence: 0.94 },
  { id: '6', title: 'Governance compliance gap', description: '3 policies require review before next audit.', category: 'governance', severity: 'medium', source: 'Governance Engine', date: '2026-07-08', confidence: 0.90 }
];

export const InsightExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const categories = ['all', 'migration', 'validation', 'financial', 'operational', 'security', 'governance'];
  const severities = ['all', 'critical', 'high', 'medium', 'low', 'info'];

  const filteredInsights = DEMO_INSIGHTS.filter((insight) => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || insight.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || insight.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

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
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search insights..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          {severities.map((sev) => (
            <option key={sev} value={sev}>{sev === 'all' ? 'All Severities' : sev}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#6b7280' }}>
        {filteredInsights.length} insights found
      </div>

      {/* Insights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${getSeverityColor(insight.severity)}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                {insight.title}
              </h4>
              <span style={{
                padding: '2px 8px',
                backgroundColor: getSeverityColor(insight.severity),
                color: 'white',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}>
                {insight.severity}
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
              {insight.description}
            </p>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#9ca3af' }}>
              <span>Source: {insight.source}</span>
              <span>Category: {insight.category}</span>
              <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
              <span>{insight.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightExplorer;
