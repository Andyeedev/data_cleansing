import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';

interface ExecutionHistoryItem {
  batch_id: string;
  project_id: string | null;
  batch_status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  batch_start_time: string | null;
  batch_end_time: string | null;
}

interface ValidationReport {
  batch_id: string;
  project_id: string | null;
  overall_status: string;
  overall_score: number;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  control_summaries: Array<{
    control_id: string;
    overall_status: string;
    total_rules: number;
    passed_rules: number;
    failed_rules: number;
    error_rules: number;
  }>;
  started_at: string | null;
  completed_at: string | null;
}

interface GovernanceDecision {
  batch_id: string;
  project_id: string | null;
  migration_status: string;
  blocking_controls: number;
  total_failed_rules: number;
  decision_time: string | null;
}

interface RiskScore {
  batch_id: string;
  risk_score: number;
  risk_level: string;
  calculated_at: string | null;
}

interface ComplianceCheck {
  batch_id: string;
  total_exceptions: number;
  critical_exceptions: number;
  high_exceptions: number;
  medium_exceptions: number;
  low_exceptions: number;
  exceptions: Array<{
    exception_id: string;
    control_id: string;
    rule_id: string;
    entity_name: string;
    source_value: string;
    target_value: string;
    delta_value: number | null;
    cause: string;
    failure_scope: string;
    created_at: string | null;
  }>;
}

type ReportTab = 'validation' | 'governance' | 'risk' | 'compliance';

export function ReportsPage() {
  const { userRoles } = useAuth();
  const [batches, setBatches] = useState<ExecutionHistoryItem[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>('validation');
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [governanceDecision, setGovernanceDecision] = useState<GovernanceDecision | null>(null);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [complianceCheck, setComplianceCheck] = useState<ComplianceCheck | null>(null);

  const isAdmin = userRoles.includes('admin');

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    apiGet<{ items: ExecutionHistoryItem[]; total: number }>('/execution/history?page_size=50')
      .then((data) => {
        if (!cancelled) setBatches(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedBatch) return;
    let cancelled = false;
    setReportLoading(true);

    Promise.all([
      apiGet<ValidationReport>(`/execution/${selectedBatch}/report`).catch(() => null),
      apiGet<GovernanceDecision>(`/execution/${selectedBatch}/governance`).catch(() => null),
      apiGet<RiskScore>(`/execution/${selectedBatch}/risk-score`).catch(() => null),
      apiGet<ComplianceCheck>(`/execution/${selectedBatch}/compliance`).catch(() => null),
    ]).then(([validation, governance, risk, compliance]) => {
      if (cancelled) return;
      setValidationReport(validation);
      setGovernanceDecision(governance);
      setRiskScore(risk);
      setComplianceCheck(compliance);
    }).finally(() => {
      if (!cancelled) setReportLoading(false);
    });

    return () => { cancelled = true; };
  }, [selectedBatch]);

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reports</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reports</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const tabs: { key: ReportTab; label: string }[] = [
    { key: 'validation', label: 'Validation Report' },
    { key: 'governance', label: 'Governance Decision' },
    { key: 'risk', label: 'Risk Score' },
    { key: 'compliance', label: 'Compliance' },
  ];

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'var(--color-success, #22c55e)';
      case 'FAILED': return 'var(--color-error, #ef4444)';
      case 'RUNNING': return 'var(--color-warning, #f59e0b)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const riskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'var(--color-success, #22c55e)';
      case 'MEDIUM': return 'var(--color-warning, #f59e0b)';
      case 'HIGH': return 'var(--color-error, #ef4444)';
      case 'CRITICAL': return '#dc2626';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Reports</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Generate and view validation reports for completed executions.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Select Execution Batch
        </label>
        <select
          value={selectedBatch || ''}
          onChange={(e) => setSelectedBatch(e.target.value || null)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: 14,
            minWidth: 300,
          }}
        >
          <option value="">-- Select a batch --</option>
          {batches.map((b) => (
            <option key={b.batch_id} value={b.batch_id}>
              {b.batch_id} — {b.batch_status} ({b.completed_controls}/{b.total_controls} controls)
            </option>
          ))}
        </select>
      </div>

      {selectedBatch && (
        <>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 16px',
                  background: activeTab === tab.key ? 'var(--color-surface)' : 'transparent',
                  border: '1px solid var(--color-border)',
                  borderBottom: activeTab === tab.key ? '1px solid var(--color-surface)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius) var(--radius) 0 0',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {reportLoading ? (
            <LoadingSpinner />
          ) : (
            <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: '0 var(--radius) var(--radius) var(--radius)', background: 'var(--color-surface)' }}>
              {activeTab === 'validation' && validationReport && (
                <ValidationReportView report={validationReport} statusColor={statusColor} />
              )}
              {activeTab === 'validation' && !validationReport && (
                <EmptyReport message="No validation report available for this batch." />
              )}

              {activeTab === 'governance' && governanceDecision && (
                <GovernanceReportView decision={governanceDecision} statusColor={statusColor} />
              )}
              {activeTab === 'governance' && !governanceDecision && (
                <EmptyReport message="No governance decision available for this batch." />
              )}

              {activeTab === 'risk' && riskScore && (
                <RiskReportView risk={riskScore} riskColor={riskColor} />
              )}
              {activeTab === 'risk' && !riskScore && (
                <EmptyReport message="No risk score available for this batch." />
              )}

              {activeTab === 'compliance' && complianceCheck && (
                <ComplianceReportView compliance={complianceCheck} />
              )}
              {activeTab === 'compliance' && !complianceCheck && (
                <EmptyReport message="No compliance data available for this batch." />
              )}
            </div>
          )}
        </>
      )}

      {!selectedBatch && (
        <div style={{
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-background)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-text)' }}>Select a Batch</h3>
          <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Choose an execution batch from the dropdown above to view its validation report, governance decision, risk score, and compliance data.
          </p>
        </div>
      )}
    </div>
  );
}

