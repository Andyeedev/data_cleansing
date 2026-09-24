import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useSubscription } from '../hooks/useSubscription';
import { apiGet } from '../utils/apiClient';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';

interface PortfolioSummary {
  total_systems: number;
  total_batches: number;
  total_controls: number;
  active_batches: number;
}

interface MigrationScoreEntry {
  batch_id: string;
  total_controls: number;
  passed_controls: number;
  pass_rate: number;
}

interface ActivityEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
}

interface ControlResult {
  control_id: string;
  control_name: string;
  severity: string;
  status: string;
  total_rules: number;
  passed_rules: number;
  failed_rules: number;
  error_rules: number;
  pass_rate: number;
}

interface RecentExecution {
  batch_id: string;
  batch_name: string;
  batch_status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  batch_start_time: string;
}

const AUTO_REFRESH_MS = 15000;

function UsageLimitCard({ label, current, max }: {
  label: string;
  current: number;
  max: number;
  usagePercent: number;
  isNearLimit: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const color = pct >= 100 ? 'bg-red-500 border-red-200 text-red-700' : pct >= 80 ? 'bg-amber-500 border-amber-200 text-amber-700' : 'bg-green-500 border-green-200 text-green-700';
  const bgColor = pct >= 100 ? 'bg-red-50' : pct >= 80 ? 'bg-amber-50' : 'bg-green-50';
  const borderColor = pct >= 100 ? 'border-red-200' : pct >= 80 ? 'border-amber-200' : 'border-green-200';

  return (
    <div className={`p-4 rounded-lg border ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">{current}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${color}`}>
          {pct >= 100 ? 'Limit reached' : pct >= 80 ? 'Near limit' : 'Within limits'}
        </span>
        <span className="text-gray-500">{pct}% used</span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const { availableProjects } = useProject();
  const [selectedTenant, setSelectedTenant] = useState('');
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [migrationScores, setMigrationScores] = useState<MigrationScoreEntry[]>([]);
  const [controlResults, setControlResults] = useState<ControlResult[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([]);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSuperAdmin = userRoles.some(r => r === 'Super Admin');
  const isAdmin = userRoles.some(r => r === 'admin' || r === 'Super Admin' || r === 'Tenant Admin');
  const isManager = userRoles.includes('manager');
  const isExecutive = isAdmin || isManager;
  const { subscription, isNearLimit, usagePercent } = useSubscription();

  const fetchData = useCallback(async () => {
    let cancelled = false;
    const tid = selectedTenant || undefined;

    const [portfolioData, activityData, migrationData, controlData, execData] = await Promise.all([
      apiGet<PortfolioSummary>('/dashboard/portfolio', tid ? { tenant_id: tid } : undefined).catch(() => null),
      isExecutive ? apiGet<{ entries: ActivityEntry[]; total: number }>('/dashboard/activity', { limit: 10, ...(tid ? { tenant_id: tid } : {}) }).catch(() => null) : Promise.resolve(null),
      apiGet<{ migration_scores: MigrationScoreEntry[] }>('/execution/migration-score-summary', tid ? { tenant_id: tid } : undefined).catch(() => null),
      apiGet<{ controls: ControlResult[] }>('/dashboard/control-results', { limit: 20, ...(tid ? { tenant_id: tid } : {}) }).catch(() => null),
      apiGet<{ executions: RecentExecution[] }>('/dashboard/recent-executions', { limit: 10, ...(tid ? { tenant_id: tid } : {}) }).catch(() => null),
    ]);

    if (cancelled) return;
    if (portfolioData) setPortfolio(portfolioData);
    if (activityData) setActivity(activityData.entries || []);
    if (migrationData) setMigrationScores(migrationData.migration_scores || []);
    if (controlData) setControlResults(controlData.controls || []);
    if (execData) setRecentExecutions(execData.executions || []);
    setLoading(false);

    return () => { cancelled = true; };
  }, [selectedTenant, isExecutive]);

  useEffect(() => {
    setLoading(true);
    const cleanup = fetchData();
    return () => { cleanup?.then?.(fn => fn?.()); };
  }, [fetchData]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isLive && !loading) {
      intervalRef.current = setInterval(() => { fetchData(); }, AUTO_REFRESH_MS);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLive, loading, fetchData]);

  const healthScore = portfolio ? Math.min(100, Math.round(
    ((portfolio.total_controls > 0 ? 85 : 50) +
     (portfolio.active_batches > 0 ? 90 : 60)) / 2
  )) : 0;

  const totalRules = controlResults.reduce((sum, c) => sum + c.total_rules, 0);
  const passedRules = controlResults.reduce((sum, c) => sum + c.passed_rules, 0);
  const failedRules = controlResults.reduce((sum, c) => sum + c.failed_rules, 0);
  const errorRules = controlResults.reduce((sum, c) => sum + c.error_rules, 0);
  const skippedRules = controlResults.reduce((sum, c) => sum + (c.total_rules - c.passed_rules - c.failed_rules - c.error_rules), 0);

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {portfolio
              ? `${portfolio.total_controls} controls across ${portfolio.total_systems} systems \u2014 ${portfolio.active_batches} active batches`
              : 'Executive overview of migration health and validation status'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          )}
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

      {(availableProjects.length === 0 || userRoles.some(r => r === 'Super Admin')) && (
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h2 className="text-lg font-bold text-blue-900">Welcome to MAP Nexus</h2>
            <p className="text-sm text-blue-700">
              {availableProjects.length === 0
                ? 'Get started by creating your first migration project.'
                : 'Access onboarding wizard to set up projects across tenants.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/onboarding/welcome')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Onboarding →
          </button>
        </div>
      )}

      {/* Usage Limit Cards — Phase 4 P3 Usage UX */}
      {subscription && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Usage Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UsageLimitCard
              label="Projects"
              current={subscription.limits.projects.current}
              max={subscription.limits.projects.max}
              usagePercent={usagePercent('projects')}
              isNearLimit={isNearLimit('projects')}
            />
            <UsageLimitCard
              label="Users"
              current={subscription.limits.users.current}
              max={subscription.limits.users.max}
              usagePercent={usagePercent('users')}
              isNearLimit={isNearLimit('users')}
            />
            <UsageLimitCard
              label="Systems"
              current={subscription.limits.connections.current}
              max={subscription.limits.connections.max}
              usagePercent={usagePercent('connections')}
              isNearLimit={isNearLimit('connections')}
            />
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton rows={4} variant="card" />
      ) : (
        <>
          {/* KPI Cards — Row 1 */}
          {isExecutive && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
              <KpiBox label="Total Systems" value={portfolio?.total_systems ?? 0} tone="info" />
              <KpiBox label="Total Batches" value={portfolio?.total_batches ?? 0} tone="info" />
              <KpiBox label="Total Controls" value={portfolio?.total_controls ?? 0} tone="info" />
              <KpiBox label="Active Batches" value={portfolio?.active_batches ?? 0} tone="warning" />
              <KpiBox label="Pass Rate" value={`${migrationScores.length > 0 ? (migrationScores.reduce((s, m) => s + m.pass_rate, 0) / migrationScores.length).toFixed(1) : 0}%`} tone={migrationScores.length > 0 && (migrationScores.reduce((s, m) => s + m.pass_rate, 0) / migrationScores.length) >= 80 ? 'success' : 'warning'} />
              <KpiBox label="Health Score" value={`${healthScore}%`} tone={healthScore >= 80 ? 'success' : healthScore >= 50 ? 'warning' : 'error'} />
            </div>
          )}

          {/* Control Results & Recent Executions — Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ReportCard title="Control Results" subtitle={`${controlResults.length} controls executed`} className="h-full">
              {controlResults.length === 0 ? (
                <EmptyState message="No control outcomes for this batch." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        {['Control', 'Name', 'Severity', 'Status', 'Total', 'Passed', 'Failed', 'Error', 'Pass Rate'].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {controlResults.slice(0, 10).map((c, idx) => (
                        <tr key={`${c.control_id}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.control_id}</td>
                          <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[200px] truncate">{c.control_name}</td>
                          <td className="px-3 py-2.5"><StatusPill status={c.severity} /></td>
                          <td className="px-3 py-2.5"><StatusPill status={c.status} /></td>
                          <td className="px-3 py-2.5 tabular-nums text-gray-700">{c.total_rules}</td>
                          <td className="px-3 py-2.5 tabular-nums text-green-700">{c.passed_rules}</td>
                          <td className="px-3 py-2.5 tabular-nums text-red-700">{c.failed_rules}</td>
                          <td className="px-3 py-2.5 tabular-nums text-orange-700">{c.error_rules}</td>
                          <td className="px-3 py-2.5 tabular-nums text-gray-700">{c.pass_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ReportCard>

            <ReportCard title="Recent Executions" subtitle={`${recentExecutions.length} recent runs`} className="h-full">
              {recentExecutions.length === 0 ? (
                <EmptyState message="No recent executions." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        {['Batch', 'Status', 'Controls', 'Completed', 'Failed', 'Started'].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentExecutions.map((e) => (
                        <tr key={e.batch_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{e.batch_id.slice(0, 8)}...</td>
                          <td className="px-3 py-2.5"><StatusPill status={e.batch_status} /></td>
                          <td className="px-3 py-2.5 tabular-nums text-gray-700">{e.total_controls}</td>
                          <td className="px-3 py-2.5 tabular-nums text-green-700">{e.completed_controls}</td>
                          <td className="px-3 py-2.5 tabular-nums text-red-700">{e.failed_controls}</td>
                          <td className="px-3 py-2.5 text-xs text-gray-500">{e.batch_start_time ? new Date(e.batch_start_time).toLocaleString() : '\u2014'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ReportCard>
          </div>

          {/* Health Score & Migration Score — Row 3 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ReportCard title="Health Score" className="h-full">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48 mb-6">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke={healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(healthScore / 100) * 314.16} 314.16`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{healthScore}%</span>
                    <span className="text-xs text-gray-500">Health Score</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{passedRules}</div>
                    <div className="text-xs text-gray-500">Passed</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-700">{failedRules + errorRules}</div>
                    <div className="text-xs text-gray-500">Failed/Error</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-2xl font-bold text-gray-700">{totalRules}</div>
                    <div className="text-xs text-gray-500">Total Rules</div>
                  </div>
                </div>
              </div>
            </ReportCard>

            <ReportCard title="Migration Score Summary" className="h-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <KpiBox label="Total Batches" value={migrationScores.length} tone="info" />
                <KpiBox label="Avg Pass Rate" value={`${migrationScores.length > 0 ? (migrationScores.reduce((s, m) => s + m.pass_rate, 0) / migrationScores.length).toFixed(1) : 0}%`} tone={migrationScores.length > 0 && (migrationScores.reduce((s, m) => s + m.pass_rate, 0) / migrationScores.length) >= 80 ? 'success' : 'warning'} />
                <KpiBox label="Fully Passed" value={migrationScores.filter(m => m.pass_rate === 100).length} tone="success" />
                <KpiBox label="Needs Attention" value={migrationScores.filter(m => m.pass_rate < 80).length} tone={migrationScores.filter(m => m.pass_rate < 80).length > 0 ? 'warning' : 'success'} />
              </div>
              <div className="space-y-3">
                {migrationScores.slice(0, 5).map((m) => (
                  <div key={m.batch_id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 font-mono">{m.batch_id.slice(0, 8)}...</span>
                      <span className="text-sm font-semibold text-gray-900">{m.pass_rate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${m.pass_rate}%` }} />
                    </div>
                  </div>
                ))}
                {migrationScores.length === 0 && (
                  <EmptyState message="No migration score data available." />
                )}
              </div>
            </ReportCard>
          </div>

          {/* Rule Breakdown & Activity — Row 4 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ReportCard title="Rule Breakdown" subtitle={`${totalRules} total rules across ${controlResults.length} controls`} className="h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status="PASSED" />
                  <span className="text-sm font-semibold tabular-nums text-green-700">{passedRules}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status="FAILED" />
                  <span className="text-sm font-semibold tabular-nums text-red-700">{failedRules}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status="ERROR" />
                  <span className="text-sm font-semibold tabular-nums text-orange-700">{errorRules}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <StatusPill status="SKIPPED" />
                  <span className="text-sm font-semibold tabular-nums text-gray-700">{skippedRules}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <StatusPill status="TOTAL" />
                  <span className="text-sm font-semibold tabular-nums text-gray-900">{totalRules}</span>
                </div>
                {totalRules === 0 && <EmptyState message="No rule data available." />}
              </div>
            </ReportCard>

            <ReportCard title="Recent Activity" subtitle={`${activity.length} recent actions`} className="h-full">
              {activity.length === 0 ? (
                <EmptyState message="No recent activity." />
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activity.slice(0, 15).map((entry) => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusPill status={entry.action} />
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-mono">{entry.entity_type}</div>
                            <div className="text-xs text-gray-500">{entry.entity_id}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ReportCard>
          </div>
        </>
      )}
    </PageContainer>
  );
}
