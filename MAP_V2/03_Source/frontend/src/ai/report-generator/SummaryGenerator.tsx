import { useState } from 'react';

interface Summary {
  id: string;
  type: 'executive' | 'technical' | 'compliance' | 'risk' | 'performance';
  title: string;
  content: string;
  highlights: string[];
}

const DEMO_SUMMARIES: Summary[] = [
  {
    id: 'sum-001',
    type: 'executive',
    title: 'Q3 Executive Summary',
    content: 'The migration project has achieved 94% completion with 99.7% data integrity. All critical milestones have been met ahead of schedule.',
    highlights: ['94% completion rate', '99.7% data integrity', '2 weeks ahead of schedule', '40% cost savings'],
  },
  {
    id: 'sum-002',
    type: 'technical',
    title: 'Technical Performance Summary',
    content: 'System performance metrics indicate optimal operation across all migration pipelines. Average processing time reduced by 57%.',
    highlights: ['57% faster processing', 'Zero downtime incidents', '99.9% system availability'],
  },
  {
    id: 'sum-003',
    type: 'compliance',
    title: 'Compliance Status Summary',
    content: 'All regulatory requirements have been met. Audit trails are complete and documentation is up to date.',
    highlights: ['100% regulatory compliance', 'Complete audit trails', 'Updated documentation'],
  },
  {
    id: 'sum-004',
    type: 'risk',
    title: 'Risk Assessment Summary',
    content: 'Overall risk level is LOW. All critical vulnerabilities have been remediated. Monitoring systems are fully operational.',
    highlights: ['LOW overall risk', 'All critical issues resolved', 'Active monitoring in place'],
  },
  {
    id: 'sum-005',
    type: 'performance',
    title: 'Performance Metrics Summary',
    content: 'Key performance indicators show consistent improvement across all metrics. SLA compliance at 99.5%.',
    highlights: ['99.5% SLA compliance', '35% throughput increase', '60% reduction in manual work'],
  },
];

const TYPE_COLORS: Record<string, string> = {
  executive: '#8b5cf6',
  technical: '#3b82f6',
  compliance: '#10b981',
  risk: '#dc2626',
  performance: '#f59e0b',
};

export function SummaryGenerator() {
  const [summaries] = useState<Summary[]>(DEMO_SUMMARIES);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = selectedType === 'all'
    ? summaries
    : summaries.filter(s => s.type === selectedType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Summary Generator</h2>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'executive', 'technical', 'compliance', 'risk', 'performance'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: selectedType === type ? '#3b82f6' : '#fff',
              color: selectedType === type ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
        {filtered.map(summary => (
          <div key={summary.id} style={{
            padding: '20px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            borderTop: `4px solid ${TYPE_COLORS[summary.type]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{summary.title}</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: TYPE_COLORS[summary.type],
                textTransform: 'capitalize',
              }}>
                {summary.type}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px 0' }}>{summary.content}</p>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>Key Highlights</h4>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              {summary.highlights.map((h, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummaryGenerator;
