import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExecutionHistory, useExecutionControl } from '../hooks/useValidation';
import { apiGet } from '../utils/apiClient';
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

export function ExecutionHistoryPage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [breakdown, setBreakdown] = useState<StatusBreakdown | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusOptions] = useState(['all', 'COMPLETED', 'FAILED', 'RUNNING', 'PENDING']);
  const [sortOptions, setSortOptions] = useState(['batch_id', 'batch_status', 'total_controls', 'completed_controls', 'failed_controls', 'batch_start_time']);
  const [selectedSort, setSelectedSort] = useState('batch_start_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortArrow, setSortArrow] = useState('↓');

  const [cancel, retry] = useExecutionControl();

  useEffect(() => {
    let cancelled = false;
    setBreakdownLoading(true);
    apiGet<StatusBreakdown>('/execution/history/status-breakdown')
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
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Execution History"
        description="View and manage past validation executions"
        actions={
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
          </div>
          {breakdown.today_breakdown && (
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Today: {breakdown.today_breakdown.completed} completed, {breakdown.today_breakdown.scheduled} scheduled
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by batch ID..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--font-size-sm)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
          }}
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="RUNNING">Running</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && <LoadingSkeleton rows={5} variant="card" />}

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
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Batch ID</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Controls</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Completed</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Failed</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Started</th>
                  <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Actions</th>
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

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
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
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
