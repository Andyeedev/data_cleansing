import { useState } from 'react';

interface PrioritisedRecommendation {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  impact: number;
  effort: number;
  urgency: number;
  overallScore: number;
}

const PRIORITY_CONFIG = {
  critical: { color: '#dc2626', bgColor: '#fef2f2', range: '90-100' },
  high: { color: '#ea580c', bgColor: '#fff7ed', range: '70-89' },
  medium: { color: '#d97706', bgColor: '#fffbeb', range: '50-69' },
  low: { color: '#2563eb', bgColor: '#eff6ff', range: '30-49' },
  informational: { color: '#6b7280', bgColor: '#f9fafb', range: '0-29' },
};

const DEMO_RECOMMENDATIONS: PrioritisedRecommendation[] = [
  { id: 'pri-001', title: 'Rotate production API keys', priority: 'critical', impact: 9, effort: 3, urgency: 10, overallScore: 95 },
  { id: 'pri-002', title: 'Implement batch validation checkpoints', priority: 'high', impact: 8, effort: 4, urgency: 7, overallScore: 82 },
  { id: 'pri-003', title: 'Enable parallel validation', priority: 'high', impact: 7, effort: 5, urgency: 8, overallScore: 76 },
  { id: 'pri-004', title: 'Update data retention policy', priority: 'medium', impact: 6, effort: 6, urgency: 5, overallScore: 58 },
  { id: 'pri-005', title: 'Automate status notifications', priority: 'low', impact: 4, effort: 7, urgency: 3, overallScore: 42 },
  { id: 'pri-006', title: 'Add workflow visualization', priority: 'informational', impact: 3, effort: 8, urgency: 2, overallScore: 28 },
];

export function RecommendationPrioritiser() {
  const [recommendations] = useState<PrioritisedRecommendation[]>(DEMO_RECOMMENDATIONS);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filtered = selectedPriority === 'all'
    ? recommendations
    : recommendations.filter(r => r.priority === selectedPriority);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Recommendation Prioritiser</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
          <div key={priority} style={{
            padding: '12px',
            background: config.bgColor,
            border: `1px solid ${config.color}20`,
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: config.color, textTransform: 'capitalize' }}>
              {priority}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Score: {config.range}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: config.color, marginTop: '4px' }}>
              {recommendations.filter(r => r.priority === priority).length}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setSelectedPriority('all')}
          style={{
            padding: '6px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: selectedPriority === 'all' ? '#3b82f6' : '#fff',
            color: selectedPriority === 'all' ? '#fff' : '#64748b',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          All
        </button>
        {Object.keys(PRIORITY_CONFIG).map(priority => (
          <button
            key={priority}
            onClick={() => setSelectedPriority(priority)}
            style={{
              padding: '6px 12px',
              border: `1px solid ${PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG].color}40`,
              borderRadius: '6px',
              background: selectedPriority === priority ? PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG].color : '#fff',
              color: selectedPriority === priority ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {priority}
          </button>
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
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Impact</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Effort</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Urgency</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Score</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rec => (
              <tr key={rec.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{rec.title}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>{rec.impact}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>{rec.effort}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#475569' }}>{rec.urgency}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{rec.overallScore}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#fff',
                    background: PRIORITY_CONFIG[rec.priority].color,
                    textTransform: 'capitalize',
                  }}>
                    {rec.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecommendationPrioritiser;
