import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExecutionHistory, useExecutionControl } from '../hooks/useValidation';
import { apiGet } from '../utils/apiClient';
import { TenantFilter } from '../components/shared/TenantFilter';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { MetricCard } from '../components/shared/MetricCard';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { SearchBar } from '../components/shared/SearchBar';

interface StatusBreakdown {
  breakdown: Record<string, number>;
  total: number;
  unscored: number;
  today_breakdown: { completed: number; scheduled: number };
}

type SortField = 'batch_id' | 'batch_status' | 'total_controls' | 'completed_controls' | 'failed_controls' | 'batch_start_time';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const STATUS_OPTIONS = ['all', 'COMPLETED', 'FAILED', 'RUNNING', 'PENDING'];
const SORT_FIELDS: { key: SortField; label: string }[] = [
  { key: 'batch_id', label: 'Batch ID' },
  { key: 'batch_status', label: 'Status' },
  { key: 'total_controls', label: 'Controls' },
  { key: 'completed_controls', label: 'Completed' },
  { key: 'failed_controls', label: 'Failed' },
  { key: 'batch_start_time', label: 'Started' },
];

export function ExecutionHistoryPage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [historySort, setHistorySort] = useState<SortField>('batch_start_time');
  const [historySortDir, setHistorySortDir] = useState<SortDir>('desc');
  const [breakdown, setBreakdown] = useState<StatusBreakdown | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(true);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { cancel, retry, loading: controlLoading } = useExecutionControl();

  const { data, loading, error, refetch } = useExecutionHistory(
    page,
    pageSize,
    selectedTenant || undefined,
    statusFilter === 'all' ? undefined : statusFilter,
    debouncedSearch || undefined,
    historySort,
    historySortDir,
  );

  useEffect(() => {
    let cancelled = false;
    setBreakdownLoading(true);
    const tenantParam = selectedTenant ? `?tenant_id=${selectedTenant}` : '';
    apiGet<StatusBreakdown>(`/execution/history/status-breakdown${tenantParam}`)
      .then((result) => {
        if (!cancelled) setBreakdown(result);
      })
      .catch(() => {
        if (!cancelled) setBreakdown(null);
      })
      .finally(() => {
        if (!cancelled) setBreakdownLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedTenant]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  const handleSort = (field: SortField) => {
    if (historySort === field) {
      setHistorySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setHistorySort(field);
      setHistorySortDir('desc');
    }
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenant(tenantId);
    setPage(1);
  };

  const handleReExecute = async (batchId: string) => {
    const success = await retry(batchId);
    if (success) {
      refetch();
    }
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Execution History</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
  const historyStart = data && data.items.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const historyEnd = Math.min(page * pageSize, data?.total ?? 0);

  const selectStyle: React.CSSProperties = {
    padding: 'var(--space-xs) var(--space-sm)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--font-size-sm)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    cursor: 'pointer',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left' as const,
    padding: 'var(--space-sm) var(--space-md)',
    color: 'var(--color-text)',
    fontWeight: 700,
    fontSize: 'var(--font-size-xs)',
    cursor: 'pointer',
    userSelect: 'none' as const,
    background: 'var(--color-bg-secondary)',
    borderBottom: '2px solid var(--color-border)',
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Execution History"
        description="View and manage past validation executions"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={handleTenantChange} />
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by batch ID, status, or project..."
            />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              style={selectStyle}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={selectStyle}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
            <button
              onClick={refetch}
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
              Refresh
            </button>
          </div>
        }
      />

      {!breakdownLoading && breakdown && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <MetricCard title="Total Batches" value={breakdown.total} color="var(--color-text)" />
          <MetricCard title="Completed" value={breakdown.breakdown?.COMPLETED || 0} color="var(--color-success)" />
          <MetricCard title="Failed" value={breakdown.breakdown?.FAILED || 0} color="var(--color-danger)" />
          <MetricCard title="Running" value={breakdown.breakdown?.RUNNING || 0} color="var(--color-warning)" />
        </div>
      )}

      {!breakdownLoading && breakdown && (
        <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)' }}>
          <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Status Distribution</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                <span>COMPLETED</span>
                <span style={{ color: 'var(--color-success)' }}>{breakdown.breakdown?.COMPLETED || 0}</span>
              </div>
              <ProgressBar value={breakdown.breakdown?.COMPLETED || 0} max={Math.max(breakdown.total, 1)} color="var(--color-success)" height={12} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                <span>FAILED</span>
                <span style={{ color: 'var(--color-danger)' }}>{breakdown.breakdown?.FAILED || 0}</span>
              </div>
              <ProgressBar value={breakdown.breakdown?.FAILED || 0} max={Math.max(breakdown.total, 1)} color="var(--color-danger)" height={12} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                <span>RUNNING</span>
                <span style={{ color: 'var(--color-warning)' }}>{breakdown.breakdown?.RUNNING || 0}</span>
              </div>
              <ProgressBar value={breakdown.breakdown?.RUNNING || 0} max={Math.max(breakdown.total, 1)} color="var(--color-warning)" height={12} />
            </div>
            {breakdown.today_breakdown && (
              <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Today: {breakdown.today_breakdown.completed} completed, {breakdown.today_breakdown.scheduled} scheduled
              </div>
            )}
          </div>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && <LoadingSkeleton rows={5} variant="table" />}

      {!loading && !error && data && data.items.length === 0 && (
        <EmptyState
          title="No Execution History"
          description="No execution batches have been run yet. Start a migration execution to see history here."
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {SORT_FIELDS.map((field) => (
                    <th
                      key={field.key}
                      style={thStyle}
                      onClick={() => handleSort(field.key)}
                    >
                      {field.label}
                      {historySort === field.key && (historySortDir === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                  ))}
                  <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item.batch_id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/validation/results/${item.batch_id}`)}
                  >
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                      {item.batch_id.slice(0, 12)}...
                    </td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                      <StatusBadge status={item.batch_status} size="sm" />
                    </td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>{item.total_controls}</td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>{item.completed_controls}</td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', color: item.failed_controls > 0 ? 'var(--color-danger)' : undefined }}>
                      {item.failed_controls}
                    </td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {item.batch_start_time ? new Date(item.batch_start_time).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReExecute(item.batch_id);
                        }}
                        disabled={controlLoading}
                        style={{
                          padding: '4px 12px',
                          fontSize: 'var(--font-size-xs)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius)',
                          background: 'var(--color-surface)',
                          cursor: controlLoading ? 'wait' : 'pointer',
                          color: 'var(--color-text)',
                        }}
                      >
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Showing {historyStart}–{historyEnd} of {data.total} rows
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              {totalPages > 1 && (
                <>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      background: 'var(--color-surface)',
                      fontSize: 'var(--font-size-sm)',
                      opacity: page === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      background: 'var(--color-surface)',
                      fontSize: 'var(--font-size-sm)',
                      opacity: page === totalPages ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}