import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePollBatchStatus } from '../hooks/useExecution';
import {
  useValidationReport,
  useGovernanceDecision,
  useRiskScore,
  useComplianceChecks,
  useControlRules
} from '../hooks/useValidation';
import { useAuth } from '../context/AuthContext';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { MetricCard } from '../components/shared/MetricCard';
import { TabBar } from '../components/shared/TabBar';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { PageHeader } from '../components/PageHeader/PageHeader';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';

type TabKey = 'overview' | 'controls' | 'exceptions' | 'governance';

export function ValidationResultsPage() {
  const { batchId: urlBatchId } = useParams<{ batchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const { batchId: contextBatchId } = useValidationFilter();
  const [selectedBatchId, setSelectedBatchId] = useState(urlBatchId || contextBatchId || '');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);

  // Check if coming from Rules page
  const fromRules = searchParams.get('from_rules') === 'true';
  const ruleId = searchParams.get('rule_id');
  const mappingId = searchParams.get('mapping_id');

  // Auto-select control if coming from rules with rule_id
  useEffect(() => {
    if (ruleId && ruleId.startsWith('C')) {
      // Extract control_id from rule_id (e.g., C02_BALANCE_RECON -> C02)
      const controlIdMatch = ruleId.match(/^C(\d+)_/);
      const controlId = controlIdMatch ? `C${controlIdMatch[1]}` : ruleId;
      setSelectedControlId(controlId);
    }
  }, [ruleId]);

  const { data: controlRules, loading: rulesLoading, error: rulesError } = useControlRules(
    selectedBatchId || null,
    selectedControlId
  );

  useEffect(() => {
    if (contextBatchId && contextBatchId !== selectedBatchId) {
      setSelectedBatchId(contextBatchId);
    }
  }, [contextBatchId]);

  const { status, loading: statusLoading, error: statusError, startPolling, stopPolling } = usePollBatchStatus();
  const { data: report, loading: reportLoading, error: reportError } = useValidationReport(selectedBatchId || null);
  const { data: governance, loading: govLoading } = useGovernanceDecision(selectedBatchId || null);
  const { data: riskScore, loading: riskLoading } = useRiskScore(selectedBatchId || null);
  const { data: compliance, loading: complianceLoading } = useComplianceChecks(selectedBatchId || null);

  useEffect(() => {
    if (selectedBatchId) {
      startPolling(selectedBatchId);
    }
    return () => stopPolling();
  }, [selectedBatchId, startPolling, stopPolling]);

  const getProgressPercent = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Results</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Validation Results"
        description="Detailed validation report for a specific batch"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            {fromRules && (
              <button
                onClick={() => navigate('/validation/rules')}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-secondary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                }}
              >
                ← Back to Rules
              </button>
            )}
            <CascadeDropdowns />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>or enter Batch ID:</span>
            <input
              type="text"
              placeholder="Batch UUID"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-size-sm)',
                width: 200,
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={() => {
                if (selectedBatchId) {
                  navigate(`/validation/results/${selectedBatchId}`);
                }
              }}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500,
              }}
            >
              Load
            </button>
