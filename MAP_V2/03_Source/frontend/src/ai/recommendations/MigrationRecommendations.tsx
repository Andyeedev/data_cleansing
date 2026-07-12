import { useState } from 'react';

interface MigrationRecommendation {
  id: string;
  title: string;
  type: 'data' | 'schema' | 'code';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

const DEMO_MIGRATION_RECOMMENDATIONS: MigrationRecommendation[] = [
  {
    id: 'mig-001',
    title: 'Use chunked batch processing for tables >1M rows',
    type: 'data',
    priority: 'high',
    description: 'Break large table migrations into 10,000-row chunks to prevent memory overflow.',
    impact: 'Reduces memory usage by 70%',
    effort: 'medium',
  },
  {
    id: 'mig-002',
    title: 'Add NOT NULL constraints after data migration',
    type: 'schema',
    priority: 'medium',
    description: 'Migrate data first, then apply NOT NULL constraints to avoid migration failures.',
    impact: 'Prevents migration failures',
    effort: 'low',
  },
  {
    id: 'mig-003',
    title: 'Implement parallel validation for data quality',
    type: 'data',
    priority: 'high',
    description: 'Run data quality checks in parallel across multiple data sources.',
    impact: 'Improves validation throughput by 2.5x',
    effort: 'medium',
  },
  {
    id: 'mig-004',
    title: 'Create rollback procedures for schema changes',
    type: 'schema',
    priority: 'critical',
    description: 'Implement automated rollback triggers for failed schema migrations.',
    impact: 'Reduces recovery time by 60%',
    effort: 'high',
  },
  {
    id: 'mig-005',
    title: 'Refactor legacy stored procedures',
    type: 'code',
    priority: 'medium',
    description: 'Update stored procedures to use modern SQL syntax and best practices.',
    impact: 'Improves maintainability',
    effort: 'high',
  },
  {
    id: 'mig-006',
    title: 'Add data validation checkpoints',
    type: 'data',
    priority: 'high',
    description: 'Insert validation checkpoints at critical migration stages.',
    impact: 'Catches data issues early',
    effort: 'low',
  },
];

const TYPE_COLORS: Record<string, string> = {
  data: '#3b82f6',
  schema: '#8b5cf6',
  code: '#10b981',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
};

export function MigrationRecommendations() {
  const [recommendations] = useState<MigrationRecommendation[]>(DEMO_MIGRATION_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Migration Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'data', 'schema', 'code'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: typeFilter === type ? '#3b82f6' : '#fff',
                color: typeFilter === type ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(rec => (
          <div key={rec.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            borderTop: `3px solid ${PRIORITY_COLORS[rec.priority]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{rec.title}</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: TYPE_COLORS[rec.type],
              }}>
                {rec.type}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>{rec.description}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Impact: {rec.impact}</span>
              <span>Effort: {rec.effort}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MigrationRecommendations;
