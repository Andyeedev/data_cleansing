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
         <PageHeader title="Migration Schedules" description="Manage automated migration schedules" />
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
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            {isSuperAdmin && (
              <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            )}
            <button style={createButtonStyle} onClick={() => setShowCreateModal(true)}>
              + New Schedule
            </button>
          </div>
        }
      />

      {toast && (
        <div style={{
          ...toastStyle,
          background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
        }}>
          {toast.message}
        </div>
      )}

      {stats && (
        <div style={kpiGridStyle}>
          <div style={kpiCardStyle}>
            <div style={kpiLabelStyle}>Schedules</div>
            <div style={kpiValueStyle}>{stats.total_schedules}</div>
            <div style={kpiSubStyle}>{stats.enabled_schedules} enabled</div>
          </div>
          <div style={kpiCardStyle}>
            <div style={kpiLabelStyle}>Running</div>
            <div style={{ ...kpiValueStyle, color: runningScheduleId || stats.running_schedules > 0 ? 'var(--color-warning)' : 'var(--color-text)' }}>
              {runningScheduleId ? 1 : stats.running_schedules}
            </div>
          </div>
          <div style={kpiCardStyle}>
            <div style={kpiLabelStyle}>Total Runs</div>
            <div style={kpiValueStyle}>{stats.total_runs}</div>
          </div>
          <div style={kpiCardStyle}>
            <div style={kpiLabelStyle}>Pass Rate</div>
            <div style={{
              ...kpiValueStyle,
              color: stats.pass_rate >= 80 ? 'var(--color-success)' : stats.pass_rate >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
            }}>
              {stats.pass_rate}%
            </div>
          </div>
        </div>
      )}

      <div style={mainContentStyle}>
        <div style={{ flex: 2 }}>
          {schedules.length === 0 ? (
            <EmptyState
              title="No schedules configured"
              description="Create a schedule to automate your migration tasks."
            />
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}></th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Schedule</th>
                    <th style={thStyle}>Next Run</th>
                    <th style={thStyle}>Last Run</th>
                    <th style={thStyle}>Runs</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Enabled</th>
                    <th style={thStyle}>Actions</th>
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
                <div style={expandedLogsContainerStyle}>
                  <div style={expandedLogsHeaderStyle}>
                    <span style={expandedLogsTitleStyle}>Run History</span>
                    {logsLoading && <span style={loadingTextStyle}>Loading...</span>}
                  </div>
                  {expandedLogs.length === 0 && !logsLoading ? (
                    <div style={noLogsStyle}>No execution logs found.</div>
                  ) : (
                    <div style={logsListStyle}>
                      {expandedLogs.map((log) => (
                        <div key={log.execution_id} style={logRowStyle}>
                          <div style={logInfoStyle}>
                            <StatusBadge status={log.status} size="sm" />
                            <span style={logDateStyle}>
                              {new Date(log.started_at).toLocaleString()}
                            </span>
                            {log.duration_seconds != null && (
                              <span style={logDurationStyle}>{log.duration_seconds}s</span>
                            )}
                            <span style={logTriggerStyle}>{log.triggered_by}</span>
                          </div>
                          <button
                            style={!isScheduleEnabled ? viewLogBtnDisabledStyle : viewLogBtnStyle}
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

        <div style={{ flex: 1 }}>
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
    <tr style={{ ...trStyle, background: isExpanded ? 'var(--color-bg)' : 'transparent', opacity: isDisabled ? 0.6 : 1 }}>
      <td style={tdStyle}>
        <button style={expandBtnStyle} onClick={onToggleExpand} disabled={isDisabled}>
          {isExpanded ? '\u25BC' : '\u25B6'}
        </button>
      </td>
      <td style={tdStyle}>
        <div style={scheduleNameStyle}>{schedule.name}</div>
        <div style={scheduleProjectStyle}>{schedule.project_name}</div>
      </td>
      <td style={tdStyle}>
        <code style={cronStyle}>{schedule.cron_expression}</code>
      </td>
      <td style={tdStyle}>
        {schedule.next_run ? new Date(schedule.next_run).toLocaleString() : '-'}
      </td>
      <td style={tdStyle}>
        {schedule.last_run ? new Date(schedule.last_run).toLocaleString() : '-'}
      </td>
      <td style={tdStyle}>
        <span style={runsCountStyle}>{schedule.execution_count}</span>
      </td>
      <td style={tdStyle}>
        <StatusBadge status={schedule.status} size="sm" />
      </td>
      <td style={tdStyle}>
        <button
          style={schedule.enabled ? toggleOnStyle : toggleOffStyle}
          onClick={onToggle}
        >
          {schedule.enabled ? 'ON' : 'OFF'}
        </button>
      </td>
      <td style={tdStyle}>
        <div style={actionsStyle}>
          <button
            style={{ ...runBtnStyle, opacity: isDisabled || isRunning ? 0.4 : 1 }}
            onClick={onRun}
            disabled={isDisabled || isRunning}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            style={{ ...editBtnStyle, opacity: isDisabled ? 0.4 : 1 }}
            onClick={onEdit}
            disabled={isDisabled}
          >
            Edit
          </button>
          <button
            style={{ ...deleteBtnStyle, opacity: isDisabled ? 0.4 : 1 }}
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
    <div style={calendarPanelStyle}>
      <div style={calendarHeaderStyle}>
        <h3 style={calendarTitleStyle}>Calendar Events</h3>
        <button style={refreshBtnStyle} onClick={onRefresh}>Refresh</button>
      </div>
      {loading ? (
        <div style={loadingTextStyle}>Loading events...</div>
      ) : events.length === 0 ? (
        <div style={noEventsStyle}>No calendar events linked to schedules.</div>
      ) : (
        <div style={eventsListStyle}>
          {events.map((event) => (
            <div key={event.event_id} style={eventCardStyle}>
              <div style={eventIconStyle}>
                {event.type === 'milestone' ? 'M' : event.type === 'deadline' ? 'D' : 'T'}
              </div>
              <div style={eventContentStyle}>
                <div style={eventTitleStyle}>{event.title}</div>
                <div style={eventTimeStyle}>
                  {new Date(event.start_time).toLocaleString()}
                </div>
                <div style={eventRecurrenceStyle}>{event.cron_expression}</div>
              </div>
              <button style={eventEditBtnStyle} onClick={() => setEditingEvent(event)}>
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
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalContentStyle, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>Edit Calendar Event</h3>
          <button style={closeBtnStyle} onClick={onClose}>X</button>
        </div>
        <div style={{ padding: 'var(--space-lg)' }}>
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Title</label>
            <input
              style={formInputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Description</label>
            <textarea
              style={{ ...formInputStyle, minHeight: '60px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
            <button style={cancelBtnStyle} onClick={onClose}>Cancel</button>
            <button style={submitBtnStyle} onClick={handleSave} disabled={saving}>
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
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalContentStyle, maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>{title}</h3>
          <button style={closeBtnStyle} onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-lg)' }}>
          {error && <div style={formErrorStyle}>{error}</div>}

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Schedule Name *</label>
            <input
              style={formInputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Validation Run"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Description</label>
            <textarea
              style={{ ...formInputStyle, minHeight: '60px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {!schedule && (
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>Project *</label>
              <select
                style={formInputStyle}
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
            <div style={formGroupStyle}>
              <label style={formLabelStyle}>Project</label>
              <div style={formInputStyle}>{schedule.project_name}</div>
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Schedule (Cron) *</label>
            <input
              style={formInputStyle}
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="0 2 * * *"
            />
            <div style={cronPresetsStyle}>
              {cronPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  style={{
                    ...cronPresetBtnStyle,
                    background: cronExpression === preset.value ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: cronExpression === preset.value ? 'white' : 'var(--color-text)',
                  }}
                  onClick={() => setCronExpression(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={formLabelStyle}>Timezone</label>
            <select
              style={formInputStyle}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
            <button type="button" style={cancelBtnStyle} onClick={onClose}>Cancel</button>
            <button type="submit" style={submitBtnStyle} disabled={submitting}>
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
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <div>
            <h3 style={modalTitleStyle}>Execution Log</h3>
            <div style={modalMetaStyle}>
              <StatusBadge status={log.status} size="sm" />
              {log.duration_seconds != null && (
                <span style={{ marginLeft: 'var(--space-sm)' }}>Duration: {log.duration_seconds}s</span>
              )}
              {log.exit_code != null && (
                <span style={{ marginLeft: 'var(--space-sm)' }}>Exit Code: {log.exit_code}</span>
              )}
              <span style={{ marginLeft: 'var(--space-sm)' }}>Triggered: {log.triggered_by}</span>
            </div>
          </div>
          <button style={closeBtnStyle} onClick={onClose}>X</button>
        </div>
        <div style={terminalScrollContainerStyle}>
          <pre style={terminalTextStyle}>
            {log.terminal_output || 'No output captured.'}
          </pre>
          {log.error_message && (
            <div style={errorContainerStyle}>
              <div style={errorTitleStyle}>Error Output:</div>
              <pre style={errorTextStyle}>{log.error_message}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ===================== STYLES =====================

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: 'var(--space-md) var(--space-lg)',
  color: 'white',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  zIndex: 1100,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const createButtonStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontWeight: 'var(--font-weight-medium)',
  fontSize: 'var(--font-size-sm)',
};

const kpiGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 'var(--space-md)',
  marginBottom: 'var(--space-lg)',
};

const kpiCardStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  padding: 'var(--space-lg)',
  textAlign: 'center',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const kpiValueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const kpiSubStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginTop: 'var(--space-xs)',
};

const mainContentStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-lg)',
  alignItems: 'flex-start',
};

const tableContainerStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  overflow: 'hidden',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  padding: 'var(--space-md)',
  textAlign: 'left',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-sm)',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--color-border)',
};

const tdStyle: React.CSSProperties = {
  padding: 'var(--space-md)',
  fontSize: 'var(--font-size-sm)',
};

const expandBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  padding: '4px',
};

const scheduleNameStyle: React.CSSProperties = {
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text)',
};

const scheduleProjectStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginTop: '2px',
};

const cronStyle: React.CSSProperties = {
  padding: '2px 6px',
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 'var(--font-size-xs)',
  fontFamily: 'monospace',
};

const runsCountStyle: React.CSSProperties = {
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
};

const toggleOnStyle: React.CSSProperties = {
  padding: '4px 12px',
  background: 'var(--color-success)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-bold)',
  minWidth: '40px',
};

const toggleOffStyle: React.CSSProperties = {
  padding: '4px 12px',
  background: '#ccc',
  color: '#666',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-bold)',
  minWidth: '40px',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-xs)',
};

const runBtnStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'var(--color-success)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-medium)',
};

const editBtnStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
};

const deleteBtnStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'transparent',
  color: 'var(--color-danger)',
  border: '1px solid var(--color-danger)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
};

const expandedLogsContainerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--color-border)',
  padding: 'var(--space-md)',
  background: 'var(--color-bg)',
};

const expandedLogsHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  marginBottom: 'var(--space-md)',
};

const expandedLogsTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
};

const loadingTextStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const noLogsStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  textAlign: 'center',
  padding: 'var(--space-md)',
};

const logsListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
};

const logRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
};

const logInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-md)',
};

const logDateStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const logDurationStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  fontFamily: 'monospace',
};

const logTriggerStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  fontStyle: 'italic',
};

const viewLogBtnStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
};

const viewLogBtnDisabledStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  cursor: 'not-allowed',
  fontSize: 'var(--font-size-xs)',
};

const calendarPanelStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  padding: 'var(--space-lg)',
  minWidth: '280px',
};

const calendarHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--space-md)',
};

const calendarTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  margin: 0,
};

const refreshBtnStyle: React.CSSProperties = {
  padding: '4px 8px',
  background: 'var(--color-bg)',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
};

const noEventsStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  textAlign: 'center',
  padding: 'var(--space-md)',
};

const eventsListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-sm)',
};

const eventCardStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm)',
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
  alignItems: 'flex-start',
};

const eventIconStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius)',
  background: 'var(--color-primary)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-bold)',
  flexShrink: 0,
};

const eventContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const eventTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const eventTimeStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const eventRecurrenceStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  fontFamily: 'monospace',
};

const eventEditBtnStyle: React.CSSProperties = {
  padding: '2px 6px',
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  flexShrink: 0,
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: 'var(--space-lg)',
  borderBottom: '1px solid var(--color-border)',
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  margin: 0,
};

const modalMetaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  marginTop: 'var(--space-xs)',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--font-size-lg)',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  padding: '4px',
};

const terminalScrollContainerStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: 'var(--space-lg)',
  maxHeight: '60vh',
};

const terminalTextStyle: React.CSSProperties = {
  margin: 0,
  padding: 'var(--space-md)',
  background: '#1e1e1e',
  color: '#d4d4d4',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-xs)',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
};

const errorContainerStyle: React.CSSProperties = {
  marginTop: 'var(--space-md)',
};

const errorTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-danger)',
  marginBottom: 'var(--space-xs)',
};

const errorTextStyle: React.CSSProperties = {
  margin: 0,
  padding: 'var(--space-md)',
  background: '#2d1b1b',
  color: '#f5c6c6',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-xs)',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: 'var(--space-md)',
};

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text)',
  marginBottom: 'var(--space-xs)',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-sm)',
  boxSizing: 'border-box',
};

const formErrorStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'rgba(239, 68, 68, 0.1)',
  color: 'var(--color-danger)',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-sm)',
  marginBottom: 'var(--space-md)',
};

const cronPresetsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-xs)',
  marginTop: 'var(--space-xs)',
};

const cronPresetBtnStyle: React.CSSProperties = {
  padding: '4px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontSize: 'var(--font-size-xs)',
  cursor: 'pointer',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
};

const submitBtnStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-medium)',
};
