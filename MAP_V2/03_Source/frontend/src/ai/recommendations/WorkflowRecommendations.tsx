import { useState } from 'react';

interface WorkflowRecommendation {
  id: string;
  title: string;
  type: 'process' | 'automation' | 'efficiency' | 'quality';
  priority: 'high' | 'medium' | 'low';
  description: string;
  benefit: string;
  status: 'proposed' | 'approved' | 'implemented';
}

const DEMO_WORKFLOW_RECOMMENDATIONS: WorkflowRecommendation[] = [
  {
    id: 'wf-001',
    title: 'Automate status notifications for workflow steps',
    type: 'automation',
    priority: 'medium',
    description: 'Send email/Slack notifications when workflow steps complete.',
    benefit: 'Improves team coordination',
    status: 'proposed',
  },
  {
    id: 'wf-002',
    title: 'Implement parallel task execution',
    type: 'efficiency',
    priority: 'high',
    description: 'Execute independent workflow tasks in parallel.',
    benefit: 'Reduces total workflow time by 35%',
    status: 'approved',
  },
  {
    id: 'wf-003',
    title: 'Add workflow dependency visualization',
    type: 'process',
    priority: 'low',
    description: 'Display workflow dependencies as a visual graph.',
    benefit: 'Improves understanding of workflow structure',
    status: 'proposed',
  },
  {
    id: 'wf-004',
    title: 'Implement automated retry for failed steps',
    type: 'automation',
    priority: 'high',
    description: 'Automatically retry failed workflow steps up to 3 times.',
    benefit: 'Reduces manual intervention by 60%',
    status: 'implemented',
  },
  {
    id: 'wf-005',
    title: 'Add quality gates between workflow stages',
    type: 'quality',
    priority: 'medium',
    description: 'Validate data quality before proceeding to next stage.',
    benefit: 'Prevents propagation of data issues',
    status: 'approved',
  },
  {
    id: 'wf-006',
    title: 'Implement workflow templates',
    type: 'process',
    priority: 'low',
    description: 'Create reusable templates for common workflow patterns.',
    benefit: 'Reduces workflow setup time by 50%',
    status: 'proposed',
  },
];

const TYPE_COLORS: Record<string, string> = {
  process: '#3b82f6',
  automation: '#10b981',
  efficiency: '#8b5cf6',
  quality: '#f59e0b',
};

const STATUS_COLORS: Record<string, string> = {
  proposed: '#f59e0b',
  approved: '#3b82f6',
  implemented: '#10b981',
};

export function WorkflowRecommendations() {
  const [recommendations] = useState<WorkflowRecommendation[]>(DEMO_WORKFLOW_RECOMMENDATIONS);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === typeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Workflow Recommendations</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'process', 'automation', 'efficiency', 'quality'].map(type => (
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
            <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '4px', fontSize: '12px', color: '#166534', marginBottom: '8px' }}>
              <strong>Benefit:</strong> {rec.benefit}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>Priority: {rec.priority}</span>
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

export default WorkflowRecommendations;
