import { useState } from 'react';

interface ComplianceReport {
  id: string;
  title: string;
  period: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  requirements: {
    id: string;
    name: string;
    status: 'met' | 'partial' | 'not-met';
    evidence: string;
  }[];
  auditTrail: {
    action: string;
    timestamp: string;
    user: string;
  }[];
}

const DEMO_COMPLIANCE_REPORT: ComplianceReport = {
  id: 'comp-001',
  title: 'GDPR Compliance Report',
  period: 'Q3 2026',
  status: 'compliant',
  requirements: [
    { id: 'req-001', name: 'Data Encryption at Rest', status: 'met', evidence: 'AES-256 encryption enabled for all databases' },
    { id: 'req-002', name: 'Data Encryption in Transit', status: 'met', evidence: 'TLS 1.3 enforced for all connections' },
    { id: 'req-003', name: 'Access Control', status: 'met', evidence: 'RBAC implemented with MFA for admin access' },
    { id: 'req-004', name: 'Audit Logging', status: 'met', evidence: 'Comprehensive audit trails for all data operations' },
    { id: 'req-005', name: 'Data Retention', status: 'partial', evidence: 'Retention policy updated, 95% of tables migrated' },
    { id: 'req-006', name: 'Right to Erasure', status: 'met', evidence: 'Automated data purge capabilities implemented' },
  ],
  auditTrail: [
    { action: 'Compliance check completed', timestamp: '2026-07-10T10:00:00Z', user: 'System' },
    { action: 'Audit log reviewed', timestamp: '2026-07-09T16:00:00Z', user: 'Compliance Officer' },
    { action: 'Access control updated', timestamp: '2026-07-08T14:00:00Z', user: 'Admin' },
  ],
};

const STATUS_CONFIG: Record<string, { color: string; bgColor: string }> = {
  met: { color: '#10b981', bgColor: '#f0fdf4' },
  partial: { color: '#f59e0b', bgColor: '#fffbeb' },
  'not-met': { color: '#dc2626', bgColor: '#fef2f2' },
};

export function ComplianceReport() {
  const [report] = useState<ComplianceReport>(DEMO_COMPLIANCE_REPORT);

  const metCount = report.requirements.filter(r => r.status === 'met').length;
  const partialCount = report.requirements.filter(r => r.status === 'partial').length;
  const complianceRate = Math.round((metCount / report.requirements.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{report.title}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{report.period}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: complianceRate === 100 ? '#10b981' : '#f59e0b' }}>{complianceRate}%</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Compliance</div>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#fff',
            background: report.status === 'compliant' ? '#10b981' : report.status === 'partial' ? '#f59e0b' : '#dc2626',
            textTransform: 'capitalize',
          }}>
            {report.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{metCount}</div>
          <div style={{ fontSize: '12px', color: '#166534' }}>Requirements Met</div>
        </div>
        <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{partialCount}</div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>Partially Met</div>
        </div>
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>{report.requirements.length}</div>
          <div style={{ fontSize: '12px', color: '#475569' }}>Total Requirements</div>
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Requirement</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {report.requirements.map(req => (
              <tr key={req.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{req.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: STATUS_CONFIG[req.status].bgColor,
                    color: STATUS_CONFIG[req.status].color,
                    textTransform: 'capitalize',
                  }}>
                    {req.status.replace('-', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>{req.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>Audit Trail</h3>
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {report.auditTrail.map((entry, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{entry.action}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{entry.user}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComplianceReport;
