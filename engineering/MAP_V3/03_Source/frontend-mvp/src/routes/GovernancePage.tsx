import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/apiClient';
import { TabBar } from '../components/shared/TabBar';
import { StatusBadge } from '../components/shared/StatusBadge';
import { MetricCard } from '../components/shared/MetricCard';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageHeader } from '../components/PageHeader/PageHeader';

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface ComplianceStatus {
  score: number | null;
  total_controls: number;
  passed_controls: number;
  failed_controls: number;
}

interface ExceptionEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  reason: string;
  status: string;
  requested_by: string;
  created_at: string;
}

interface RiskEntry {
  batch_id: string;
  risk_index: number;
  risk_level: string;
  total_rules: number;
  risk_points: number;
  failure_rate_percent: number;
  pass_rate_percent: number;
}

interface UnscoredBatch {
  batch_id: string;
  batch_status: string;
  project_id: string | null;
}

type SortField = 'batch_id' | 'risk_index' | 'risk_level' | 'failure_rate_percent' | 'pass_rate_percent';
type SortDir = 'asc' | 'desc';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'controls', label: 'Controls' },
  { key: 'exceptions', label: 'Exceptions' },
  { key: 'risk', label: 'Risk' },
  { key: 'audit', label: 'Audit' },
];

const TAB_ROUTES: Record<string, string> = {
  overview: '/governance/overview',
  compliance: '/governance/compliance',
  controls: '/governance/controls',
  exceptions: '/governance/exceptions',
  risk: '/governance/risk',
  audit: '/governance/audit',
};

const PAGE_SIZE_OPTIONS = [10, 50, 100];

