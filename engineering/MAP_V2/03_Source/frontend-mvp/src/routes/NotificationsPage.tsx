import { useState } from 'react';
import { useNotificationList, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('');

  const { data, loading, error, refetch } = useNotificationList({
    page,
    page_size: 20,
    type: typeFilter || undefined,
    read: readFilter ? readFilter === 'read' : undefined,
  });

  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead, loading: markingAll } = useMarkAllAsRead();
  const { remove } = useDeleteNotification();

  const handleMarkAllRead = async () => {
    const success = await markAllAsRead();
    if (success) refetch();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return '#3b82f6';
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          disabled={markingAll}
          style={{
            padding: '8px 16px',
            background: 'none',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {markingAll ? 'Marking...' : 'Mark All as Read'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
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
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <select
          value={readFilter}
          onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        >
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <>
          {data.notifications.length === 0 ? (
            <div style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No notifications</p>
              <p style={{ fontSize: 14 }}>
                {(typeFilter || readFilter) ? 'Try different filters' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              {data.notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '16px',
                    borderBottom: index < data.notifications.length - 1 ? '1px solid var(--color-border)' : 'none',
                    background: notification.read ? 'transparent' : 'rgba(59, 130, 246, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                      <span style={{ fontSize: 20 }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: notification.read ? 400 : 600,
                          marginBottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <span>{notification.title || 'Notification'}</span>
                          {!notification.read && (
                            <span style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#3b82f6',
                              display: 'inline-block',
                            }} />
                          )}
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                          {notification.message}
                        </p>
                        <div style={{
                          marginTop: 8,
                          fontSize: 12,
                          color: 'var(--color-text-tertiary)',
                          display: 'flex',
                          gap: 12,
                        }}>
                          <span style={{ color: getNotificationColor(notification.type) }}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                          <span>·</span>
                          <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {!notification.read && (
                        <button
                          onClick={async () => {
                            const success = await markAsRead(notification.id);
                            if (success) refetch();
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 12,
                            color: '#3b82f6',
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this notification?')) return;
                          const success = await remove(notification.id);
                          if (success) refetch();
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: '#ef4444',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
