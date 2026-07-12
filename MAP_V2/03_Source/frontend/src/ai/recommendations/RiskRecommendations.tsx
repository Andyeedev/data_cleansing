import { useState } from 'react';

interface RiskRecommendation {
  id: string;
  title: string;
  strategy: 'mitigation' | 'avoidance' | 'transfer' | 'acceptance';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
  status: 'identified' | 'in-progress' | 'mitigated';
}

const DEMO_RISK_RECOMMENDATIONS: RiskRecommendation[] = [
  {
    id: 'risk-001',
    title: 'Data loss during batch migration',
    strategy: 'mitigation',
    riskLevel: 'critical',
    description: 'Large batch operations risk partial data loss on failure.',
    mitigation: 'Implement checkpoint-based recovery and transaction logging.',
    status: 'in-progress',
  },
  {
    id: 'risk-002',
    title: 'Schema incompatibility between source and target',
    strategy: 'avoidance',
    riskLevel: 'high',
    description: 'Schema differences may cause data type mismatches.',
    mitigation: 'Perform schema compatibility analysis before migration.',
    status: 'identified',
  },
  {
    id: 'risk-003',
    title: 'Performance degradation during migration',
    strategy: 'transfer',
    riskLevel: 'medium',
    description: 'Migration load may impact production performance.',
    mitigation: 'Schedule migrations during low-traffic windows.',
    status: 'mitigated',
  },
  {
    id: 'risk-004',
    title: 'Compliance violation during data transfer',
    strategy: 'mitigation',
    riskLevel: 'high',
    description: 'Data transfer across regions may violate GDPR.',
    mitigation: 'Implement data residency controls and encryption.',
    status: 'in-progress',
  },
  {
    id: 'risk-005',
    title: 'Resource exhaustion during large migrations',
    strategy: 'mitigation',
    riskLevel: 'medium',
    description: 'Large migrations may exhaust system resources.',
    mitigation: 'Implement resource limits and auto-scaling.',
    status: 'identified',
  },
  {
    id: 'risk-006',
    title: 'Third-party service dependency failure',
    strategy: 'acceptance',
    riskLevel: 'low',
    description: 'External API failures may temporarily block migration.',
    mitigation: 'Implement retry logic and circuit breakers.',
    status: 'mitigated',
  },
];

const STRATEGY_COLORS: Record<string, string> = {
  mitigation: '#3b82f6',
  avoidance: '#10b981',
  transfer: '#8b5cf6',
  acceptance: '#6b7280',
};

const RISK_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
};

export function RiskRecommendations() {
  const [recommendations] = useState<RiskRecommendation[]>(DEMO_RISK_RECOMMENDATIONS);
  const [strategyFilter, setStrategyFilter] = useState<string>('all');

  const filtered = strategyFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.strategy === strategyFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Risk Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'mitigation', 'avoidance', 'transfer', 'acceptance'].map(strategy => (
            <button
              key={strategy}
              onClick={() => setStrategyFilter(strategy)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: strategyFilter === strategy ? '#3b82f6' : '#fff',
                color: strategyFilter === strategy ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
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
            borderTop: `3px solid ${RISK_COLORS[rec.riskLevel]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{rec.title}</h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#fff',
                  background: STRATEGY_COLORS[rec.strategy],
                }}>
                  {rec.strategy}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#fff',
                  background: RISK_COLORS[rec.riskLevel],
                }}>
                  {rec.riskLevel}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>{rec.description}</p>
            <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px', fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
              <strong>Mitigation:</strong> {rec.mitigation}
            </div>
            <div style={{
              fontSize: '12px',
              color: rec.status === 'mitigated' ? '#10b981' : rec.status === 'in-progress' ? '#3b82f6' : '#f59e0b',
            }}>
              Status: {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiskRecommendations;
