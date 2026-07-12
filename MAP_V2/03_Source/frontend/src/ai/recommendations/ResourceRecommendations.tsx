import { useState } from 'react';

interface ResourceRecommendation {
  id: string;
  title: string;
  type: 'capacity' | 'cost' | 'scaling';
  priority: 'high' | 'medium' | 'low';
  description: string;
  currentUsage: number;
  recommendedUsage: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const DEMO_RESOURCE_RECOMMENDATIONS: ResourceRecommendation[] = [
  {
    id: 'res-001',
    title: 'Scale processing nodes for peak load',
    type: 'scaling',
    priority: 'high',
    description: 'Add 2 additional processing nodes during peak migration windows.',
    currentUsage: 4,
    recommendedUsage: 6,
    unit: 'nodes',
    status: 'pending',
  },
  {
    id: 'res-002',
    title: 'Optimize storage allocation',
    type: 'capacity',
    priority: 'medium',
    description: 'Reduce storage allocation for archived migration data.',
    currentUsage: 500,
    recommendedUsage: 350,
    unit: 'GB',
    status: 'in-progress',
  },
  {
    id: 'res-003',
    title: 'Implement auto-scaling for CPU',
    type: 'scaling',
    priority: 'high',
    description: 'Enable auto-scaling based on CPU utilization thresholds.',
    currentUsage: 70,
    recommendedUsage: 85,
    unit: '% utilization',
    status: 'pending',
  },
  {
    id: 'res-004',
    title: 'Right-size database instances',
    type: 'cost',
    priority: 'medium',
    description: 'Downsize underutilized database instances.',
    currentUsage: 8,
    recommendedUsage: 4,
    unit: 'instances',
    status: 'completed',
  },
  {
    id: 'res-005',
    title: 'Optimize memory allocation for batch jobs',
    type: 'capacity',
    priority: 'low',
    description: 'Adjust memory limits for batch processing jobs.',
    currentUsage: 16,
    recommendedUsage: 12,
    unit: 'GB',
    status: 'pending',
  },
  {
    id: 'res-006',
    title: 'Implement spot instances for non-critical workloads',
    type: 'cost',
    priority: 'medium',
    description: 'Use spot instances for development and testing environments.',
    currentUsage: 100,
    recommendedUsage: 60,
    unit: '% on-demand',
    status: 'in-progress',
  },
];

const TYPE_COLORS: Record<string, string> = {
  capacity: '#3b82f6',
  cost: '#10b981',
  scaling: '#8b5cf6',
};

export function ResourceRecommendations() {
  const [recommendations] = useState<ResourceRecommendation[]>(DEMO_RESOURCE_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Resource Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'capacity', 'cost', 'scaling'].map(type => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '6px', marginBottom: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>{rec.currentUsage}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Current ({rec.unit})</div>
              </div>
              <div style={{ fontSize: '24px', color: '#94a3b8' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{rec.recommendedUsage}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Recommended ({rec.unit})</div>
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              textAlign: 'right',
              color: rec.status === 'completed' ? '#10b981' : rec.status === 'in-progress' ? '#3b82f6' : '#f59e0b',
            }}>
              {rec.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceRecommendations;
