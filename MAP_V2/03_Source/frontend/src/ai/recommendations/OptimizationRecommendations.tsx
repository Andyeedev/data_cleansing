import { useState } from 'react';

interface OptimizationRecommendation {
  id: string;
  title: string;
  type: 'query' | 'resource' | 'process';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImprovement: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const DEMO_OPTIMIZATION_RECOMMENDATIONS: OptimizationRecommendation[] = [
  {
    id: 'opt-001',
    title: 'Add composite index for migration status queries',
    type: 'query',
    priority: 'high',
    description: 'Create composite index on (tenant_id, migration_batch_id, status) for faster lookups.',
    expectedImprovement: '60% faster query execution',
    status: 'pending',
  },
  {
    id: 'opt-002',
    title: 'Implement connection pooling for database',
    type: 'resource',
    priority: 'medium',
    description: 'Enable connection pooling to reduce connection overhead.',
    expectedImprovement: '40% reduction in connection time',
    status: 'in-progress',
  },
  {
    id: 'opt-003',
    title: 'Batch INSERT operations for data loading',
    type: 'process',
    priority: 'high',
    description: 'Use bulk insert operations instead of row-by-row inserts.',
    expectedImprovement: '5x faster data loading',
    status: 'pending',
  },
  {
    id: 'opt-004',
    title: 'Enable query result caching',
    type: 'query',
    priority: 'medium',
    description: 'Cache frequently accessed query results with 5-minute TTL.',
    expectedImprovement: '30% reduction in database load',
    status: 'completed',
  },
  {
    id: 'opt-005',
    title: 'Optimize memory allocation for processing',
    type: 'resource',
    priority: 'low',
    description: 'Adjust heap size and garbage collection settings.',
    expectedImprovement: '15% memory efficiency gain',
    status: 'pending',
  },
  {
    id: 'opt-006',
    title: 'Implement async processing for I/O operations',
    type: 'process',
    priority: 'high',
    description: 'Convert blocking I/O to async operations.',
    expectedImprovement: '2x throughput improvement',
    status: 'in-progress',
  },
];

const TYPE_COLORS: Record<string, string> = {
  query: '#3b82f6',
  resource: '#10b981',
  process: '#8b5cf6',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  completed: '#10b981',
};

export function OptimizationRecommendations() {
  const [recommendations] = useState<OptimizationRecommendation[]>(DEMO_OPTIMIZATION_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Optimization Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'query', 'resource', 'process'].map(type => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#10b981', fontWeight: '500' }}>{rec.expectedImprovement}</span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: STATUS_COLORS[rec.status],
                color: '#fff',
              }}>
                {rec.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OptimizationRecommendations;
