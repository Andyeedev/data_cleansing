import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMigrationOverview } from '../hooks/useMigration';
import { useReportSuite } from '../hooks/useReports';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { TenantFilter } from '../components/shared/TenantFilter';
import { KpiBox, ReportCard, StatusPill, EmptyState } from '../components/reports/reportWidgets';

export function MigrationOverviewNew() {
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { overview, loading, error, refetch } = useMigrationOverview(selectedTenant || undefined);
  const { data: suite, loading: suiteLoading, error: suiteError } = useReportSuite(selectedTenant || undefined);

  if (loading) {
    return <LoadingOverlay message="Loading overview..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Migration Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Summary of all migration activity across projects and batches</p>
          </div>
        </div>
        <ReportCard title="Error">
          <ErrorState message={error} onRetry={refetch} />
        </ReportCard>
      </PageContainer>
    );
  }

  const stats = overview || {
    total_projects: 0,
    total_batches: 0,
    total_controls: 0,
    completed_controls: 0,
    total_datasets: 0,
    active_projects: 0,
    active_batches: 0,
    health_score: 0,
    recent_activity: [],
    top_projects: [],
  };

  const formatTimeAgo = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  };

  // Use CSS variable colors via arbitrary values to match original page
  const primaryColor = 'var(--color-primary)';
  const successColor = 'var(--color-success)';
  const warningColor = 'var(--color-warning)';
  const dangerColor = 'var(--color-danger)';
  const successBg = 'var(--color-success-50)';
  const dangerBg = 'var(--color-danger-50)';
  const infoBg = 'var(--color-info-50)';
  const successBorder = 'var(--color-success-100)';
  const dangerBorder = 'var(--color-danger-100)';
  const successText = 'var(--color-success-700)';
  const dangerText = 'var(--color-danger-700)';
  const infoText = 'var(--color-info-700)';

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Migration Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Summary of all migration activity across projects and batches</p>
        </div>
        <div className="flex items-center gap-3">
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={refetch}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ========== ROW 2: All white-frame cards ========== */}
      <div className="space-y-6">

        {/* CARD 1: Key Metrics - 6-col KpiBox grid */}
        <ReportCard title="Key Metrics" className="bg-blue-50 border-blue-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <KpiBox label="Projects" value={stats.total_projects} tone="info" />
            <KpiBox label="Batches" value={stats.total_batches} tone="info" />
            <KpiBox label="Controls" value={stats.total_controls} tone="info" />
            <KpiBox label="Datasets" value={stats.total_datasets} tone="info" />
            <KpiBox label="Active Projects" value={stats.active_projects} tone="success" />
            <KpiBox label="Active Batches" value={stats.active_batches} tone="warning" />
          </div>
        </ReportCard>

        {/* CARD 2: Health Score + Quick Actions (2-col) - matches original layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Health Score - matches original horizontal bar style */}
          <ReportCard title="Health Score" subtitle="Overall migration readiness" className="h-full">
            <div className="py-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-gray-900 min-w-[80px]">{stats.health_score}%</div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stats.health_score}%`, background: stats.health_score >= 80 ? successColor : stats.health_score >= 50 ? warningColor : dangerColor }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center w-full mt-6">
                <div className={`p-3 rounded-lg border ${successBg} ${successBorder}`}>
                  <div className="text-2xl font-bold" style={{ color: successText }}>{stats.completed_controls}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className={`p-3 rounded-lg border ${dangerBg} ${dangerBorder}`}>
                  <div className="text-2xl font-bold" style={{ color: dangerText }}>{stats.total_controls - stats.completed_controls}</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
                <div className={infoBg}>
                  <div className="text-2xl font-bold" style={{ color: infoText }}>{stats.total_controls}</div>
                  <div className="text-xs text-gray-500">Total Controls</div>
                </div>
              </div>
            </div>
          </ReportCard>

          {/* Quick Actions - using CSS variables for colors */}
          <ReportCard title="Quick Actions" className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                className="px-4 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-colors"
                style={{ background: primaryColor, color: 'white' }}
                onClick={() => navigate('/migration/projects')}
              >
                View Projects
              </button>
              <button
                className="px-4 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-colors"
                style={{ background: successColor, color: 'white' }}
                onClick={() => navigate('/migration/datasets')}
              >
                Upload Dataset
              </button>
              <button
                className="px-4 py-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--color-text)' }}
                onClick={() => navigate('/migration/reports')}
              >
                View Reports
              </button>
            </div>
          </ReportCard>
        </div>

        {/* CARD 3: Recent Activity - table format matching original */}
        <ReportCard title="Recent Activity" subtitle={`${stats.recent_activity.length} recent actions`} className="mb-6">
          {stats.recent_activity.length === 0 ? (
            <EmptyState message="No recent activity." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Entity</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_activity.slice(0, 15).map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5">
                        <StatusPill status={entry.status} />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-sm text-gray-900">{entry.entity_name}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">
                        {formatTimeAgo(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportCard>

        {/* CARD 4: Top Projects by Progress - matches original exactly with CSS var colors */}
        <ReportCard title="Top Projects by Progress" subtitle="10-phase execution model" className="mb-6">
          {stats.top_projects.length === 0 ? (
            <EmptyState message="No projects with batches yet." />
          ) : (
            <div className="space-y-4">
              {stats.top_projects.map((project) => {
                const pct = project.total_batches > 0
                  ? Math.round((project.completed_batches / project.total_batches) * 100)
                  : 0;
                const pctColor = pct >= 80 ? successColor : pct >= 50 ? warningColor : dangerColor;
                return (
                  <div key={project.project_name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">{project.project_name}</span>
                      <span className="text-xs text-gray-500">{pct}% ({project.completed_batches}/{project.total_batches})</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: pctColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ReportCard>

        {/* CARD 5: Entity Mapping - matching Reports → Migration → Entity Mapping exactly */}
        <ReportCard title="Entity Mapping" subtitle={`${suite?.migration?.entity_mapping?.total ?? 0} entities mapped`} className="mb-6">
          {suiteLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : suiteError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Failed to load entity mapping: {suiteError}
            </div>
          ) : !suite?.migration?.entity_mapping?.entities?.length ? (
            <EmptyState message="No entity mappings available. Run schema mapping to discover entity relationships." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Source Entity', 'Target Entity', 'Source Records', 'Target Records', 'Match %', 'Status'].map((h, i) => (
                      <th key={h} className={`px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${i >= 2 && i <= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suite.migration.entity_mapping.entities.map((e, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-medium text-gray-900">{e.source}</td>
                      <td className="px-3 py-2.5 text-gray-700">{e.target}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{e.source_columns}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{e.target_columns}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{e.match_pct}</td>
                      <td className="px-3 py-2.5"><StatusPill status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportCard>

      </div>
    </PageContainer>
  );
}