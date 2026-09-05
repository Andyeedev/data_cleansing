import { useState } from 'react';
import { useCalendarEventList, useCreateCalendarEvent, useDeleteCalendarEvent } from '../hooks/useCalendar';
import { useAuth } from '../context/AuthContext';
import { ErrorState, LoadingSkeleton, EmptyState, StatusBadge, Modal, Pagination } from '../components/shared';

export function CalendarPage() {
  const { userRoles: _userRoles } = useAuth();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    event_type: 'other',
    start_time: '',
    end_time: '',
    location: '',
    all_day: false,
  });

  const { data, loading, error, refetch } = useCalendarEventList({
    page,
    page_size: 20,
    type: typeFilter || undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
  });

  const { create, loading: creating } = useCreateCalendarEvent();
  const { remove, loading: deleting } = useDeleteCalendarEvent();

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.start_time) return;
    const result = await create({
      title: createForm.title,
      description: createForm.description || undefined,
      event_type: createForm.event_type,
      start_time: createForm.start_time,
      end_time: createForm.end_time || undefined,
      location: createForm.location || undefined,
      all_day: createForm.all_day,
    });
    if (result) {
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        event_type: 'other',
        start_time: '',
        end_time: '',
        location: '',
        all_day: false,
      });
      refetch();
    }
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Delete event "${eventTitle}"?`)) return;
    const success = await remove(eventId);
    if (success) refetch();
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'migration': return '#8b5cf6';
      case 'review': return '#3b82f6';
      case 'meeting': return '#22c55e';
      case 'deadline': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return 'var(--color-text-secondary)';
    }
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Calendar</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new event"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-sidebar-active)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-base)',
          }}
        >
          Create Event
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          aria-label="Filter by event type"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-base)',
          }}
        >
          <option value="">All Types</option>
          <option value="migration">Migration</option>
          <option value="review">Review</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => { setStartDateFilter(e.target.value); setPage(1); }}
          aria-label="Start date"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-base)',
          }}
        />
        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => { setEndDateFilter(e.target.value); setPage(1); }}
          aria-label="End date"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-base)',
          }}
        />
      </div>

      {loading && <LoadingSkeleton variant="table" rows={5} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          {data.events.length === 0 ? (
            <EmptyState
              title="No events found"
              description={(typeFilter || startDateFilter || endDateFilter) ? 'Try different filters' : 'Create your first event to get started'}
              action={!typeFilter && !startDateFilter && !endDateFilter ? { label: 'Create Event', onClick: () => setShowCreateModal(true) } : undefined}
            />
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-base)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Event</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Start Time</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>End Time</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Location</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <div style={{
                            width: 4,
                            height: 32,
                            borderRadius: 2,
                            background: getEventColor(event.event_type || event.type),
                            flexShrink: 0,
                          }} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{event.title}</div>
                            {event.description && (
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                                {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={formatEventType(event.event_type || event.type)} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                        {event.all_day ? (
                          <span>All Day</span>
                        ) : (
                          new Date(event.start_time).toLocaleString()
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                        {event.end_time ? new Date(event.end_time).toLocaleString() : '-'}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {event.location || '-'}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleting}
                          aria-label={`Delete ${event.title}`}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: '#ef4444',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
            <Pagination
              page={page}
              pageSize={20}
              total={data.total}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <Modal
        open={showCreateModal}
        title="Create Event"
        onClose={() => setShowCreateModal(false)}
        footer={
          <>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !createForm.title.trim() || !createForm.start_time}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-sidebar-active)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: creating || !createForm.title.trim() || !createForm.start_time ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-base)',
                opacity: creating || !createForm.title.trim() || !createForm.start_time ? 0.5 : 1,
              }}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Title *</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter event title"
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-base)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-base)',
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Type</label>
              <select
                value={createForm.event_type}
                onChange={(e) => setCreateForm({ ...createForm, event_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                }}
              >
                <option value="other">Other</option>
                <option value="migration">Migration</option>
                <option value="review">Review</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Location</label>
              <input
                value={createForm.location}
                onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                placeholder="Location"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Start Time *</label>
              <input
                type="datetime-local"
                value={createForm.start_time}
                onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>End Time</label>
              <input
                type="datetime-local"
                value={createForm.end_time}
                onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <input
              type="checkbox"
              id="allDay"
              checked={createForm.all_day}
              onChange={(e) => setCreateForm({ ...createForm, all_day: e.target.checked })}
            />
            <label htmlFor="allDay" style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>All Day Event</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}