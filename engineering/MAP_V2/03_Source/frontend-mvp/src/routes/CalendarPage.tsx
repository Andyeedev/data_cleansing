import { useState } from 'react';
import { useCalendarEventList, useCreateCalendarEvent, useDeleteCalendarEvent } from '../hooks/useCalendar';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function CalendarPage() {
  const { userRoles } = useAuth();
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
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Calendar</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '8px 16px',
            background: 'var(--color-sidebar-active)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Create Event
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
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
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        />
        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => { setEndDateFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <>
          {data.events.length === 0 ? (
            <div style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No events found</p>
              <p style={{ fontSize: 14 }}>
                {(typeFilter || startDateFilter || endDateFilter) ? 'Try different filters' : 'Create your first event to get started'}
              </p>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Event</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Start Time</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>End Time</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 4,
                            height: 32,
                            borderRadius: 2,
                            background: getEventColor(event.event_type),
                            flexShrink: 0,
                          }} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{event.title}</div>
                            {event.description && (
                              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                                {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: `${getEventColor(event.event_type)}15`,
                          color: getEventColor(event.event_type),
                        }}>
                          {formatEventType(event.event_type)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        {event.all_day ? (
                          <span>All Day</span>
                        ) : (
                          new Date(event.start_time).toLocaleString()
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        {event.end_time ? new Date(event.end_time).toLocaleString() : '-'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        {event.location || '-'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deleting}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 12,
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

          {data.total > 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page >= Math.ceil(data.total / 20) ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(data.total / 20) ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--color-background)',
            borderRadius: 'var(--radius)',
            padding: 24,
            width: 480,
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Create Event</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Title *</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Enter event title"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--color-background)',
                    color: 'var(--color-text)',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--color-background)',
                    color: 'var(--color-text)',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Type</label>
                  <select
                    value={createForm.event_type}
                    onChange={(e) => setCreateForm({ ...createForm, event_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontSize: 14,
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
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Location</label>
                  <input
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    placeholder="Location"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Start Time *</label>
                  <input
                    type="datetime-local"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>End Time</label>
                  <input
                    type="datetime-local"
                    value={createForm.end_time}
                    onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      background: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="allDay"
                  checked={createForm.all_day}
                  onChange={(e) => setCreateForm({ ...createForm, all_day: e.target.checked })}
                />
                <label htmlFor="allDay" style={{ fontSize: 14, color: 'var(--color-text)' }}>All Day Event</label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !createForm.title.trim() || !createForm.start_time}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: creating || !createForm.title.trim() || !createForm.start_time ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  opacity: creating || !createForm.title.trim() || !createForm.start_time ? 0.5 : 1,
                }}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
