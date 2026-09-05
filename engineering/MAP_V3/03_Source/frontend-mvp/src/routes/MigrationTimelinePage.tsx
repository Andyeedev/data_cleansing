import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGet } from '../utils/apiClient';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { TenantFilter } from '../components/shared/TenantFilter';
import { SearchBar } from '../components/shared/SearchBar';

interface TimelineEvent {
  id: string;
  batch_id: string;
  project_name: string;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  risk_level: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  duration_seconds: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  triggered_by: string;
}

interface TimelineGroup {
  date: string;
  label: string;
  events: TimelineEvent[];
}

interface TimelineSummary {
  running: number;
  completed_today: number;
  failed_total: number;
  scheduled: number;
}

const PAGE_SIZE = 50;

export function MigrationTimelinePage() {
  const { userRoles, token } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TimelineSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const fetchTimeline = useCallback(async (pageNum: number, append: boolean = false) => {
    if (!append) {
      setLoading(true);
    }
    setError(null);
    try {
      const tenantParam = selectedTenant ? `?tenant_id=${selectedTenant}` : '';
      const separator = tenantParam ? '&' : '?';
      const offset = pageNum * PAGE_SIZE;
      const [summaryData, timelineData] = await Promise.all([
        apiGet<TimelineSummary>(`/migration/timeline/summary${tenantParam}`),
        apiGet<TimelineGroup[]>(`/migration/timeline${tenantParam}${separator}limit=${PAGE_SIZE}&offset=${offset}`),
      ]);
      setSummary(summaryData);
      if (append) {
        setTimeline((prev) => {
          const merged = [...prev];
          for (const newGroup of timelineData) {
            const existing = merged.find((g) => g.date === newGroup.date);
            if (existing) {
              existing.events.push(...newGroup.events);
            } else {
              merged.push(newGroup);
            }
          }
          return merged;
        });
        setHasMore(timelineData.length >= PAGE_SIZE);
      } else {
        setTimeline(timelineData);
        setHasMore(timelineData.length >= PAGE_SIZE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  }, [selectedTenant]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchTimeline(0);
  }, [fetchTimeline, selectedTenant]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTimeline(nextPage, true);
  };

  const filteredEvents = useMemo(() => {
    let result = timeline.flatMap((group) => group.events.map((event) => ({ ...event, groupLabel: group.label })));
    if (statusFilter !== 'all') {
      result = result.filter((event) => event.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          (event.batch_id || '').toLowerCase().includes(q) ||
          (event.project_name || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [timeline, statusFilter, searchQuery]);

  const statusIcons = {
    running: '🔵',
    completed: '✅',
    failed: '❌',
    scheduled: '⏳',
  };

  const statusBadgeVariant = {
    running: 'info' as const,
    completed: 'success' as const,
    failed: 'danger' as const,
    scheduled: 'warning' as const,
  };

  if (!userRoles.includes('admin')) {
    return (
      <div className="p-6">
        <h1 className="text-h1 mb-4">Migration Timeline</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const handleViewLogs = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowLogsModal(true);
  };

  return (
    <div className="p-6">
      {showLogsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLogsModal(false)}>
          <div className="bg-white text-gray-900 rounded-lg p-6 max-w-3xl w-[90%] max-h-[80vh] overflow-auto border border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 m-0">Execution Details</h3>
              <button onClick={() => setShowLogsModal(false)} className="bg-none border-none text-3xl cursor-pointer text-gray-500 px-1">×</button>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="mb-2 text-gray-700"><strong>Execution ID:</strong> <span className="font-mono text-xs">{selectedEvent.id}</span></p>
              <p className="mb-2 text-gray-700"><strong>Batch ID:</strong> <span className="font-mono text-xs">{selectedEvent.batch_id || 'N/A'}</span></p>
              <p className="mb-2 text-gray-700"><strong>Status:</strong> {selectedEvent.status}</p>
              <p className="mb-2 text-gray-700"><strong>Started:</strong> {new Date(selectedEvent.started_at).toLocaleString()}</p>
              {selectedEvent.completed_at && <p className="mb-2 text-gray-700"><strong>Completed:</strong> {new Date(selectedEvent.completed_at).toLocaleString()}</p>}
              {selectedEvent.duration_seconds && <p className="mb-2 text-gray-700"><strong>Duration:</strong> {selectedEvent.duration_seconds}s</p>}
              {selectedEvent.error_message && (
                <>
                  <p className="mb-1 text-gray-700"><strong>Error:</strong></p>
                  <pre className="bg-gray-100 text-red-600 p-3 rounded border border-gray-200 overflow-auto max-h-48 text-xs font-mono whitespace-pre-wrap break-words">
                    {selectedEvent.error_message}
                  </pre>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <PageHeader
        title="Migration Timeline"
        description="Chronological view of all migration executions"
        actions={
          <div className="flex gap-2 items-center">
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button
              onClick={fetchTimeline}
              className="px-3 py-1.5 bg-bg-secondary text-text border border-border rounded cursor-pointer text-sm hover:bg-bg-tertiary"
            >
              Refresh
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchTimeline} />}
      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Running" value={summary.running} color="var(--color-info)" />
            <MetricCard title="Completed Today" value={summary.completed_today} color="var(--color-success)" />
            <MetricCard title="Failed (All Time)" value={summary.failed_total} color={summary.failed_total > 0 ? 'var(--color-danger)' : undefined} />
            <MetricCard title="Scheduled" value={summary.scheduled} color="var(--color-warning)" />
          </div>

          <div className="mb-4">
            <div className="flex gap-4 mb-4 items-center">
              <div className="flex-1">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by batch ID or project..." />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-1.5 border border-border rounded bg-bg text-text text-sm cursor-pointer">
                <option value="all">All Statuses</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState title="No events" description="No migration events match your filters." />
          ) : (
            <div className="flex flex-col gap-6">
              {timeline.map((group) => {
                const groupEvents = group.events.filter((event) => {
                  if (statusFilter !== 'all' && event.status !== statusFilter) return false;
                  if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    return (event.batch_id || '').toLowerCase().includes(q) || (event.project_name || '').toLowerCase().includes(q);
                  }
                  return true;
                });
                if (groupEvents.length === 0) return null;
                return (
                  <div key={group.date}>
                    <h4 className="text-h4 mb-4 px-3 py-2 bg-bg-secondary rounded inline-block">
                      {group.label}
                    </h4>
                    <div className="flex flex-col gap-4 ml-6">
                      {groupEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 bg-bg-secondary rounded-lg border border-border border-l-4"
                          style={{
                            borderLeftColor: event.status === 'running' ? 'var(--color-info)' :
                              event.status === 'completed' ? 'var(--color-success)' :
                                event.status === 'failed' ? 'var(--color-danger)' : 'var(--color-warning)'
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{statusIcons[event.status]}</span>
                              <div>
                                <div className="font-semibold text-sm">
                                  {(event.batch_id || event.id || '').slice(0, 8)}...
                                </div>
                                <div className="text-xs text-secondary">
                                  {event.project_name ?? 'Unknown'} · Triggered by: {event.triggered_by ?? 'unknown'}
                                </div>
                              </div>
                            </div>
                            <StatusBadge status={event.status} size="sm" variant={statusBadgeVariant[event.status]} />
                          </div>

                          {event.status === 'running' && (
                            <div className="mb-2">
                              <ProgressBar value={event.progress} max={100} height={6} showPercentage />
                            </div>
                          )}

                          <div className="flex gap-4 text-sm flex-wrap">
                            {event.total_controls ? (
                              <span className="text-secondary">
                                {event.completed_controls ?? 0}/{event.total_controls} controls
                              </span>
                            ) : null}
                            {(event.failed_controls ?? 0) > 0 && (
                              <span className="text-danger">
                                {event.failed_controls} failed
                              </span>
                            )}
                            {event.duration_seconds ? (
                              <span className="text-secondary">
                                Duration: {event.duration_seconds}s
                              </span>
                            ) : null}
                            <span className="text-secondary text-xs">
                              {new Date(event.started_at).toLocaleString()}
                            </span>
                          </div>

                          {event.error_message && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-900 max-h-14 overflow-hidden text-ellipsis leading-snug">
                              {event.error_message}
                            </div>
                          )}

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleViewLogs(event)}
                              className="px-2 py-1 bg-primary text-white rounded cursor-pointer text-xs hover:bg-primary/90"
                            >
                              View Details
                            </button>
                            {event.status === 'failed' && (
                              <button className="px-2 py-1 bg-bg text-text border border-border rounded cursor-pointer text-xs hover:bg-bg-tertiary">
                                Retry
                              </button>
                            )}
                            {event.status === 'running' && (
                              <button className="px-2 py-1 bg-bg text-text border border-border rounded cursor-pointer text-xs hover:bg-bg-tertiary">
                                Stop
                              </button>
                            )}
                            <button
                              onClick={() => handleViewLogs(event)}
                              className="px-2 py-1 bg-bg text-text border border-border rounded cursor-pointer text-xs hover:bg-bg-tertiary"
                            >
                              View Logs
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasMore && !loading && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-primary text-white rounded cursor-pointer text-sm hover:bg-primary/90"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
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
}