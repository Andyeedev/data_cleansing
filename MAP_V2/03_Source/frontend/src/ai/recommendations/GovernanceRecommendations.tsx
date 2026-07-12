import { useState } from 'react';

interface GovernanceRecommendation {
  id: string;
  title: string;
  type: 'compliance' | 'policy' | 'audit' | 'quality';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const DEMO_GOVERNANCE_RECOMMENDATIONS: GovernanceRecommendation[] = [
  {
    id: 'gov-001',
    title: 'Update data retention policy to meet GDPR requirements',
    type: 'compliance',
    priority: 'critical',
    description: 'Review and update retention policies to align with GDPR Article 17.',
    deadline: '2026-07-31',
    status: 'pending',
  },
  {
    id: 'gov-002',
    title: 'Prepare audit documentation for Q3 review',
    type: 'audit',
    priority: 'high',
    description: 'Compile all migration audit logs and reports for quarterly review.',
    deadline: '2026-07-15',
    status: 'in-progress',
  },
  {
    id: 'gov-003',
    title: 'Implement data quality scoring',
    type: 'quality',
    priority: 'medium',
    description: 'Add automated data quality scoring for all migrated datasets.',
    deadline: '2026-08-15',
    status: 'pending',
  },
  {
    id: 'gov-004',
    title: 'Update access control policy',
    type: 'policy',
    priority: 'high',
    description: 'Revise access control policies to reflect new role hierarchy.',
    deadline: '2026-07-20',
    status: 'completed',
  },
  {
    id: 'gov-005',
    title: 'Conduct compliance training for migration team',
    type: 'compliance',
    priority: 'medium',
    description: 'Schedule and conduct compliance training sessions.',
    deadline: '2026-08-01',
    status: 'pending',
  },
  {
    id: 'gov-006',
    title: 'Review and update data classification',
    type: 'policy',
    priority: 'low',
    description: 'Review data classification labels across all migrated tables.',
    deadline: '2026-08-30',
    status: 'pending',
  },
];

const TYPE_COLORS: Record<string, string> = {
  compliance: '#dc2626',
  policy: '#3b82f6',
  audit: '#8b5cf6',
  quality: '#10b981',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
};

export function GovernanceRecommendations() {
  const [recommendations] = useState<GovernanceRecommendation[]>(DEMO_GOVERNANCE_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Governance Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'compliance', 'policy', 'audit', 'quality'].map(type => (
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
            borderLeft: `4px solid ${PRIORITY_COLORS[rec.priority]}`,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>Deadline: {new Date(rec.deadline).toLocaleDateString()}</span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: rec.status === 'completed' ? '#10b981' : rec.status === 'in-progress' ? '#3b82f6' : '#f59e0b',
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

export default GovernanceRecommendations;