</div>
        }
      />
      {!selectedBatchId && (
        <EmptyState
          title="No batch selected"
          description="Enter a batch ID above to view validation results."
        />
      )}

      {selectedBatchId && statusError && <ErrorState message={statusError} />}
      {selectedBatchId && reportError && <ErrorState message={reportError} />}

      {selectedBatchId && statusLoading && !status && <LoadingSkeleton rows={4} variant="card" />}

      {selectedBatchId && status && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Status" value={status.status} color={status.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-success)'} />
            <MetricCard title="Progress" value={`${getProgressPercent(status.completed_controls, status.total_controls)}%`} />
            <MetricCard title="Total Controls" value={status.total_controls} />
            <MetricCard title="Failed" value={status.failed_controls} color={status.failed_controls > 0 ? 'var(--color-danger)' : undefined} />
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <ProgressBar
              value={getProgressPercent(status.completed_controls, status.total_controls)}
              label="Execution Progress"
              showPercentage
              color={status.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-primary)'}
              height={16}
            />
          </div>

          <TabBar
            tabs={[
              { key: 'overview', label: 'Overview' },
              { key: 'controls', label: 'Controls' },
              { key: 'exceptions', label: 'Exceptions' },
              { key: 'governance', label: 'Governance' },
            ]}
            activeTab={activeTab}
            onTabChange={(key) => setActiveTab(key as TabKey)}
          />

          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Batch Summary</h4>
                {reportLoading ? (
                  <LoadingSkeleton rows={3} variant="card" />
                ) : report ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Batch ID</span>
                      <span style={{ fontFamily: 'monospace' }}>{report.batch_id.slice(0, 12)}...</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Overall Status</span>
                      <StatusBadge status={report.overall_status} size="sm" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Overall Score</span>
                      <span>{report.overall_score ?? '—'}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Started</span>
                      <span>{report.started_at ? new Date(report.started_at).toLocaleString() : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Completed</span>
                      <span>{report.completed_at ? new Date(report.completed_at).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No report data" description="Report data is not available for this batch." />
                )}
              </div>

              <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Risk Score</h4>
                {riskLoading ? (
                  <LoadingSkeleton rows={3} variant="card" />
                ) : riskScore ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Risk Level</span>
                      <StatusBadge status={riskScore.risk_level} size="sm" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Risk Score</span>
                      <span>{riskScore.risk_score}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Calculated At</span>
                      <span>{riskScore.calculated_at ? new Date(riskScore.calculated_at).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No risk data" description="Risk score is not available for this batch." />
                )}
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Control Results</h4>
              {reportLoading ? (
                <LoadingSkeleton rows={5} variant="card" />
              ) : report?.control_summaries && report.control_summaries.length > 0 ? (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Control ID</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Total</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Passed</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Failed</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Skipped</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.control_summaries.map((control) => (
                        <tr
                          key={control.control_id}
                          style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                          onClick={() => setSelectedControlId(control.control_id)}
                        >
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{control.control_id.slice(0, 12)}...</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                            <StatusBadge status={control.overall_status} size="sm" />
                          </td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{control.total_rules}</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-success)' }}>{control.passed_rules}</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', color: control.failed_rules > 0 ? 'var(--color-danger)' : undefined }}>
                            {control.failed_rules}
                          </td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', color: control.skipped_rules > 0 ? 'var(--color-warning)' : undefined }}>
                            {control.skipped_rules || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No controls" description="No control data available for this batch." />
              )}
</div>
          )}

          {selectedControlId && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setSelectedControlId(null)}
            >
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)',
                  maxWidth: '900px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ margin: 0 }}>Control Rules: {selectedControlId}</h3>
                  <button
                    onClick={() => setSelectedControlId(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 'var(--font-size-lg)',
                      cursor: 'pointer',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    ×
                  </button>
                </div>

                {rulesLoading ? (
                  <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Loading rules...
                  </div>
                ) : rulesError ? (
                  <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-danger)' }}>
                    {rulesError}
                  </div>
                ) : controlRules && controlRules.length > 0 ? (
                  <div style={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Rule ID</th>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Entity</th>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Delta</th>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Time (s)</th>
                          <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {controlRules.map((rule) => (
                          <tr key={rule.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{rule.rule_id}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{rule.entity_name}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={rule.execution_status} size="sm" />
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{rule.delta_value ?? '—'}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{rule.execution_time_seconds?.toFixed(2) ?? '—'}</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              {rule.detail_json && Object.keys(rule.detail_json).length > 0 ? (
                                <details style={{ cursor: 'pointer' }}>
                                  <summary style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>View Details</summary>
                                  <pre style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', padding: 'var(--space-sm)', borderRadius: 'var(--radius)', overflow: 'auto', maxHeight: '200px' }}>
                                    {JSON.stringify(rule.detail_json, null, 2)}
                                  </pre>
                                </details>
                              ) : (
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>No details</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No rules found for this control.
                  </div>
                )}
              </div>
            </div>
          )}

        {activeTab === 'exceptions' && (
            <div>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Compliance Exceptions</h4>
              {complianceLoading ? (
                <LoadingSkeleton rows={5} variant="card" />
              ) : compliance && compliance.exceptions && compliance.exceptions.length > 0 ? (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'auto',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Entity</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Source</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Target</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Delta</th>
                        <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Cause</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compliance.exceptions.map((ex) => (
                        <tr key={ex.exception_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{ex.entity_name}</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{ex.source_value}</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{ex.target_value}</td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)', color: ex.delta_value && ex.delta_value !== 0 ? 'var(--color-danger)' : undefined }}>
                            {ex.delta_value ?? '—'}
                          </td>
                          <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{ex.cause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No exceptions" description="No compliance exceptions found for this batch." />
              )}
            </div>
          )}

          {activeTab === 'governance' && (
            <div>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Governance Decision</h4>
              {govLoading ? (
                <LoadingSkeleton rows={3} variant="card" />
              ) : governance ? (
                <div style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Migration Status</span>
                      <StatusBadge status={governance.migration_status} size="sm" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Blocking Controls</span>
                      <span style={{ color: governance.blocking_controls > 0 ? 'var(--color-danger)' : undefined }}>
                        {governance.blocking_controls}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Total Failed Rules</span>
                      <span>{governance.total_failed_rules}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Decision Time</span>
                      <span>{governance.decision_time ? new Date(governance.decision_time).toLocaleString() : '—'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState title="No governance data" description="Governance decision is not available for this batch." />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
