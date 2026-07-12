import { useState } from 'react';

interface GeneratedReport {
  id: string;
  title: string;
  type: 'executive' | 'operational' | 'migration' | 'governance' | 'security' | 'compliance' | 'technical' | 'custom';
  status: 'draft' | 'generated' | 'reviewed' | 'published';
  generatedAt: string;
  quality: number;
}

const DEMO_REPORTS: GeneratedReport[] = [
  { id: 'rpt-001', title: 'Q3 Migration Progress Report', type: 'executive', status: 'published', generatedAt: '2026-07-10T10:00:00Z', quality: 95 },
  { id: 'rpt-002', title: 'Data Quality Analysis', type: 'technical', status: 'reviewed', generatedAt: '2026-07-10T09:30:00Z', quality: 88 },
  { id: 'rpt-003', title: 'Compliance Audit Summary', type: 'compliance', status: 'generated', generatedAt: '2026-07-09T16:00:00Z', quality: 92 },
  { id: 'rpt-004', title: 'Security Posture Overview', type: 'security', status: 'published', generatedAt: '2026-07-09T14:00:00Z', quality: 90 },
  { id: 'rpt-005', title: 'Operational Metrics Dashboard', type: 'operational', status: 'draft', generatedAt: '2026-07-08T11:00:00Z', quality: 85 },
  { id: 'rpt-006', title: 'Governance Policy Review', type: 'governance', status: 'generated', generatedAt: '2026-07-07T09:00:00Z', quality: 87 },
];

const TYPE_COLORS: Record<string, string> = {
  executive: '#8b5cf6',
  operational: '#3b82f6',
  migration: '#10b981',
  governance: '#f59e0b',
  security: '#dc2626',
  compliance: '#06b6d4',
  technical: '#6366f1',
  custom: '#64748b',
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8',
  generated: '#3b82f6',
  reviewed: '#f59e0b',
  published: '#10b981',
};

export function ReportGeneratorDashboard() {
  const [reports] = useState<GeneratedReport[]>(DEMO_REPORTS);

  const stats = {
    total: reports.length,
    published: reports.filter(r => r.status === 'published').length,
    avgQuality: Math.round(reports.reduce((a, b) => a + b.quality, 0) / reports.length),
    byType: Object.entries(TYPE_COLORS).map(([type, color]) => ({
      type,
      count: reports.filter(r => r.type === type).length,
      color,
    })),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Report Generator Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Reports', value: stats.total, color: '#3b82f6' },
          { label: 'Published', value: stats.published, color: '#10b981' },
          { label: 'Avg Quality', value: `${stats.avgQuality}%`, color: '#8b5cf6' },
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

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>Reports by Type</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {stats.byType.filter(t => t.count > 0).map(item => (
            <div key={item.type} style={{
              padding: '12px 16px',
              background: '#fff',
              border: `1px solid ${item.color}30`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: '13px', color: '#475569', textTransform: 'capitalize' }}>{item.type}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Report</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Quality</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Generated</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{report.title}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#fff',
                    background: TYPE_COLORS[report.type],
                    textTransform: 'capitalize',
                  }}>
                    {report.type}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#fff',
                    background: STATUS_COLORS[report.status],
                    textTransform: 'capitalize',
                  }}>
                    {report.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${report.quality}%`, height: '100%', background: report.quality >= 90 ? '#10b981' : report.quality >= 70 ? '#f59e0b' : '#dc2626', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#475569' }}>{report.quality}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{new Date(report.generatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportGeneratorDashboard;