export function GovernancePage() {
  const { userRoles } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const tabFromUrl = TABS.find((t) => TAB_ROUTES[t.key] === location.pathname)?.key ?? 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionEntry[]>([]);
  const [riskScores, setRiskScores] = useState<RiskEntry[]>([]);
  const [unscoredBatches, setUnscoredBatches] = useState<UnscoredBatch[]>([]);
  const [orphanedBatches, setOrphanedBatches] = useState<UnscoredBatch[]>([]);
  const [_totalBatches, setTotalBatches] = useState(0);
  const [unscoredExpanded, setUnscoredExpanded] = useState(false);
  const [orphanedExpanded, setOrphanedExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState('');

  const [riskSearch, setRiskSearch] = useState('');
  const [riskSort, setRiskSort] = useState<SortField>('risk_index');
  const [riskSortDir, setRiskSortDir] = useState<SortDir>('desc');
  const [riskPage, setRiskPage] = useState(1);
  const [riskPageSize, setRiskPageSize] = useState(10);

  const [unscoredSearch, setUnscoredSearch] = useState('');
  const [unscoredSort, setUnscoredSort] = useState<'batch_id' | 'batch_status'>('batch_id');
  const [unscoredSortDir, setUnscoredSortDir] = useState<SortDir>('asc');
  const [unscoredPage, setUnscoredPage] = useState(1);
  const [unscoredPageSize, setUnscoredPageSize] = useState(10);

  const [orphanedSearch, setOrphanedSearch] = useState('');
  const [orphanedSort, setOrphanedSort] = useState<'batch_id' | 'batch_status'>('batch_id');
  const [orphanedSortDir, setOrphanedSortDir] = useState<SortDir>('asc');
  const [orphanedPage, setOrphanedPage] = useState(1);
  const [orphanedPageSize, setOrphanedPageSize] = useState(10);

  useEffect(() => {
    const tab = TABS.find((t) => TAB_ROUTES[t.key] === location.pathname)?.key ?? 'overview';
    setActiveTab(tab);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchTab = async () => {
      try {
        const tenantParam = selectedTenant ? `?tenant_id=${selectedTenant}` : '';
        if (activeTab === 'audit') {
          const data = await apiGet<{ entries: AuditEntry[] }>(`/governance/audit?limit=50${selectedTenant ? `&tenant_id=${selectedTenant}` : ''}`);
          if (!cancelled) setAuditEntries(data.entries || []);
        } else if (activeTab === 'overview' || activeTab === 'compliance') {
          const data = await apiGet<ComplianceStatus>('/governance/compliance');
          if (!cancelled) setCompliance(data);
        } else if (activeTab === 'exceptions') {
          const data = await apiGet<{ exceptions: ExceptionEntry[] }>('/governance/exceptions');
          if (!cancelled) setExceptions(data.exceptions || []);
        } else if (activeTab === 'risk') {
          const data = await apiGet<{ risk_scores: RiskEntry[]; total: number }>(`/execution/risk-scores${tenantParam}`);
          if (!cancelled) {
            setRiskScores(data.risk_scores || []);
            setTotalBatches(data.total || 0);
          }
          const unscoredData = await apiGet<{ unscored_batches: UnscoredBatch[] }>(`/execution/unscored-batches${tenantParam}`);
          if (!cancelled) setUnscoredBatches(unscoredData.unscored_batches || []);
          const orphanedData = await apiGet<{ orphaned_batches: UnscoredBatch[] }>(`/execution/orphaned-batches${tenantParam}`);
          if (!cancelled) setOrphanedBatches(orphanedData.orphaned_batches || []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTab();
    return () => { cancelled = true; };
  }, [activeTab, selectedTenant]);

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Governance</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(TAB_ROUTES[key] || '/governance/overview');
  };

  const handleRiskSort = (field: SortField) => {
    if (riskSort === field) {
      setRiskSortDir(riskSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setRiskSort(field);
      setRiskSortDir('desc');
    }
    setRiskPage(1);
  };

  const handleUnscoredSort = (field: 'batch_id' | 'batch_status') => {
    if (unscoredSort === field) {
      setUnscoredSortDir(unscoredSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setUnscoredSort(field);
      setUnscoredSortDir('asc');
    }
    setUnscoredPage(1);
  };

  const handleOrphanedSort = (field: 'batch_id' | 'batch_status') => {
    if (orphanedSort === field) {
      setOrphanedSortDir(orphanedSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrphanedSort(field);
      setOrphanedSortDir('asc');
    }
    setOrphanedPage(1);
  };

  const filteredRiskScores = useMemo(() => {
    let result = riskScores;
    if (riskSearch) {
      const q = riskSearch.toLowerCase();
      result = result.filter(r =>
        r.batch_id.toLowerCase().includes(q) ||
        r.risk_level.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[riskSort];
      const bVal = b[riskSort];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return riskSortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const numA = Number(aVal);
      const numB = Number(bVal);
      return riskSortDir === 'asc' ? numA - numB : numB - numA;
    });
    return result;
  }, [riskScores, riskSearch, riskSort, riskSortDir]);

  const riskTotalPages = Math.ceil(filteredRiskScores.length / riskPageSize);
  const paginatedRisk = filteredRiskScores.slice((riskPage - 1) * riskPageSize, riskPage * riskPageSize);
  const riskStart = filteredRiskScores.length > 0 ? (riskPage - 1) * riskPageSize + 1 : 0;
  const riskEnd = Math.min(riskPage * riskPageSize, filteredRiskScores.length);

  const filteredUnscored = useMemo(() => {
    let result = unscoredBatches;
    if (unscoredSearch) {
      const q = unscoredSearch.toLowerCase();
      result = result.filter(b =>
        b.batch_id.toLowerCase().includes(q) ||
        b.batch_status.toLowerCase().includes(q) ||
        (b.project_id && b.project_id.toLowerCase().includes(q))
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[unscoredSort];
      const bVal = b[unscoredSort];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return unscoredSortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return result;
  }, [unscoredBatches, unscoredSearch, unscoredSort, unscoredSortDir]);

  const unscoredTotalPages = Math.ceil(filteredUnscored.length / unscoredPageSize);
  const paginatedUnscored = filteredUnscored.slice((unscoredPage - 1) * unscoredPageSize, unscoredPage * unscoredPageSize);
  const unscoredStart = filteredUnscored.length > 0 ? (unscoredPage - 1) * unscoredPageSize + 1 : 0;
  const unscoredEnd = Math.min(unscoredPage * unscoredPageSize, filteredUnscored.length);

  const filteredOrphaned = useMemo(() => {
    let result = orphanedBatches;
    if (orphanedSearch) {
      const q = orphanedSearch.toLowerCase();
      result = result.filter(b =>
        b.batch_id.toLowerCase().includes(q) ||
        b.batch_status.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[orphanedSort];
      const bVal = b[orphanedSort];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return orphanedSortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return result;
  }, [orphanedBatches, orphanedSearch, orphanedSort, orphanedSortDir]);

  const orphanedTotalPages = Math.ceil(filteredOrphaned.length / orphanedPageSize);
  const paginatedOrphaned = filteredOrphaned.slice((orphanedPage - 1) * orphanedPageSize, orphanedPage * orphanedPageSize);
  const orphanedStart = filteredOrphaned.length > 0 ? (orphanedPage - 1) * orphanedPageSize + 1 : 0;
  const orphanedEnd = Math.min(orphanedPage * orphanedPageSize, filteredOrphaned.length);

  const filteredAudit = auditEntries.filter((entry) => {
    const matchesSearch = searchQuery === '' ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.entity_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const thStyle = { textAlign: 'left' as const, padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', cursor: 'pointer', userSelect: 'none' as const, background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' };

  const selectStyle = { padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)', background: 'var(--color-background)', color: 'var(--color-text)', cursor: 'pointer' };

  const paginationRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' };

  const paginationStyle = { display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' };

  const paginationBtnStyle = (disabled: boolean) => ({ padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-background)', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 'var(--font-size-sm)', opacity: disabled ? 0.5 : 1 });

  const scoredCount = riskScores.length - orphanedBatches.length;
  const actualTotal = unscoredBatches.length + scoredCount;

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Governance"
        description="Compliance, risk scoring, release gates, and approval workflows."
      />

      <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => setError(null)} />}

      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <MetricCard title="Compliance Score" value={compliance?.score ?? '—'} />
          <MetricCard title="Total Controls" value={compliance?.total_controls ?? 0} />
          <MetricCard title="Passed Controls" value={compliance?.passed_controls ?? 0} color="var(--color-success)" />
          <MetricCard title="Failed Controls" value={compliance?.failed_controls ?? 0} color={compliance?.failed_controls ? 'var(--color-danger)' : undefined} />
        </div>
      )}

      {!loading && !error && activeTab === 'compliance' && (
        <div style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Compliance Status</h3>
          {compliance ? (
            <div>
              <p>Score: {compliance.score ?? 'N/A'}</p>
              <p>Total Controls: {compliance.total_controls}</p>
              <p>Passed: {compliance.passed_controls}</p>
              <p>Failed: {compliance.failed_controls}</p>
            </div>
          ) : (
            <EmptyState title="No compliance data" description="No compliance data available." />
          )}
        </div>
      )}

      {!loading && !error && activeTab === 'controls' && (
        <div style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Active Controls</h3>
          <EmptyState title="No controls configured" description="No controls have been configured yet." />
        </div>
      )}

      {!loading && !error && activeTab === 'exceptions' && (
        <div style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Exception Requests</h3>
          {exceptions.length === 0 ? (
            <EmptyState title="No active exceptions" description="No exception requests found." />
          ) : (
            <div>
              {exceptions.map((exc) => (
                <div key={exc.id} style={{ padding: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 600 }}>{exc.entity_type}</span>
                  <StatusBadge status={exc.status} size="sm" />
                  <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)' }}>{exc.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && activeTab === 'risk' && (
        <div style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Risk Assessment</h3>
          {riskScores.length === 0 ? (
            <EmptyState title="No risk data" description="No risk data available." />
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <MetricCard title="Total Batches" value={actualTotal} />
                <MetricCard title="Scored" value={scoredCount} color="var(--color-success)" />
                <MetricCard title="Unscored" value={unscoredBatches.length} color="var(--color-warning)" />
                {orphanedBatches.length > 0 && (
                  <MetricCard title="Orphaned" value={orphanedBatches.length} color="var(--color-danger)" />
                )}
                <MetricCard title="High Risk" value={riskScores.filter(r => r.risk_level === 'HIGH').length} color="var(--color-danger)" />
                <MetricCard title="Medium Risk" value={riskScores.filter(r => r.risk_level === 'MEDIUM').length} color="var(--color-warning)" />
                <MetricCard title="Low Risk" value={riskScores.filter(r => r.risk_level === 'LOW').length} color="var(--color-success)" />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <SearchBar value={riskSearch} onChange={(v) => { setRiskSearch(v); setRiskPage(1); }} placeholder="Search by batch ID or risk level..." />
                </div>
                <select value={riskPageSize} onChange={(e) => { setRiskPageSize(Number(e.target.value)); setRiskPage(1); }} style={selectStyle}>
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size} rows</option>
                  ))}
                </select>
              </div>

              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', maxHeight: 400, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={thStyle} onClick={() => handleRiskSort('batch_id')}>
                        Batch ID {riskSort === 'batch_id' ? (riskSortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleRiskSort('risk_index')}>
                        Risk Index {riskSort === 'risk_index' ? (riskSortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleRiskSort('risk_level')}>
                        Risk Level {riskSort === 'risk_level' ? (riskSortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleRiskSort('failure_rate_percent')}>
                        Failure Rate {riskSort === 'failure_rate_percent' ? (riskSortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th style={thStyle} onClick={() => handleRiskSort('pass_rate_percent')}>
                        Pass Rate {riskSort === 'pass_rate_percent' ? (riskSortDir === 'asc' ? '↑' : '↓') : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRisk.map((r) => (
                      <tr key={r.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{r.batch_id.slice(0, 8)}...</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{r.risk_index.toFixed(2)}</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge status={r.risk_level} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{r.failure_rate_percent.toFixed(1)}%</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{r.pass_rate_percent.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={paginationRowStyle}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Showing {riskStart}–{riskEnd} of {filteredRiskScores.length} rows
                </span>
                {riskTotalPages > 1 && (
                  <div style={paginationStyle}>
                    <button onClick={() => setRiskPage(p => Math.max(1, p - 1))} disabled={riskPage === 1} style={paginationBtnStyle(riskPage === 1)}>
                      Previous
                    </button>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Page {riskPage} of {riskTotalPages}
                    </span>
                    <button onClick={() => setRiskPage(p => Math.min(riskTotalPages, p + 1))} disabled={riskPage === riskTotalPages} style={paginationBtnStyle(riskPage === riskTotalPages)}>
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {unscoredBatches.length > 0 && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <button
                onClick={() => setUnscoredExpanded(!unscoredExpanded)}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--color-text)',
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  Unscored Batches ({unscoredBatches.length})
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {unscoredExpanded ? '▲ Collapse' : '▼ Expand'}
                </span>
              </button>

              {unscoredExpanded && (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  background: 'var(--color-bg-secondary)',
                }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <SearchBar value={unscoredSearch} onChange={(v) => { setUnscoredSearch(v); setUnscoredPage(1); }} placeholder="Search unscored batches..." />
                    </div>
                    <select value={unscoredPageSize} onChange={(e) => { setUnscoredPageSize(Number(e.target.value)); setUnscoredPage(1); }} style={selectStyle}>
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>{size} rows</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <th style={thStyle} onClick={() => handleUnscoredSort('batch_id')}>
                            Batch ID {unscoredSort === 'batch_id' ? (unscoredSortDir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th style={thStyle} onClick={() => handleUnscoredSort('batch_status')}>
                            Status {unscoredSort === 'batch_status' ? (unscoredSortDir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' }}>Project ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUnscored.map((b) => (
                          <tr key={b.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{b.batch_id.slice(0, 8)}...</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={b.batch_status} size="sm" />
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                              {b.project_id || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Showing {unscoredStart}–{unscoredEnd} of {filteredUnscored.length} rows
                    </span>
                    {unscoredTotalPages > 1 && (
                      <div style={paginationStyle}>
                        <button onClick={() => setUnscoredPage(p => Math.max(1, p - 1))} disabled={unscoredPage === 1} style={paginationBtnStyle(unscoredPage === 1)}>
                          Previous
                        </button>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          Page {unscoredPage} of {unscoredTotalPages}
                        </span>
                        <button onClick={() => setUnscoredPage(p => Math.min(unscoredTotalPages, p + 1))} disabled={unscoredPage === unscoredTotalPages} style={paginationBtnStyle(unscoredPage === unscoredTotalPages)}>
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {orphanedBatches.length > 0 && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <button
                onClick={() => setOrphanedExpanded(!orphanedExpanded)}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--color-text)',
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  Orphaned Records ({orphanedBatches.length})
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {orphanedExpanded ? '▲ Collapse' : '▼ Expand'}
                </span>
              </button>

              {orphanedExpanded && (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  background: 'var(--color-bg-secondary)',
                }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <SearchBar value={orphanedSearch} onChange={(v) => { setOrphanedSearch(v); setOrphanedPage(1); }} placeholder="Search orphaned records..." />
                    </div>
                    <select value={orphanedPageSize} onChange={(e) => { setOrphanedPageSize(Number(e.target.value)); setOrphanedPage(1); }} style={selectStyle}>
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>{size} rows</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <th style={thStyle} onClick={() => handleOrphanedSort('batch_id')}>
                            Batch ID {orphanedSort === 'batch_id' ? (orphanedSortDir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th style={thStyle} onClick={() => handleOrphanedSort('batch_status')}>
                            Status {orphanedSort === 'batch_status' ? (orphanedSortDir === 'asc' ? '↑' : '↓') : ''}
                          </th>
                          <th style={{ textAlign: 'left', padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text)', fontWeight: 700, fontSize: 'var(--font-size-xs)', background: 'var(--color-bg-secondary)', borderBottom: '2px solid var(--color-border)' }}>Project ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrphaned.map((b) => (
                          <tr key={b.batch_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{b.batch_id.slice(0, 8)}...</td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                              <StatusBadge status={b.batch_status} size="sm" />
                            </td>
                            <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                              {b.project_id || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Showing {orphanedStart}–{orphanedEnd} of {filteredOrphaned.length} rows
                    </span>
                    {orphanedTotalPages > 1 && (
                      <div style={paginationStyle}>
                        <button onClick={() => setOrphanedPage(p => Math.max(1, p - 1))} disabled={orphanedPage === 1} style={paginationBtnStyle(orphanedPage === 1)}>
                          Previous
                        </button>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          Page {orphanedPage} of {orphanedTotalPages}
                        </span>
                        <button onClick={() => setOrphanedPage(p => Math.min(orphanedTotalPages, p + 1))} disabled={orphanedPage === orphanedTotalPages} style={paginationBtnStyle(orphanedPage === orphanedTotalPages)}>
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && activeTab === 'audit' && (
        <div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div style={{ flex: 1 }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search audit logs..." />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter by type"
              style={{ padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)' }}
            >
              <option value="all">All Types</option>
              <option value="migration_batch">Migration Batch</option>
              <option value="system">System</option>
              <option value="rule">Rule</option>
            </select>
          </div>
          {filteredAudit.length === 0 ? (
            <EmptyState title="No audit entries" description="No audit entries found." />
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              {filteredAudit.map((entry) => (
                <div key={entry.id} style={{ padding: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{entry.action}</span>
                    <StatusBadge status={entry.entity_type} size="sm" />
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    {entry.user_email} • {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
