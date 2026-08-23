import { useEffect, useState } from 'react';
import { KpiBox, ReportCard, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import { apiGet } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

interface GovFinding {
  id: string;
  type: string;
  description: string;
  severity: string;
  control: string;
  owner: string;
  status: string;
}

interface GovernanceDashboardData {
  overview: {
    total_controls: number;
    passed: number;
    failed: number;
    error: number;
    blocked: number;
    blocking_controls: number;
    total_failed_rules: number;
  };
  findings: GovFinding[];
  severity_dist: Record<string, number>;
  type_dist: Record<string, number>;
  analysis: string;
}

export function GovernanceCentrePage() {
  const { tenantId } = useAuth();
  const [data, setData] = useState<GovernanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const tenantParam = tenantId ? `?tenant_id=${tenantId}` : '';
    apiGet<GovernanceDashboardData>(`/dashboards/governance-centre${tenantParam}`)
      .then(setData)
      .catch(() => setError('Failed to load governance data'))
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading governance centre...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">{error || 'No data'}</div>;

  const ov = data.overview;
  const hasCritical = (data.severity_dist.CRITICAL || 0) > 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Governance Centre</h1>
        <p className="text-sm text-gray-500 mt-1">Findings, severity, and ownership</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiBox label="Total Controls" value={ov.total_controls} tone="info" />
        <KpiBox label="Passed" value={ov.passed} tone="success" />
        <KpiBox label="Failed" value={ov.failed} tone={ov.failed > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Error" value={ov.error} tone={ov.error > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Blocked" value={ov.blocked} tone={ov.blocked > 0 ? 'error' : 'neutral'} />
        <KpiBox label="Failed Rules" value={ov.total_failed_rules} tone={ov.total_failed_rules > 0 ? 'error' : 'neutral'} />
      </div>

      {hasCritical && (
        <div className="rounded-lg border-2 border-red-600 bg-red-50 p-4 mb-6">
          <div className="text-sm font-bold text-red-700 mb-1">CRITICAL FINDINGS</div>
          <p className="text-sm text-red-800">{data.severity_dist.CRITICAL} critical-severity findings require immediate remediation.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ReportCard title="Findings by Type">
          {Object.entries(data.type_dist).length === 0 ? (
            <EmptyState message="No findings." />
          ) : (
            <div className="space-y-3">
              {Object.entries(data.type_dist).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status={type} />
                  <span className="text-sm font-semibold tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard title="Severity Distribution">
          {Object.entries(data.severity_dist).filter(([,v]) => v > 0).length === 0 ? (
            <EmptyState message="No findings by severity." />
          ) : (
            <div className="space-y-3">
              {Object.entries(data.severity_dist).filter(([,v]) => v > 0).map(([sev, count]) => (
                <div key={sev} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status={sev} />
                  <span className="text-sm font-semibold tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      <ReportCard title="All Findings" subtitle={`${data.findings.length} governance findings`} className="mb-6">
        {data.findings.length === 0 ? (
          <EmptyState message="No governance findings." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['ID', 'Type', 'Description', 'Severity', 'Control', 'Owner', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.findings.map((f) => (
                  <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{f.id}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.type} /></td>
                    <td className="px-3 py-2.5 text-gray-700 max-w-xs truncate">{f.description}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.severity} /></td>
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{f.control}</td>
                    <td className="px-3 py-2.5 text-gray-700">{f.owner}</td>
                    <td className="px-3 py-2.5"><StatusPill status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportCard>

      <ReportCard title="Analysis">
        <p className="text-sm text-gray-800 leading-relaxed">{data.analysis}</p>
      </ReportCard>
    </div>
  );
}

export default GovernanceCentrePage;
