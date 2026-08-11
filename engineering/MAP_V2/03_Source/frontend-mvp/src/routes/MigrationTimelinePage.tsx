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

  const selectStyle: React.CSSProperties = {
    padding: 'var(--space-xs) var(--space-sm)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    fontSize: 'var(--font-size-sm)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    cursor: 'pointer',
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Migration Timeline</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const handleViewLogs = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setShowLogsModal(true);
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      {showLogsModal && selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowLogsModal(false)}>
          <div style={{
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px' }}>Execution Details</h3>
              <button onClick={() => setShowLogsModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', padding: '0 4px' }}>×</button>
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0', color: '#333' }}><strong>Execution ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{selectedEvent.id}</span></p>
              <p style={{ margin: '8px 0', color: '#333' }}><strong>Batch ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{selectedEvent.batch_id || 'N/A'}</span></p>
              <p style={{ margin: '8px 0', color: '#333' }}><strong>Status:</strong> {selectedEvent.status}</p>
              <p style={{ margin: '8px 0', color: '#333' }}><strong>Started:</strong> {new Date(selectedEvent.started_at).toLocaleString()}</p>
              {selectedEvent.completed_at && <p style={{ margin: '8px 0', color: '#333' }}><strong>Completed:</strong> {new Date(selectedEvent.completed_at).toLocaleString()}</p>}
              {selectedEvent.duration_seconds && <p style={{ margin: '8px 0', color: '#333' }}><strong>Duration:</strong> {selectedEvent.duration_seconds}s</p>}
              {selectedEvent.error_message && (
                <>
                  <p style={{ margin: '8px 0 4px 0', color: '#333' }}><strong>Error:</strong></p>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    color: '#c7254e',
                    padding: '12px', 
                    borderRadius: '4px', 
                    overflow: 'auto', 
                    maxHeight: '200px',
                    border: '1px solid #e0e0e0',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
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
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button
              onClick={fetchTimeline}
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

      {error && <ErrorState message={error} onRetry={fetchTimeline} />}

      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && summary && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Running" value={summary.running} color="var(--color-info)" />
            <MetricCard title="Completed Today" value={summary.completed_today} color="var(--color-success)" />
            <MetricCard title="Failed (All Time)" value={summary.failed_total} color={summary.failed_total > 0 ? 'var(--color-danger)' : undefined} />
            <MetricCard title="Scheduled" value={summary.scheduled} color="var(--color-warning)" />
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by batch ID or project..." />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
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
                    <h4 style={{
                      fontSize: 'var(--font-size-h4)',
                      marginBottom: 'var(--space-md)',
                      padding: 'var(--space-sm) var(--space-md)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius)',
                      display: 'inline-block',
                    }}>
                      {group.label}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginLeft: 'var(--space-lg)' }}>
                      {groupEvents.map((event) => (
                        <div
                          key={event.id}
                          style={{
                            padding: 'var(--space-md)',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            borderLeft: `4px solid ${event.status === 'running' ? 'var(--color-info)' : event.status === 'completed' ? 'var(--color-success)' : event.status === 'failed' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <span style={{ fontSize: 'var(--font-size-lg)' }}>{statusIcons[event.status]}</span>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                                  {(event.batch_id || event.id || '').slice(0, 8)}...
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                                  {event.project_name ?? 'Unknown'} · Triggered by: {event.triggered_by ?? 'unknown'}
                                </div>
                              </div>
                            </div>
                            <StatusBadge status={event.status} size="sm" variant={statusBadgeVariant[event.status]} />
                          </div>

                          {event.status === 'running' && (
                            <div style={{ marginBottom: 'var(--space-sm)' }}>
                              <ProgressBar value={event.progress} max={100} height={6} showPercentage />
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--font-size-sm)', flexWrap: 'wrap' }}>
                            {event.total_controls ? (
                              <span style={{ color: 'var(--color-text-secondary)' }}>
                                {event.completed_controls ?? 0}/{event.total_controls} controls
                              </span>
                            ) : null}
                            {(event.failed_controls ?? 0) > 0 && (
                              <span style={{ color: 'var(--color-danger)' }}>
                                {event.failed_controls} failed
                              </span>
                            )}
                            {event.duration_seconds ? (
                              <span style={{ color: 'var(--color-text-secondary)' }}>
                                Duration: {event.duration_seconds}s
                              </span>
                            ) : null}
                            <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                              {new Date(event.started_at).toLocaleString()}
                            </span>
                          </div>

                          {event.error_message && (
                            <div style={{
                              marginTop: '8px',
                              padding: '8px 12px',
                              backgroundColor: '#fff5f5',
                              borderRadius: '4px',
                              border: '1px solid #fecaca',
                              fontSize: '13px',
                              color: '#991b1b',
                              maxHeight: '60px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: '1.4',
                            }}>
                              {event.error_message}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                            <button 
                              onClick={() => handleViewLogs(event)}
                              style={{ padding: 'var(--space-xs) var(--space-sm)', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}
                            >
                              View Details
                            </button>
                            {event.status === 'failed' && (
                              <button style={{ padding: 'var(--space-xs) var(--space-sm)', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                                Retry
                              </button>
                            )}
                            {event.status === 'running' && (
                              <button style={{ padding: 'var(--space-xs) var(--space-sm)', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}>
                                Stop
                              </button>
                            )}
                            <button 
                              onClick={() => handleViewLogs(event)}
                              style={{ padding: 'var(--space-xs) var(--space-sm)', background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 'var(--font-size-xs)' }}
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
            <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
              <button
                onClick={handleLoadMore}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                }}
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