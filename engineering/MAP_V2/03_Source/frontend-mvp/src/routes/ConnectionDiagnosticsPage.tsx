import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDiagnosticSummary, useDiagnosticDetail, useRunDiagnostics, useTestHistory } from '../hooks/useDiagnostics';
import { SplitPane } from '../components/shared/SplitPane';
import { TabBar } from '../components/shared/TabBar';
import { StatusBadge } from '../components/shared/StatusBadge';
import { MetricCard } from '../components/shared/MetricCard';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import type { DiagnosticResult, TestHistoryEntry } from '../types/systems';

const HEALTH_ICONS: Record<string, string> = {
  pass: '\u2705',
  fail: '\u274C',
  warning: '\u26A0\uFE0F',
};

const HEALTH_COLORS: Record<string, string> = {
  pass: 'var(--color-success)',
  fail: 'var(--color-danger)',
  warning: 'var(--color-warning)',
};

const STATUS_BADGE: Record<string, string> = {
  healthy: 'ACTIVE',
  unhealthy: 'FAILED',
  unknown: 'WARNING',
};

export function ConnectionDiagnosticsPage() {
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
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Connection Diagnostics</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (summaryLoading) return <div style={{ padding: 'var(--space-lg)' }}><LoadingSkeleton rows={4} variant="card" /></div>;
  if (summaryError) return <div style={{ padding: 'var(--space-lg)' }}><ErrorState message={summaryError} onRetry={refetchSummary} /></div>;

  const systemsList = (
    <div style={{ padding: 'var(--space-md)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Systems</div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <MetricCard title="Total" value={summary.total_systems} />
          <MetricCard title="Healthy" value={summary.healthy_systems} color="var(--color-success)" />
          <MetricCard title="Unhealthy" value={summary.unhealthy_systems} color={summary.unhealthy_systems > 0 ? 'var(--color-danger)' : undefined} />
        </div>
      )}

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search systems..." />

      <div style={{ flex: 1, overflow: 'auto', marginTop: 'var(--space-sm)' }}>
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
    <div style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <EmptyState title="Select a system" description="Click a system in the left panel to view diagnostics." />
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-lg)', height: 'calc(100vh - 60px)' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>
          <a
            href="/migration/connections"
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Connections
          </a>
          <span style={{ color: 'var(--color-text-secondary)' }}>/</span>
          <span style={{ color: 'var(--color-text)' }}>Diagnostics</span>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <a
              href="/migration/connections"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              ← Back
            </a>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Connection Diagnostics</h1>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                Health checks and connection profiling for all systems
              </div>
            </div>
          </div>
          {summary && (
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Overall Health: <strong>{summary.overall_health_percent}%</strong>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 'calc(100% - 60px)' }}>
        <SplitPane
          left={systemsList}
          right={detailPanel}
          defaultLeftWidth={30}
          storageKey="diagnostics-split-width"
        />
      </div>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
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
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius)',
              border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: isSelected ? 'var(--color-primary-bg, rgba(59,130,246,0.05))' : 'transparent',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{sys.system_name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {sys.database_type} · {sys.system_role}
                </div>
              </div>
              <StatusBadge status={STATUS_BADGE[sys.overall_status] || 'WARNING'} size="sm" />
            </div>
            {sys.health_checks.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-xs)' }}>
                {sys.health_checks.slice(0, 3).map((c, i) => (
                  <span key={i} style={{ color: HEALTH_COLORS[c.status] }}>{HEALTH_ICONS[c.status]} {c.name}</span>
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
    <div style={{ padding: 'var(--space-md)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {detailLoading && <LoadingSkeleton rows={3} variant="card" />}
      {detailError && <ErrorState message={detailError} />}
      {!detailLoading && !detailError && detail && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 600 }}>{detail.system_name}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {detail.database_type} · {detail.system_role} ·{' '}
                <StatusBadge status={STATUS_BADGE[detail.overall_status] || 'WARNING'} size="sm" />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              <button
                onClick={onRunDiagnostic}
                disabled={running}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: running ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                  opacity: running ? 0.6 : 1,
                }}
              >
                {running ? 'Running...' : 'Run Diagnostics'}
              </button>
              <button
                onClick={onExport}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Export
              </button>
            </div>
          </div>

          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

          <div style={{ flex: 1, overflow: 'auto' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {detail.health_checks.map((check, idx) => (
        <div
          key={idx}
          aria-label={`${check.name}: ${check.status}${check.latency_ms ? `, ${check.latency_ms}ms` : ''}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius)',
            border: `1px solid ${check.status === 'pass' ? 'var(--color-success)' : 'var(--color-danger)'}`,
            background: check.status === 'pass' ? 'rgba(var(--color-success-rgb, 34,197,94), 0.05)' : 'rgba(var(--color-danger-rgb, 239,68,68), 0.05)',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-base)', width: 24, textAlign: 'center' }}>
            {HEALTH_ICONS[check.status]}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{check.name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{check.message}</div>
          </div>
          {check.latency_ms !== undefined && (
            <div style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              {check.latency_ms}ms
            </div>
          )}
          {check.server_version && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
      <MetricCard title="Overall Status" value={detail.overall_status} />
      <MetricCard title="Checks Passed" value={`${passCount}/${totalCount}`} color={passCount === totalCount ? 'var(--color-success)' : 'var(--color-text)'} />
      <MetricCard title="Checks Failed" value={String(failCount)} color={failCount > 0 ? 'var(--color-danger)' : 'var(--color-text)'} />
      <MetricCard title="Avg Latency" value={`${avgLatency.toFixed(1)}ms`} />
    </div>
  );
}

function HistoryTab({ history, loading }: { history: TestHistoryEntry[]; loading: boolean }) {
  if (loading) return <LoadingSkeleton rows={3} variant="list" />;
  if (history.length === 0) return <EmptyState title="No test history" description="Run diagnostics to see history." />;

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }} aria-label="Test history">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            {['Check', 'Status', 'Latency', 'Version', 'Message', 'Time'].map((h) => (
              <th key={h} style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 600, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map((entry, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontWeight: 500 }}>{entry.check_name}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <StatusBadge status={entry.status === 'pass' ? 'ACTIVE' : 'FAILED'} size="sm" />
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{entry.latency_ms !== null ? `${entry.latency_ms}ms` : '—'}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)' }}>{entry.server_version || '—'}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.message}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', fontFamily: 'monospace' }}>{entry.checked_at ? new Date(entry.checked_at).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
