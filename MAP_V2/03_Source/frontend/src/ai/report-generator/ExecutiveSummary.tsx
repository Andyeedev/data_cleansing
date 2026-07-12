import { useState } from 'react';

interface ExecutiveReport {
  id: string;
  title: string;
  period: string;
  status: 'draft' | 'final';
  sections: {
    title: string;
    content: string;
  }[];
  kpis: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const DEMO_EXECUTIVE_REPORT: ExecutiveReport = {
  id: 'exec-001',
  title: 'Q3 2026 Executive Summary',
  period: 'July - September 2026',
  status: 'final',
  sections: [
    {
      title: 'Overview',
      content: 'The MAP Nexus migration initiative has achieved remarkable progress this quarter, surpassing key targets and delivering significant value to the organization.',
    },
    {
      title: 'Key Achievements',
      content: 'Successfully migrated 2.4 million records with 99.7% data integrity. Completed project 2 weeks ahead of schedule with 40% cost savings.',
    },
    {
      title: 'Strategic Impact',
      content: 'The migration enables real-time analytics capabilities, improves customer experience through faster data access, and positions the organization for future growth.',
    },
  ],
  kpis: [
    { label: 'Migration Completion', value: '94%', trend: 'up' },
    { label: 'Data Integrity', value: '99.7%', trend: 'up' },
    { label: 'Cost Savings', value: '$1.2M', trend: 'up' },
    { label: 'Timeline', value: '2 weeks early', trend: 'up' },
  ],
};

const TREND_ICONS: Record<string, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const TREND_COLORS: Record<string, string> = {
  up: '#10b981',
  down: '#dc2626',
  stable: '#64748b',
};

export function ExecutiveSummary() {
  const [report] = useState<ExecutiveReport>(DEMO_EXECUTIVE_REPORT);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{report.title}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{report.period}</p>
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#fff',
          background: report.status === 'final' ? '#10b981' : '#f59e0b',
          textTransform: 'capitalize',
        }}>
          {report.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {report.kpis.map(kpi => (
          <div key={kpi.label} style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: `4px solid ${TREND_COLORS[kpi.trend]}`,
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{kpi.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{kpi.value}</span>
              <span style={{ fontSize: '16px', color: TREND_COLORS[kpi.trend] }}>{TREND_ICONS[kpi.trend]}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {report.sections.map((section, i) => (
          <div key={i} style={{
            padding: '20px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>{section.title}</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: 0 }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutiveSummary;