function ValidationReportView({ report, statusColor }: { report: ValidationReport; statusColor: (s: string) => string }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Validation Report — {report.batch_id}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <MetricCard label="Status" value={report.overall_status} color={statusColor(report.overall_status)} />
        <MetricCard label="Score" value={`${report.overall_score.toFixed(1)}%`} />
        <MetricCard label="Total Controls" value={String(report.total_controls)} />
        <MetricCard label="Completed" value={String(report.completed_controls)} />
        <MetricCard label="Failed" value={String(report.failed_controls)} />
      </div>
      {report.control_summaries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Control</th>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '8px 12px' }}>Total</th>
              <th style={{ textAlign: 'right', padding: '8px 12px' }}>Passed</th>
              <th style={{ textAlign: 'right', padding: '8px 12px' }}>Failed</th>
              <th style={{ textAlign: 'right', padding: '8px 12px' }}>Errors</th>
            </tr>
          </thead>
          <tbody>
            {report.control_summaries.map((c) => (
              <tr key={c.control_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{c.control_id}</td>
                <td style={{ padding: '8px 12px', color: statusColor(c.overall_status) }}>{c.overall_status}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{c.total_rules}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{c.passed_rules}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{c.failed_rules}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{c.error_rules}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function GovernanceReportView({ decision, statusColor }: { decision: GovernanceDecision; statusColor: (s: string) => string }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Governance Decision — {decision.batch_id}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <MetricCard label="Migration Status" value={decision.migration_status} color={statusColor(decision.migration_status)} />
        <MetricCard label="Blocking Controls" value={String(decision.blocking_controls)} />
        <MetricCard label="Total Failed Rules" value={String(decision.total_failed_rules)} />
        <MetricCard label="Decision Time" value={decision.decision_time || '—'} />
      </div>
    </div>
  );
}

function RiskReportView({ risk, riskColor }: { risk: RiskScore; riskColor: (s: string) => string }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Risk Score — {risk.batch_id}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <MetricCard label="Risk Score" value={risk.risk_score.toFixed(1)} />
        <MetricCard label="Risk Level" value={risk.risk_level} color={riskColor(risk.risk_level)} />
        <MetricCard label="Calculated At" value={risk.calculated_at || '—'} />
      </div>
    </div>
  );
}

function ComplianceReportView({ compliance }: { compliance: ComplianceCheck }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Compliance — {compliance.batch_id}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <MetricCard label="Total Exceptions" value={String(compliance.total_exceptions)} />
        <MetricCard label="Critical" value={String(compliance.critical_exceptions)} color={compliance.critical_exceptions > 0 ? '#dc2626' : undefined} />
        <MetricCard label="High" value={String(compliance.high_exceptions)} color={compliance.high_exceptions > 0 ? 'var(--color-error, #ef4444)' : undefined} />
        <MetricCard label="Medium" value={String(compliance.medium_exceptions)} color={compliance.medium_exceptions > 0 ? 'var(--color-warning, #f59e0b)' : undefined} />
        <MetricCard label="Low" value={String(compliance.low_exceptions)} />
      </div>
      {compliance.exceptions.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Control</th>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Rule</th>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Entity</th>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Scope</th>
              <th style={{ textAlign: 'left', padding: '8px 12px' }}>Cause</th>
            </tr>
          </thead>
          <tbody>
            {compliance.exceptions.slice(0, 20).map((ex) => (
              <tr key={ex.exception_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{ex.control_id}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{ex.rule_id}</td>
                <td style={{ padding: '8px 12px' }}>{ex.entity_name}</td>
                <td style={{ padding: '8px 12px' }}>{ex.failure_scope}</td>
                <td style={{ padding: '8px 12px' }}>{ex.cause}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: 12, background: 'var(--color-background)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: color || 'var(--color-text)' }}>{value}</div>
    </div>
  );
}

function EmptyReport({ message }: { message: string }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
      <p style={{ fontSize: 14 }}>{message}</p>
    </div>
  );
}
