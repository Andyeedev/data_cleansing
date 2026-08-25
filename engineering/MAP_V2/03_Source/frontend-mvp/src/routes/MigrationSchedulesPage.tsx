import { useState, useCallback, useEffect } from 'react';
import {
  useMigrationSchedules,
  useScheduleStats,
  useScheduleLogs,
  useCalendarEvents,
  triggerScheduleRun,
  createSchedule,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
  MigrationSchedule,
  ScheduleExecutionLog,
  ScheduleCreateInput,
  ScheduleUpdateInput,
  CalendarEvent,
} from '../hooks/useMigration';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { StatusBadge } from '../components/shared/StatusBadge';
import { TenantFilter } from '../components/shared/TenantFilter';
import { apiGet } from '../utils/apiClient';

interface ProjectOption {
  project_id: string;
  project_name: string;
}

function getUserFromToken(): { tenantId: string | null; isSuperAdmin: boolean } {
  try {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return { tenantId: null, isSuperAdmin: false };
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles: string[] = payload.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');
    return { tenantId: payload.tenant_id || null, isSuperAdmin };
  } catch {
    return { tenantId: null, isSuperAdmin: false };
  }
}

export function MigrationSchedulesPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState<ScheduleExecutionLog | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MigrationSchedule | null>(null);
  const [runningScheduleId, setRunningScheduleId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  const { tenantId: userTenantId, isSuperAdmin } = getUserFromToken();
  const effectiveTenantId = isSuperAdmin ? (selectedTenant || undefined) : (userTenantId || undefined);

  const { schedules, loading: schedulesLoading, error: schedulesError, refetch: refetchSchedules } = useMigrationSchedules(effectiveTenantId);
  const { stats, loading: statsLoading, refetch: refetchStats } = useScheduleStats(effectiveTenantId);
  const { events, loading: eventsLoading, refetch: refetchEvents } = useCalendarEvents(effectiveTenantId);
  const { logs: expandedLogs, loading: logsLoading, refetch: refetchLogs } = useScheduleLogs(expandedSchedule);

  useEffect(() => {
    const params: Record<string, string | number> = { limit: 100 };
    if (!isSuperAdmin && userTenantId) params.tenant_id = userTenantId;
    apiGet<{ items: ProjectOption[]; total: number }>('/migration/projects', params)
      .then((data) => setProjects(data.items || []))
      .catch(() => {});
  }, [isSuperAdmin, userTenantId]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const refreshAll = useCallback(() => {
    refetchSchedules();
    refetchStats();
    refetchEvents();
    if (expandedSchedule) refetchLogs();
  }, [refetchSchedules, refetchStats, refetchEvents, refetchLogs, expandedSchedule]);

  const handleRunSchedule = async (scheduleId: string) => {
    setRunningScheduleId(scheduleId);
    try {
      const result = await triggerScheduleRun(scheduleId);
      if (result.status === 'failed' || result.error) {
        showToast(`Schedule run failed: ${result.error || result.status}`, 'error');
      } else {
        showToast('Schedule run completed');
        refreshAll();
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.detail || err?.response?.error || 'Failed to run schedule';
      showToast(msg, 'error');
    } finally {
      setRunningScheduleId(null);
    }
  };

  const handleToggleSchedule = async (scheduleId: string) => {
    try {
      await toggleSchedule(scheduleId);
      showToast('Schedule updated');
      refreshAll();
    } catch (err: any) {
      showToast(err?.message || 'Failed to toggle', 'error');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string, name: string) => {
    if (!confirm(`Delete schedule "${name}"?`)) return;
    try {
      await deleteSchedule(scheduleId);
      showToast('Schedule deleted');
      refreshAll();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete', 'error');
    }
  };

  const handleCreateSchedule = async (input: ScheduleCreateInput | ScheduleUpdateInput) => {
    try {
      await createSchedule(input as ScheduleCreateInput);
      showToast('Schedule created');
      setShowCreateModal(false);
      refreshAll();
    } catch (err: any) {
      showToast(err?.message || 'Failed to create', 'error');
      throw err;
    }
  };

  const handleUpdateSchedule = async (scheduleId: string, input: ScheduleUpdateInput) => {
    try {
      await updateSchedule(scheduleId, input);
      showToast('Schedule updated');
      setEditingSchedule(null);
      refreshAll();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update', 'error');
      throw err;
    }
  };

  if (schedulesLoading || statsLoading) {
    return <LoadingOverlay message="Loading schedules..." />;
  }

  if (schedulesError) {
    return (
      <PageContainer>
        <PageHeader title="Migration Schedules" description="Manage automated migration schedules and view execution history" />
        <ErrorState message={schedulesError} onRetry={refreshAll} />
      </PageContainer>
    );
  }

  const currentSchedule = schedules.find(s => s.schedule_id === expandedSchedule);
  const isScheduleEnabled = currentSchedule ? currentSchedule.enabled : true;

  return (
    <PageContainer>
      <PageHeader
        title="Migration Schedules"
        description="Manage automated migration schedules and view execution history"
        actions={
          <div className="flex gap-3 items-center">
            {isSuperAdmin && (
              <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            )}
            <button className="px-3 py-1.5 bg-primary text-white rounded cursor-pointer text-sm font-medium hover:bg-primary/90" onClick={() => setShowCreateModal(true)}>
              + New Schedule
            </button>
          </div>
        }
      />

      {toast && (
        <div className="fixed top-5 right-5 px-4 py-3 text-white rounded font-medium text-sm shadow-lg z-50"
          style={{ background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          {toast.message}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-bg-secondary rounded-lg border border-border p-6 text-center">
            <div className="text-xs text-secondary mb-1 uppercase tracking-wider">Schedules</div>
            <div className="text-h3 font-bold text-text">{stats.total_schedules}</div>
            <div className="text-xs text-secondary mt-1">{stats.enabled_schedules} enabled</div>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border p-6 text-center">
            <div className="text-xs text-secondary mb-1 uppercase tracking-wider">Running</div>
            <div className="text-h3 font-bold" style={{ color: runningScheduleId || stats.running_schedules > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
              {runningScheduleId ? 1 : stats.running_schedules}
            </div>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border p-6 text-center">
            <div className="text-xs text-secondary mb-1 uppercase tracking-wider">Total Runs</div>
            <div className="text-h3 font-bold text-text">{stats.total_runs}</div>
          </div>
          <div className="bg-bg-secondary rounded-lg border border-border p-6 text-center">
            <div className="text-xs text-secondary mb-1 uppercase tracking-wider">Pass Rate</div>
            <div className="text-h3 font-bold" style={{ color: stats.pass_rate >= 80 ? 'var(--color-success)' : stats.pass_rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
              {stats.pass_rate}%
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {schedules.length === 0 ? (
            <EmptyState
              title="No schedules configured"
              description="Create a schedule to automate your migration tasks."
            />
          ) : (
            <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border"></th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Schedule</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Next Run</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Last Run</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Runs</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Enabled</th>
                    <th className="px-4 py-3 text-left font-semibold text-secondary text-sm border-b border-border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <ScheduleRow
                      key={schedule.schedule_id}
                      schedule={schedule}
                      isExpanded={expandedSchedule === schedule.schedule_id}
                      isRunning={runningScheduleId === schedule.schedule_id}
                      onToggleExpand={() => setExpandedSchedule(
                        expandedSchedule === schedule.schedule_id ? null : schedule.schedule_id
                      )}
                      onRun={() => handleRunSchedule(schedule.schedule_id)}
                      onToggle={() => handleToggleSchedule(schedule.schedule_id)}
                      onEdit={() => setEditingSchedule(schedule)}
                      onDelete={() => handleDeleteSchedule(schedule.schedule_id, schedule.name)}
                    />
                  ))}
                </tbody>
              </table>

              {expandedSchedule && (
                <div className="border-t border-border p-4 bg-bg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-text">Run History</span>
                    {logsLoading && <span className="text-xs text-secondary">Loading...</span>}
                  </div>
                  {expandedLogs.length === 0 && !logsLoading ? (
                    <div className="text-center text-secondary text-sm py-4">No execution logs found.</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {expandedLogs.map((log) => (
                        <div key={log.execution_id} className="flex items-center justify-between p-3 bg-bg-secondary rounded border border-border">
                          <div className="flex items-center gap-3">
                            <StatusBadge status={log.status} size="sm" />
                            <span className="text-xs text-secondary">{new Date(log.started_at).toLocaleString()}</span>
                            {log.duration_seconds != null && (
                              <span className="text-xs text-secondary font-mono">{log.duration_seconds}s</span>
                            )}
                            <span className="text-xs text-secondary italic">{log.triggered_by}</span>
                          </div>
                          <button
                            className={isScheduleEnabled
                              ? 'px-2 py-1 bg-transparent text-primary border border-primary rounded cursor-pointer text-xs hover:bg-primary/10'
                              : 'px-2 py-1 bg-transparent text-text-muted border border-border rounded cursor-not-allowed text-xs'
                            }
                            onClick={() => setShowLogModal(log)}
                            disabled={!isScheduleEnabled}
                          >
                            View Output
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-72 flex-shrink-0">
          <CalendarEventsPanel
            events={events}
            loading={eventsLoading}
            onRefresh={refetchEvents}
          />
        </div>
      </div>

      {showLogModal && (
        <TerminalModal log={showLogModal} onClose={() => setShowLogModal(null)} />
      )}

      {showCreateModal && (
        <ScheduleFormModal
          title="Create New Schedule"
          projects={projects}
          onSubmit={handleCreateSchedule}
          onClose={() => setShowCreateModal(false)}
          tenantId={userTenantId}
        />
      )}

      {editingSchedule && (
        <ScheduleFormModal
          title="Edit Schedule"
          schedule={editingSchedule}
          projects={projects}
          onSubmit={(input) => handleUpdateSchedule(editingSchedule.schedule_id, input)}
          onClose={() => setEditingSchedule(null)}
          tenantId={userTenantId}
        />
      )}
    </PageContainer>
  );
}


function ScheduleRow({
  schedule,
  isExpanded,
  isRunning,
  onToggleExpand,
  onRun,
  onToggle,
  onEdit,
  onDelete,
}: {
  schedule: MigrationSchedule;
  isExpanded: boolean;
  isRunning: boolean;
  onToggleExpand: () => void;
  onRun: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isDisabled = !schedule.enabled;

  return (
    <tr className={`border-b border-border ${isExpanded ? 'bg-bg' : ''} ${isDisabled ? 'opacity-60' : ''}`}>
      <td className="px-4 py-3">
        <button className="bg-none border-none cursor-pointer text-xs text-secondary p-1" onClick={onToggleExpand} disabled={isDisabled}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-text">{schedule.name}</div>
        <div className="text-xs text-secondary mt-1">{schedule.project_name}</div>
      </td>
      <td className="px-4 py-3">
        <code className="px-2 py-0.5 bg-bg rounded text-xs font-mono">{schedule.cron_expression}</code>
      </td>
      <td className="px-4 py-3">
        {schedule.next_run ? new Date(schedule.next_run).toLocaleString() : '-'}
      </td>
      <td className="px-4 py-3">
        {schedule.last_run ? new Date(schedule.last_run).toLocaleString() : '-'}
      </td>
      <td className="px-4 py-3">
        <span className="font-semibold text-text">{schedule.execution_count}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={schedule.status} size="sm" />
      </td>
      <td className="px-4 py-3">
        <button
          className={schedule.enabled
            ? 'px-2 py-1 bg-success text-white rounded cursor-pointer text-xs font-bold min-w-[40px]'
            : 'px-2 py-1 bg-gray-300 text-gray-500 rounded cursor-pointer text-xs font-bold min-w-[40px]'}
          onClick={onToggle}
        >
          {schedule.enabled ? 'ON' : 'OFF'}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button
            className={`px-2 py-1 bg-success text-white rounded cursor-pointer text-xs font-medium ${isDisabled || isRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={onRun}
            disabled={isDisabled || isRunning}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            className={`px-2 py-1 bg-transparent text-primary border border-primary rounded cursor-pointer text-xs ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={onEdit}
            disabled={isDisabled}
          >
            Edit
          </button>
          <button
            className={`px-2 py-1 bg-transparent text-danger border border-danger rounded cursor-pointer text-xs ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={onDelete}
            disabled={isDisabled}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}


function CalendarEventsPanel({
  events,
  loading,
  onRefresh,
}: {
  events: CalendarEvent[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-6 min-w-[280px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-text m-0">Calendar Events</h3>
        <button className="px-2 py-1 bg-bg text-secondary border border-border rounded cursor-pointer text-xs hover:bg-bg-tertiary" onClick={onRefresh}>Refresh</button>
      </div>
      {loading ? (
        <div className="text-xs text-secondary">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-secondary text-sm py-4">No calendar events linked to schedules.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <div key={event.event_id} className="flex gap-2 p-2 bg-bg rounded border border-border items-start">
              <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-primary text-white flex-shrink-0">
                {event.type === 'milestone' ? 'M' : event.type === 'deadline' ? 'D' : 'T'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{event.title}</div>
                <div className="text-xs text-secondary">{new Date(event.start_time).toLocaleString()}</div>
                <div className="text-xs text-secondary font-mono">{event.cron_expression}</div>
              </div>
              <button className="px-1.5 py-0.5 bg-transparent text-primary border border-primary rounded cursor-pointer text-xs flex-shrink-0 hover:bg-primary/10" onClick={() => setEditingEvent(event)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editingEvent && (
        <CalendarEventEditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={() => {
            setEditingEvent(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}


function CalendarEventEditModal({
  event,
  onClose,
  onSave,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiGet(`/calendar/events/${event.event_id}`, {});
      onSave();
    } catch (err) {
      console.error('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-bg-secondary rounded-lg border border-border w-[90%] max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text m-0">Edit Calendar Event</h3>
          <button className="bg-none border-none text-xl cursor-pointer text-secondary p-1" onClick={onClose}>×</button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Title</label>
            <input
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button className="px-3 py-2 bg-bg text-text border border-border rounded cursor-pointer text-sm hover:bg-bg-tertiary" onClick={onClose}>Cancel</button>
            <button className="px-3 py-2 bg-primary text-white rounded cursor-pointer text-sm font-medium hover:bg-primary/90" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function ScheduleFormModal({
  title,
  schedule,
  projects,
  onSubmit,
  onClose,
  tenantId,
}: {
  title: string;
  schedule?: MigrationSchedule;
  projects: ProjectOption[];
  onSubmit: (input: ScheduleCreateInput | ScheduleUpdateInput) => Promise<void>;
  onClose: () => void;
  tenantId?: string | null;
}) {
  const [name, setName] = useState(schedule?.name || '');
  const [description, setDescription] = useState(schedule?.description || '');
  const [cronExpression, setCronExpression] = useState(schedule?.cron_expression || '0 2 * * *');
  const [timezone, setTimezone] = useState(schedule?.timezone || 'Europe/London');
  const [projectId, setProjectId] = useState(schedule?.project_id || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cronPresets = [
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at 2 AM', value: '0 2 * * *' },
    { label: 'Daily at 6 AM', value: '0 6 * * *' },
    { label: 'Weekly (Mon 6 AM)', value: '0 6 * * 1' },
    { label: 'Weekly (Wed 3 AM)', value: '0 3 * * 3' },
    { label: 'Monthly (1st 6 AM)', value: '0 6 1 * *' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (!schedule && !projectId) { setError('Project is required'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        cron_expression: cronExpression,
        timezone,
        project_id: projectId,
        tenant_id: tenantId || '',
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-bg-secondary rounded-lg border border-border w-[90%] max-w-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text m-0">{title}</h3>
          <button className="bg-none border-none text-xl cursor-pointer text-secondary p-1" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-auto">
          {error && <div className="mb-4 p-3 bg-danger/10 text-danger rounded text-sm">{error}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Schedule Name *</label>
            <input
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Validation Run"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {!schedule && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-1">Project *</label>
              <select
                className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.project_id} value={p.project_id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {schedule && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-1">Project</label>
              <div className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border">{schedule.project_name}</div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Schedule (Cron) *</label>
            <input
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="0 2 * * *"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {cronPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`px-2 py-1 border border-border rounded text-xs cursor-pointer ${cronExpression === preset.value ? 'bg-primary text-white' : 'bg-bg text-text'}`}
                  onClick={() => setCronExpression(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1">Timezone</label>
            <select
              className="w-full px-3 py-2 bg-bg text-text border border-border rounded text-sm box-border"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="UTC">UTC</option>
              <option value="US/Eastern">US/Eastern</option>
              <option value="US/Pacific">US/Pacific</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-3 py-2 bg-bg text-text border border-border rounded cursor-pointer text-sm hover:bg-bg-tertiary" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-3 py-2 bg-primary text-white rounded cursor-pointer text-sm font-medium hover:bg-primary/90" disabled={submitting}>
              {submitting ? 'Saving...' : schedule ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function TerminalModal({ log, onClose }: { log: ScheduleExecutionLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-bg-secondary rounded-lg border border-border w-[90%] max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start p-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-text m-0">Execution Log</h3>
            <div className="flex items-center gap-2 text-xs text-secondary mt-1">
              <StatusBadge status={log.status} size="sm" />
              {log.duration_seconds != null && (
                <span className="ml-2">Duration: {log.duration_seconds}s</span>
              )}
              {log.exit_code != null && (
                <span className="ml-2">Exit Code: {log.exit_code}</span>
              )}
              <span className="ml-2">Triggered: {log.triggered_by}</span>
            </div>
          </div>
          <button className="bg-none border-none text-xl cursor-pointer text-secondary p-1" onClick={onClose}>×</button>
        </div>
        <div className="flex-1 overflow-auto p-4 max-h-[60vh]">
          <pre className="m-0 p-4 bg-[#1e1e1e] text-[#d4d4d4] rounded text-xs font-mono leading-[1.6] whitespace-pre-wrap break-all" style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}>
            {log.terminal_output || 'No output captured.'}
          </pre>
          {log.error_message && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-danger mb-1">Error Output:</div>
              <pre className="m-0 p-4 bg-[#2d1b1b] text-[#f5c6c6] rounded text-xs font-mono leading-[1.6] whitespace-pre-wrap break-all" style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}>
                {log.error_message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}