import { useEffect, useState } from 'react';
import { KpiBox, ReportCard, StatusPill, BarList, EmptyState } from '../components/reports/reportWidgets';
import { apiGet } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

interface RiskOverview {
  risk_level: string;
  risk_score: number;
  blocking_controls: number;
  failed_rules: number;
  total_controls: number;
  pass_rate: number;
}

interface GoNoGo {
  decision: string;
  decision_class: string;
  risk_level: string;
  risk_score: number;
  factors: string[];
  minimum_requirements: string[];
}

interface Risk {
  id: string;
  risk: string;
  severity: string;
  impact: string;
  mitigation: string;
  status: string;
}

interface RiskDashboardData {
  overview: RiskOverview;
  go_no_go: GoNoGo;
  risks: Risk[];
  analysis: string;
}

export function RiskAssessmentPage() {
  const { tenantId } = useAuth();
  const [data, setData] = useState<RiskDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const tenantParam = tenantId ? `?tenant_id=${tenantId}` : '';
    apiGet<RiskDashboardData>(`/dashboards/risk-assessment${tenantParam}`)
      .then(setData)
      .catch(() => setError('Failed to load risk assessment data'))
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading risk assessment...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">{error || 'No data'}</div>;

  const ov = data.overview;
  const gng = data.go_no_go;
  const decisionBg = gng.decision_class === 'go' ? 'bg-green-50 border-green-600' : gng.decision_class === 'conditional' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-600';
  const decisionText = gng.decision_class === 'go' ? 'text-green-700' : gng.decision_class === 'conditional' ? 'text-yellow-700' : 'text-red-700';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
        <p className="text-sm text-gray-500 mt-1">Overall risk evaluation and go/no-go decision</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KpiBox label="Risk Level" value={ov.risk_level} tone={ov.risk_level === 'Low' ? 'success' : ov.risk_level === 'Medium' ? 'warning' : 'error'} />
        <KpiBox label="Risk Score" value={`${ov.risk_score}%`} tone={ov.risk_score >= 80 ? 'success' : ov.risk_score >= 60 ? 'warning' : 'error'} />
        <KpiBox label="Pass Rate" value={`${ov.pass_rate}%`} tone={ov.pass_rate >= 80 ? 'success' : 'warning'} />
        <KpiBox label="Blocking Controls" value={ov.blocking_controls} tone={ov.blocking_controls > 0 ? 'error' : 'success'} />
        <KpiBox label="Failed Rules" value={ov.failed_rules} tone={ov.failed_rules > 0 ? 'error' : 'success'} />
        <KpiBox label="Total Controls" value={ov.total_controls} tone="info" />
      </div>

      <ReportCard title="Go / No-Go Decision" className="mb-6">
        <div className={`rounded-lg border-2 ${decisionBg} p-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-3xl font-bold ${decisionText}`}>{gng.decision}</div>
            <div className="text-sm text-gray-600">
              <div className="font-semibold">Risk Level: {gng.risk_level}</div>
              <div>Score: {gng.risk_score}%</div>
            </div>
          </div>
          {gng.factors.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Contributing Factors</div>
              <div className="flex flex-wrap gap-2">
                {gng.factors.map((f, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">{f}</span>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Minimum Requirements for GO</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {gng.minimum_requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </ReportCard>

      <ReportCard title="Top Risks" subtitle={`${data.risks.length} open risk(s)`} className="mb-6">
        {data.risks.length === 0 ? (
          <EmptyState message="No open risks identified." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['#', 'Risk', 'Severity', 'Impact', 'Mitigation', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.risks.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{r.id}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-900">{r.risk}</td>
                    <td className="px-3 py-2.5"><StatusPill status={r.severity} /></td>
                    <td className="px-3 py-2.5 text-gray-700">{r.impact}</td>
                    <td className="px-3 py-2.5 text-gray-700">{r.mitigation}</td>
                    <td className="px-3 py-2.5"><StatusPill status={r.status} /></td>
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

export default RiskAssessmentPage;
