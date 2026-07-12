import { useState } from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  source: string;
  createdAt: string;
}

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-001',
    title: 'Optimize batch processing for large table migrations',
    description: 'Implement chunked batch processing to handle tables with >1M rows efficiently.',
    category: 'Migration',
    priority: 'high',
    status: 'pending',
    source: 'AI Insights',
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'rec-002',
    title: 'Enable parallel validation for data quality checks',
    description: 'Run validation checks in parallel across multiple data sources.',
    category: 'Migration',
    priority: 'medium',
    status: 'in-progress',
    source: 'AI Framework',
    createdAt: '2026-07-09T14:30:00Z',
  },
  {
    id: 'rec-003',
    title: 'Rotate API keys for production services',
    description: 'All production API keys should be rotated within 30 days.',
    category: 'Security',
    priority: 'critical',
    status: 'pending',
    source: 'Security Audit',
    createdAt: '2026-07-10T08:15:00Z',
  },
  {
    id: 'rec-004',
    title: 'Update data retention policy to meet compliance',
    description: 'Review and update retention policies to align with GDPR requirements.',
    category: 'Governance',
    priority: 'high',
    status: 'pending',
    source: 'Compliance Check',
    createdAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'rec-005',
    title: 'Implement automated rollback procedures',
    description: 'Create automated rollback triggers for failed migration batches.',
    category: 'Risk',
    priority: 'medium',
    status: 'completed',
    source: 'Risk Assessment',
    createdAt: '2026-07-05T11:20:00Z',
  },
  {
    id: 'rec-006',
    title: 'Automate status notifications for workflow steps',
    description: 'Send email/Slack notifications when workflow steps complete.',
    category: 'Workflow',
    priority: 'low',
    status: 'pending',
    source: 'Workflow Analysis',
    createdAt: '2026-07-07T16:45:00Z',
  },
  {
    id: 'rec-007',
    title: 'Scale processing nodes for peak load',
    description: 'Add additional processing nodes during peak migration windows.',
    category: 'Resource',
    priority: 'medium',
    status: 'pending',
    source: 'Capacity Monitor',
    createdAt: '2026-07-06T13:10:00Z',
  },
  {
    id: 'rec-008',
    title: 'Optimize SQL queries for reporting module',
    description: 'Refactor slow-performing queries in the executive dashboard.',
    category: 'Optimization',
    priority: 'high',
    status: 'in-progress',
    source: 'Performance Monitor',
    createdAt: '2026-07-10T07:30:00Z',
  },
];

const CATEGORIES = ['All', 'Migration', 'Security', 'Governance', 'Risk', 'Workflow', 'Resource', 'Optimization'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low', 'Informational'];
const STATUSES = ['All', 'Pending', 'In-Progress', 'Completed', 'Dismissed'];

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
  informational: '#6b7280',
};

export function RecommendationExplorer() {
  const [recommendations] = useState<Recommendation[]>(DEMO_RECOMMENDATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || rec.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || rec.priority === priorityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Recommendation Explorer</h2>

      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
      }}>
        <input
          type="text"
          placeholder="Search recommendations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(rec => (
          <div key={rec.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            borderLeft: `4px solid ${PRIORITY_COLORS[rec.priority]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{rec.title}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#fff',
                  background: PRIORITY_COLORS[rec.priority],
                }}>
                  {rec.priority}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#fff',
                  background: '#6b7280',
                }}>
                  {rec.status}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>{rec.description}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Category: {rec.category}</span>
              <span>Source: {rec.source}</span>
              <span>Created: {new Date(rec.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No recommendations match your filters.</div>
        )}
      </div>
    </div>
  );
}

export default RecommendationExplorer;
