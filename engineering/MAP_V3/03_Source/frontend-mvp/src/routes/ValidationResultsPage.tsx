import { useState, useEffect, useRef, useCallback } from 'react';
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
import { ProgressBar } from '../components/shared/ProgressBar';
import { TabBar } from '../components/shared/TabBar';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { EmptyState } from '../components/shared/EmptyState';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';

type TabKey = 'overview' | 'controls' | 'exceptions' | 'governance';

const AUTO_REFRESH_MS = 15000;

export function ValidationResultsPage() {
  const { batchId: urlBatchId } = useParams<{ batchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const { batchId: contextBatchId } = useValidationFilter();
  const [selectedBatchId, setSelectedBatchId] = useState(urlBatchId || contextBatchId || '');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fromRules = searchParams.get('from_rules') === 'true';
  const ruleId = searchParams.get('rule_id');

  useEffect(() => {
    if (ruleId && ruleId.startsWith('C')) {
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

  const refetchAll = useCallback(() => {
    if (selectedBatchId) startPolling(selectedBatchId);
  }, [selectedBatchId, startPolling]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isLive && selectedBatchId) {
      intervalRef.current = setInterval(refetchAll, AUTO_REFRESH_MS);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLive, refetchAll, selectedBatchId]);

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
      <PageContainer>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Validation Results</h1>
        </div>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validation Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            {status
              ? `${status.completed_controls}/${status.total_controls} controls \u2014 ${status.status}`
              : selectedBatchId
                ? `Batch ${selectedBatchId.slice(0, 8)}...`
                : 'Select a batch to view results'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {fromRules && (
            <button
              onClick={() => navigate('/validation/rules')}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              &larr; Back to Rules
            </button>
          )}
          <CascadeDropdowns />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Batch UUID"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-gray-300 bg-white text-gray-700 w-[200px] placeholder:text-gray-400"
            />
            <button
              onClick={() => { if (selectedBatchId) navigate(`/validation/results/${selectedBatchId}`); }}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Load
            </button>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isLive
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {!selectedBatchId && (
        <EmptyState message="No batch selected. Enter a batch ID above to view validation results." />
      )}

      {selectedBatchId && statusError && <ErrorState message={statusError} />}
      {selectedBatchId && reportError && <ErrorState message={reportError} />}
      {selectedBatchId && statusLoading && !status && <LoadingSkeleton rows={4} variant="card" />}

      {selectedBatchId && status && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <KpiBox label="Status" value={status.status} tone={status.status === 'FAILED' ? 'error' : 'success'} />
            <KpiBox label="Progress" value={`${getProgressPercent(status.completed_controls, status.total_controls)}%`} tone="info" />
            <KpiBox label="Total Controls" value={status.total_controls} tone="info" />
            <KpiBox label="Failed" value={status.failed_controls} tone={status.failed_controls > 0 ? 'error' : 'neutral'} />
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <ProgressBar
              value={getProgressPercent(status.completed_controls, status.total_controls)}
              label="Execution Progress"
              showPercentage
              color={status.status === 'FAILED' ? 'var(--color-danger)' : 'var(--color-primary)'}
              height={16}
            />
          </div>

          {/* Tabs */}
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

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard title="Batch Summary">
                {reportLoading ? (
                  <LoadingSkeleton rows={3} variant="card" />
                ) : report ? (
                  <div className="flex flex-col gap-2">
                    <DetailRow label="Batch ID" value={report.batch_id.slice(0, 12) + '...'} mono />
                    <DetailRow label="Overall Status">
                      <StatusPill status={report.overall_status} />
                    </DetailRow>
                    <DetailRow label="Overall Score" value={report.overall_score != null ? `${report.overall_score}%` : '\u2014'} />
                    <DetailRow label="Started" value={report.started_at ? new Date(report.started_at).toLocaleString() : '\u2014'} />
                    <DetailRow label="Completed" value={report.completed_at ? new Date(report.completed_at).toLocaleString() : '\u2014'} />
                  </div>
                ) : (
                  <EmptyState message="Report data is not available for this batch." />
                )}
              </ReportCard>

              <ReportCard title="Risk Score">
                {riskLoading ? (
                  <LoadingSkeleton rows={3} variant="card" />
                ) : riskScore ? (
                  <div className="flex flex-col gap-2">
                    <DetailRow label="Risk Level">
                      <StatusPill status={riskScore.risk_level} />
                    </DetailRow>
                    <DetailRow label="Risk Score" value={riskScore.risk_score} />
                    <DetailRow label="Calculated At" value={riskScore.calculated_at ? new Date(riskScore.calculated_at).toLocaleString() : '\u2014'} />
                  </div>
                ) : (
                  <EmptyState message="Risk score is not available for this batch." />
                )}
              </ReportCard>
            </div>
          )}

          {/* ===== CONTROLS TAB ===== */}
          {activeTab === 'controls' && (
            <ReportCard title="Control Results" subtitle={`${report?.control_summaries?.length || 0} controls`}>
              {reportLoading ? (
                <LoadingSkeleton rows={5} variant="card" />
              ) : report?.control_summaries && report.control_summaries.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 z-[1]">
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Control ID</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passed</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Failed</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skipped</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.control_summaries.map((control) => (
                        <tr
                          key={control.control_id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedControlId(control.control_id)}
                        >
                          <td className="px-3 py-2.5 font-mono text-gray-900">{control.control_id.slice(0, 12)}...</td>
                          <td className="px-3 py-2.5">
                            <StatusPill status={control.overall_status} />
                          </td>
                          <td className="px-3 py-2.5 text-gray-700">{control.total_rules}</td>
                          <td className="px-3 py-2.5 text-green-700 font-semibold">{control.passed_rules}</td>
                          <td className="px-3 py-2.5 text-red-700 font-semibold">{control.failed_rules}</td>
                          <td className="px-3 py-2.5 text-gray-500">{control.skipped_rules || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No control data available for this batch." />
              )}
            </ReportCard>
          )}

          {/* ===== CONTROL RULES MODAL ===== */}
          {selectedControlId && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedControlId(null)}
            >
              <div
                className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-[900px] max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 m-0">Control Rules: {selectedControlId}</h3>
                  <button
                    onClick={() => setSelectedControlId(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg bg-transparent border-none cursor-pointer p-1 transition-colors"
                  >
                    &times;
                  </button>
                </div>
                <div className="px-6 py-4">
                  {rulesLoading ? (
                    <div className="py-8 text-center text-sm text-gray-400">Loading rules...</div>
                  ) : rulesError ? (
                    <div className="py-8 text-center text-sm text-red-600">{rulesError}</div>
                  ) : controlRules && controlRules.length > 0 ? (
                    <div className="overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rule ID</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delta</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time (s)</th>
                            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {controlRules.map((rule) => (
                            <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-2.5 font-mono text-[11px] text-gray-900">{rule.rule_id}</td>
                              <td className="px-3 py-2.5 text-gray-700">{rule.entity_name}</td>
                              <td className="px-3 py-2.5">
                                <StatusPill status={rule.execution_status} />
                              </td>
                              <td className="px-3 py-2.5 text-gray-700">{rule.delta_value ?? '\u2014'}</td>
                              <td className="px-3 py-2.5 text-gray-700">{rule.execution_time_seconds?.toFixed(2) ?? '\u2014'}</td>
                              <td className="px-3 py-2.5">
                                {rule.detail_json && Object.keys(rule.detail_json).length > 0 ? (
                                  <details className="cursor-pointer">
                                    <summary className="text-blue-600 text-[11px] font-medium hover:text-blue-800 transition-colors">View Details</summary>
                                    <pre className="mt-1 text-[11px] bg-gray-50 p-2 rounded overflow-auto max-h-[200px] font-mono text-gray-700">
                                      {JSON.stringify(rule.detail_json, null, 2)}
                                    </pre>
                                  </details>
                                ) : (
                                  <span className="text-gray-400 text-[11px]">No details</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-400">No rules found for this control.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== EXCEPTIONS TAB ===== */}
          {activeTab === 'exceptions' && (
            <ReportCard title="Compliance Exceptions" subtitle={`${compliance?.exceptions?.length || 0} exceptions`}>
              {complianceLoading ? (
                <LoadingSkeleton rows={5} variant="card" />
              ) : compliance && compliance.exceptions && compliance.exceptions.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 z-[1]">
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delta</th>
                        <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cause</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compliance.exceptions.map((ex) => (
                        <tr key={ex.exception_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2.5 text-gray-700">{ex.entity_name}</td>
                          <td className="px-3 py-2.5 font-mono text-gray-900">{ex.source_value}</td>
                          <td className="px-3 py-2.5 font-mono text-gray-900">{ex.target_value}</td>
                          <td className={`px-3 py-2.5 font-semibold ${ex.delta_value && ex.delta_value !== 0 ? 'text-red-700' : 'text-gray-700'}`}>
                            {ex.delta_value ?? '\u2014'}
                          </td>
                          <td className="px-3 py-2.5 text-gray-700">{ex.cause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No compliance exceptions found for this batch." />
              )}
            </ReportCard>
          )}

          {/* ===== GOVERNANCE TAB ===== */}
          {activeTab === 'governance' && (
            <ReportCard title="Governance Decision">
              {govLoading ? (
                <LoadingSkeleton rows={3} variant="card" />
              ) : governance ? (
                <div className="flex flex-col gap-2">
                  <DetailRow label="Migration Status">
                    <StatusPill status={governance.migration_status} />
                  </DetailRow>
                  <DetailRow label="Blocking Controls">
                    <span className={governance.blocking_controls > 0 ? 'text-red-700 font-semibold' : 'text-gray-700'}>
                      {governance.blocking_controls}
                    </span>
                  </DetailRow>
                  <DetailRow label="Total Failed Rules" value={governance.total_failed_rules} />
                  <DetailRow label="Decision Time" value={governance.decision_time ? new Date(governance.decision_time).toLocaleString() : '\u2014'} />
                </div>
              ) : (
                <EmptyState message="Governance decision is not available for this batch." />
              )}
            </ReportCard>
          )}
        </>
      )}
    </PageContainer>
  );
}

function DetailRow({ label, value, mono, children }: {
  label: string; value?: string | number | null; mono?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-gray-500">{label}</span>
      {children ? children : <span className={mono ? 'font-mono text-gray-900' : 'text-gray-700'}>{value ?? '\u2014'}</span>}
    </div>
  );
}
