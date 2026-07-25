import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';

export function ReportsPage() {
  const { userRoles } = useAuth();

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reports</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const reportTypes = [
    { id: 'validation', label: 'Validation Report', desc: 'Rule execution summary, pass/fail counts, exception details', api: '/execution/{batch_id}/report' },
    { id: 'governance', label: 'Governance Decision', desc: 'Blocking controls, failed rules, release gate status', api: '/execution/{batch_id}/governance' },
    { id: 'risk-score', label: 'Risk Score', desc: 'Weighted risk assessment, critical/high/medium/low breakdown', api: '/execution/{batch_id}/risk-score' },
    { id: 'compliance', label: 'Compliance', desc: 'Regulatory compliance checks, audit trail, certification status', api: '/execution/{batch_id}/compliance' },
    { id: 'audit', label: 'Audit Report', desc: 'Full execution audit trail, timestamps, user actions, changes', api: '/execution/{batch_id}/audit' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reports</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Generate and view validation reports for completed executions.
      </p>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        {reportTypes.map((report, idx) => (
          <div
            key={report.id}
            style={{
              padding: '20px 24px',
              borderBottom: idx < reportTypes.length - 1 ? '1px solid var(--color-border)' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 4 }}>{report.label}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{report.desc}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, fontFamily: 'monospace' }}>
                Requires: <code>{report.api}</code>
              </div>
            </div>
            <button
              disabled
              style={{
                padding: '8px 16px',
                background: 'var(--color-background)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'not-allowed',
                fontSize: 14,
              }}
            >
              Unavailable
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: 'var(--color-background)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          <strong>Note:</strong> All report endpoints require backend Phase 07.6.1 implementation.
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Missing APIs: <code>/report</code>, <code>/governance</code>, <code>/risk-score</code>, <code>/compliance</code>, <code>/audit</code>.
          Reports will be generated on-demand for a specific batch ID.
        </div>
      </div>
    </div>
  );
}