import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDiagnosticSummary, useDiagnosticDetail, useRunDiagnostics, useTestHistory } from '../hooks/useDiagnostics';
import { SplitPane } from '../components/shared/SplitPane';
import { TabBar } from '../components/shared/TabBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';
import type { DiagnosticResult, TestHistoryEntry } from '../types/systems';

const HEALTH_ICONS: Record<string, string> = {
  pass: '\u2705',
  fail: '\u274C',
  warning: '\u26A0\uFE0F',
};

const HEALTH_COLORS: Record<string, string> = {
  pass: 'text-green-600',
  fail: 'text-red-600',
  warning: 'text-yellow-600',
};

const STATUS_PILL: Record<string, string> = {
  healthy: 'ACTIVE',
  unhealthy: 'FAILED',
  unknown: 'WARNING',
};

export function ConnectionDiagnosticsPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('health');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useDiagnosticSummary();
  const { data: detail, loading: detailLoading, error: detailError } = useDiagnosticDetail(selectedSystemId);
  const { data: history, loading: historyLoading } = useTestHistory(selectedSystemId);
  const { runDiagnostics, loading: running } = useRunDiagnostics();

  const handleRunDiagnostic = useCallback(async () => {
    if (!selectedSystemId) return;
    await runDiagnostics(selectedSystemId);
    refetchSummary();
  }, [selectedSystemId, runDiagnostics, refetchSummary]);

  const handleExportReport = useCallback(() => {
    if (!detail) return;
    const report = {
      system: detail,
      generated_at: new Date().toISOString(),
      report_id: `CD-${Date.now()}`,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${detail.system_name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [detail]);

  if (!userRoles.includes('admin')) {
    return (
      <PageContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4">Connection Diagnostics</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </PageContainer>
    );
  }

  if (summaryLoading) return <PageContainer><LoadingSkeleton rows={4} variant="card" /></PageContainer>;
  if (summaryError) return <PageContainer><ErrorState message={summaryError} onRetry={refetchSummary} /></PageContainer>;

  const systemsList = (
    <div className="p-4 h-full flex flex-col">
      <div className="text-sm font-semibold text-gray-900 mb-3">Systems</div>

      {summary && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <KpiBox label="Total" value={summary.total_systems} tone="neutral" />
          <KpiBox label="Healthy" value={summary.healthy_systems} tone="success" />
          <KpiBox label="Unhealthy" value={summary.unhealthy_systems} tone={summary.unhealthy_systems > 0 ? 'error' : 'neutral'} />
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search systems..." />

      <div className="flex-1 overflow-auto mt-2">
        <SystemListInner searchQuery={searchQuery} selectedSystemId={selectedSystemId} onSelect={setSelectedSystemId} />
      </div>
    </div>
  );

  const detailPanel = selectedSystemId ? (
    <SystemDetailPanel
      systemId={selectedSystemId}
      detail={detail}
      detailLoading={detailLoading}
      detailError={detailError}
      history={history}
      historyLoading={historyLoading}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onRunDiagnostic={handleRunDiagnostic}
      onExport={handleExportReport}
      running={running}
    />
  ) : (
    <div className="p-6 flex items-center justify-center h-full">
      <EmptyState title="Select a system" description="Click a system in the left panel to view diagnostics." />
    </div>
  );

  return (
    <PageContainer>
      <div className="mb-4">
        <nav className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <button onClick={() => navigate('/migration/connections')} className="text-blue-600 hover:underline">
            Connections
          </button>
          <span>/</span>
          <span className="text-gray-900">Diagnostics</span>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/migration/connections')}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              &larr; Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Connection Diagnostics</h1>
              <div className="text-sm text-gray-500 mt-0.5">
                Health checks and connection profiling for all systems
              </div>
            </div>
          </div>
          {summary && (
            <div className="text-sm text-gray-500">
              Overall Health: <strong className="text-gray-900">{summary.overall_health_percent}%</strong>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 'calc(100% - 70px)' }}>
        <SplitPane
          left={systemsList}
          right={detailPanel}
          defaultLeftWidth={30}
          storageKey="diagnostics-split-width"
        />
      </div>
    </PageContainer>
  );
}

function SystemListInner({ searchQuery, selectedSystemId, onSelect }: {
  searchQuery: string;
  selectedSystemId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [systems, setSystems] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('../utils/apiClient').then(({ apiGet }) => {
      apiGet<DiagnosticResult[]>('/diagnostics')
        .then(setSystems)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed'))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <LoadingSkeleton rows={5} variant="list" />;
  if (error) return <ErrorState message={error} />;

  const filtered = systems.filter((s) =>
    s.system_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.database_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.system_role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) return <EmptyState title="No systems found" description="No systems match your search." />;

  return (
    <div className="flex flex-col gap-1">
      {filtered.map((sys) => {
        const isSelected = sys.system_id === selectedSystemId;
        return (
          <div
            key={sys.system_id}
            onClick={() => onSelect(isSelected ? null : sys.system_id)}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${sys.system_name}, ${sys.database_type}, ${sys.system_role}, status ${sys.overall_status}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(isSelected ? null : sys.system_id); } }}
            className={`p-2.5 rounded-md cursor-pointer transition-colors ${
              isSelected
                ? 'border border-blue-500 bg-blue-50'
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <div className="font-medium text-sm text-gray-900">{sys.system_name}</div>
                <div className="text-xs text-gray-500">
                  {sys.database_type} · {sys.system_role}
                </div>
              </div>
              <StatusPill status={STATUS_PILL[sys.overall_status] || 'WARNING'} />
            </div>
            {sys.health_checks.length > 0 && (
              <div className="flex gap-2 mt-1 text-xs">
                {sys.health_checks.slice(0, 3).map((c, i) => (
                  <span key={i} className={HEALTH_COLORS[c.status]}>{HEALTH_ICONS[c.status]} {c.name}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SystemDetailPanel({ systemId, detail, detailLoading, detailError, history, historyLoading, activeTab, onTabChange, onRunDiagnostic, onExport, running }: {
  systemId: string;
  detail: DiagnosticResult | null;
  detailLoading: boolean;
  detailError: string | null;
  history: TestHistoryEntry[];
  historyLoading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRunDiagnostic: () => void;
  onExport: () => void;
  running: boolean;
}) {
  const tabs = [
    { key: 'health', label: 'Health' },
    { key: 'profile', label: 'Profile' },
    { key: 'history', label: 'History' },
    { key: 'schema', label: 'Schema' },
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      {detailLoading && <LoadingSkeleton rows={3} variant="card" />}
      {detailError && <ErrorState message={detailError} />}
      {!detailLoading && !detailError && detail && (
        <>
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">{detail.system_name}</div>
              <div className="text-xs text-gray-500">
                {detail.database_type} · {detail.system_role} ·{' '}
                <StatusPill status={STATUS_PILL[detail.overall_status] || 'WARNING'} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onRunDiagnostic}
                disabled={running}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {running ? 'Running...' : 'Run Diagnostics'}
              </button>
              <button
                onClick={onExport}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
              >
                Export
              </button>
            </div>
          </div>

          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

          <div className="flex-1 overflow-auto mt-3">
            {activeTab === 'health' && <HealthTab detail={detail} />}
            {activeTab === 'profile' && <ProfileTab detail={detail} />}
            {activeTab === 'history' && <HistoryTab history={history} loading={historyLoading} />}
            {activeTab === 'schema' && <SchemaTab />}
          </div>
        </>
      )}
      {!detailLoading && !detailError && !detail && (
        <EmptyState title="No diagnostic data" description="Run diagnostics to see results." />
      )}
    </div>
  );
}

function HealthTab({ detail }: { detail: DiagnosticResult }) {
  if (detail.health_checks.length === 0) {
    return <EmptyState title="No health checks" description="Run diagnostics to see health check results." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {detail.health_checks.map((check, idx) => (
        <div
          key={idx}
          aria-label={`${check.name}: ${check.status}${check.latency_ms ? `, ${check.latency_ms}ms` : ''}`}
          className={`flex items-center gap-3 p-3 rounded-md border ${
            check.status === 'pass'
              ? 'border-green-200 bg-green-50'
              : check.status === 'fail'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <span className="text-base w-6 text-center flex-shrink-0">
            {HEALTH_ICONS[check.status]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900">{check.name}</div>
            <div className="text-xs text-gray-500">{check.message}</div>
          </div>
          {check.latency_ms !== undefined && (
            <div className="font-mono text-xs text-gray-500">
              {check.latency_ms}ms
            </div>
          )}
          {check.server_version && (
            <div className="text-xs text-gray-500 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              {check.server_version}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ detail }: { detail: DiagnosticResult }) {
  const passCount = detail.health_checks.filter((c) => c.status === 'pass').length;
  const failCount = detail.health_checks.filter((c) => c.status === 'fail').length;
  const totalCount = detail.health_checks.length;
  const avgLatency = detail.health_checks
    .filter((c) => c.latency_ms !== undefined)
    .reduce((sum, c, _, arr) => sum + (c.latency_ms || 0) / arr.length, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiBox label="Overall Status" value={detail.overall_status} tone="neutral" />
      <KpiBox label="Checks Passed" value={`${passCount}/${totalCount}`} tone={passCount === totalCount ? 'success' : 'neutral'} />
      <KpiBox label="Checks Failed" value={String(failCount)} tone={failCount > 0 ? 'error' : 'neutral'} />
      <KpiBox label="Avg Latency" value={`${avgLatency.toFixed(1)}ms`} tone="info" />
    </div>
  );
}

function HistoryTab({ history, loading }: { history: TestHistoryEntry[]; loading: boolean }) {
  if (loading) return <LoadingSkeleton rows={3} variant="list" />;
  if (history.length === 0) return <EmptyState title="No test history" description="Run diagnostics to see history." />;

  return (
    <ReportCard title="Test History">
      <div className="overflow-auto">
        <table className="w-full text-sm" aria-label="Test history">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['Check', 'Status', 'Latency', 'Version', 'Message', 'Time'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{entry.check_name}</td>
                <td className="px-3 py-2">
                  <StatusPill status={entry.status === 'pass' ? 'ACTIVE' : 'FAILED'} />
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-600">{entry.latency_ms !== null ? `${entry.latency_ms}ms` : '—'}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{entry.server_version || '—'}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{entry.message}</td>
                <td className="px-3 py-2 text-xs font-mono text-gray-500">{entry.checked_at ? new Date(entry.checked_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportCard>
  );
}

function SchemaTab() {
  return (
    <EmptyState
      title="Schema inspection coming soon"
      description="This tab will display tables and columns from the remote database system."
    />
  );
}
