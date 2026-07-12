import { useState } from 'react';

interface SecurityRecommendation {
  id: string;
  title: string;
  type: 'access-control' | 'vulnerability' | 'compliance' | 'authentication';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  affectedSystems: string[];
}

const DEMO_SECURITY_RECOMMENDATIONS: SecurityRecommendation[] = [
  {
    id: 'sec-001',
    title: 'Rotate production API keys',
    type: 'authentication',
    severity: 'critical',
    description: 'All production API keys should be rotated within 30 days per security policy.',
    status: 'open',
    affectedSystems: ['API Gateway', 'Data Pipeline'],
  },
  {
    id: 'sec-002',
    title: 'Enable MFA for admin accounts',
    type: 'access-control',
    severity: 'high',
    description: 'Multi-factor authentication must be enabled for all admin accounts.',
    status: 'in-progress',
    affectedSystems: ['Admin Portal'],
  },
  {
    id: 'sec-003',
    title: 'Patch critical vulnerability in auth library',
    type: 'vulnerability',
    severity: 'critical',
    description: 'Update auth library to patch CVE-2026-1234.',
    status: 'open',
    affectedSystems: ['Auth Service', 'API Gateway'],
  },
  {
    id: 'sec-004',
    title: 'Implement rate limiting on login endpoint',
    type: 'access-control',
    severity: 'medium',
    description: 'Add rate limiting to prevent brute force attacks.',
    status: 'resolved',
    affectedSystems: ['Auth Service'],
  },
  {
    id: 'sec-005',
    title: 'Review SOC2 compliance gaps',
    type: 'compliance',
    severity: 'high',
    description: 'Identify and remediate SOC2 compliance gaps.',
    status: 'open',
    affectedSystems: ['All Systems'],
  },
  {
    id: 'sec-006',
    title: 'Enable encryption at rest for databases',
    type: 'vulnerability',
    severity: 'medium',
    description: 'Enable TDE for all production databases.',
    status: 'in-progress',
    affectedSystems: ['Primary DB', 'Analytics DB'],
  },
];

const TYPE_COLORS: Record<string, string> = {
  'access-control': '#3b82f6',
  vulnerability: '#dc2626',
  compliance: '#8b5cf6',
  authentication: '#f59e0b',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
};

export function SecurityRecommendations() {
  const [recommendations] = useState<SecurityRecommendation[]>(DEMO_SECURITY_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Security Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'access-control', 'vulnerability', 'compliance', 'authentication'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: typeFilter === type ? '#dc2626' : '#fff',
                color: typeFilter === type ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {type === 'all' ? 'All' : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
            borderLeft: `4px solid ${SEVERITY_COLORS[rec.severity]}`,
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
                  background: TYPE_COLORS[rec.type],
                }}>
                  {rec.type}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#fff',
                  background: SEVERITY_COLORS[rec.severity],
                }}>
                  {rec.severity}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>{rec.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              {rec.affectedSystems.map(sys => (
                <span key={sys} style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  background: '#f1f5f9',
                  color: '#64748b',
                }}>
                  {sys}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: rec.status === 'resolved' ? '#10b981' : rec.status === 'in-progress' ? '#3b82f6' : '#f59e0b' }}>
              Status: {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecurityRecommendations;
