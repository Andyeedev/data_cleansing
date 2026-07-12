import { useState } from 'react';

interface RecommendationSummary {
  id: string;
  title: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  impact: string;
}

const DEMO_RECOMMENDATIONS: RecommendationSummary[] = [
  {
    id: 'rec-001',
    title: 'Optimize batch processing for large table migrations',
    category: 'Migration',
    priority: 'high',
    status: 'pending',
    impact: 'Reduces migration time by 40%',
  },
  {
    id: 'rec-002',
    title: 'Enable parallel validation for data quality checks',
    category: 'Migration',
    priority: 'medium',
    status: 'in-progress',
    impact: 'Improves validation throughput by 2.5x',
  },
  {
    id: 'rec-003',
    title: 'Rotate API keys for production services',
    category: 'Security',
    priority: 'critical',
    status: 'pending',
    impact: 'Prevents potential credential compromise',
  },
  {
    id: 'rec-004',
    title: 'Update data retention policy to meet compliance',
    category: 'Governance',
    priority: 'high',
    status: 'pending',
    impact: 'Ensures regulatory compliance',
  },
  {
    id: 'rec-005',
    title: 'Implement automated rollback procedures',
    category: 'Risk',
    priority: 'medium',
    status: 'completed',
    impact: 'Reduces recovery time by 60%',
  },
  {
    id: 'rec-006',
    title: 'Automate status notifications for workflow steps',
    category: 'Workflow',
    priority: 'low',
    status: 'pending',
    impact: 'Improves team coordination',
  },
  {
    id: 'rec-007',
    title: 'Scale processing nodes for peak load',
    category: 'Resource',
    priority: 'medium',
    status: 'pending',
    impact: 'Prevents performance degradation',
  },
  {
    id: 'rec-008',
    title: 'Optimize SQL queries for reporting module',
    category: 'Optimization',
    priority: 'high',
    status: 'in-progress',
    impact: 'Reduces report generation time by 50%',
  },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
  informational: '#6b7280',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  completed: '#10b981',
  dismissed: '#9ca3af',
};

export function RecommendationDashboard() {
  const [recommendations] = useState<RecommendationSummary[]>(DEMO_RECOMMENDATIONS);

  const stats = {
    total: recommendations.length,
    critical: recommendations.filter(r => r.priority === 'critical').length,
    high: recommendations.filter(r => r.priority === 'high').length,
    medium: recommendations.filter(r => r.priority === 'medium').length,
    low: recommendations.filter(r => r.priority === 'low').length,
    pending: recommendations.filter(r => r.status === 'pending').length,
    inProgress: recommendations.filter(r => r.status === 'in-progress').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Recommendation Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Recommendations', value: stats.total, color: '#3b82f6' },
          { label: 'Critical', value: stats.critical, color: '#dc2626' },
          { label: 'High Priority', value: stats.high, color: '#ea580c' },
          { label: 'Medium Priority', value: stats.medium, color: '#d97706' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
          { label: 'Completed', value: stats.completed, color: '#10b981' },
        ].map(item => (
          <div key={item.label} style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: `4px solid ${item.color}`,
          }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Recommendation</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Priority</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map(rec => (
              <tr key={rec.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{rec.title}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{rec.category}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#fff',
                    background: PRIORITY_COLORS[rec.priority],
                  }}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#fff',
                    background: STATUS_COLORS[rec.status],
                  }}>
                    {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{rec.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecommendationDashboard;
