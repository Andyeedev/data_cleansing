import { useState } from 'react';

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  generatedAt: string;
  author: string;
  quality: number;
}

const DEMO_REPORTS: Report[] = [
  { id: 'rpt-001', title: 'Q3 Migration Progress Report', type: 'executive', status: 'published', generatedAt: '2026-07-10T10:00:00Z', author: 'AI Generator', quality: 95 },
  { id: 'rpt-002', title: 'Data Quality Analysis', type: 'technical', status: 'reviewed', generatedAt: '2026-07-10T09:30:00Z', author: 'AI Generator', quality: 88 },
  { id: 'rpt-003', title: 'Compliance Audit Summary', type: 'compliance', status: 'generated', generatedAt: '2026-07-09T16:00:00Z', author: 'AI Generator', quality: 92 },
  { id: 'rpt-004', title: 'Security Posture Overview', type: 'security', status: 'published', generatedAt: '2026-07-09T14:00:00Z', author: 'AI Generator', quality: 90 },
  { id: 'rpt-005', title: 'Operational Metrics Dashboard', type: 'operational', status: 'draft', generatedAt: '2026-07-08T11:00:00Z', author: 'AI Generator', quality: 85 },
  { id: 'rpt-006', title: 'Governance Policy Review', type: 'governance', status: 'generated', generatedAt: '2026-07-07T09:00:00Z', author: 'AI Generator', quality: 87 },
  { id: 'rpt-007', title: 'Migration Risk Assessment', type: 'migration', status: 'published', generatedAt: '2026-07-06T15:00:00Z', author: 'AI Generator', quality: 91 },
  { id: 'rpt-008', title: 'Custom Analytics Report', type: 'custom', status: 'draft', generatedAt: '2026-07-05T10:00:00Z', author: 'AI Generator', quality: 78 },
];

const TYPES = ['All', 'executive', 'operational', 'migration', 'governance', 'security', 'compliance', 'technical', 'custom'];
const STATUSES = ['All', 'draft', 'generated', 'reviewed', 'published'];

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

export function ReportGeneratorExplorer() {
  const [reports] = useState<Report[]>(DEMO_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Report Explorer</h2>

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
          placeholder="Search reports..."
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
        >
          {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(report => (
          <div key={report.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            borderTop: `3px solid ${TYPE_COLORS[report.type]}`,
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>{report.title}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: TYPE_COLORS[report.type],
                textTransform: 'capitalize',
              }}>
                {report.type}
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: '#6b7280',
                textTransform: 'capitalize',
              }}>
                {report.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>Quality: {report.quality}%</span>
              <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No reports match your filters.</div>
        )}
      </div>
    </div>
  );
}

export default ReportGeneratorExplorer;
