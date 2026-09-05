import { useState } from 'react';
import { useNotificationList, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Pagination } from '../components/shared/Pagination';
import { TabBar } from '../components/shared/TabBar';

const typeTabs = [
  { key: '', label: 'All Types' },
  { key: 'info', label: 'Info' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'error', label: 'Error' },
];

const readTabs = [
  { key: '', label: 'All Status' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

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

  const getStatusVariant = (type: string): 'info' | 'success' | 'warning' | 'danger' => {
    switch (type) {
      case 'info': return 'info';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          disabled={markingAll}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'none',
            color: 'var(--color-text)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-base)',
          }}
        >
          {markingAll ? 'Marking...' : 'Mark All as Read'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <TabBar
          tabs={typeTabs}
          activeTab={typeFilter}
          onTabChange={(key) => { setTypeFilter(key); setPage(1); }}
        />
        <TabBar
          tabs={readTabs}
          activeTab={readFilter}
          onTabChange={(key) => { setReadFilter(key); setPage(1); }}
        />
      </div>

      {loading && <LoadingSkeleton variant="list" rows={5} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          {data.notifications.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="No notifications"
              description={(typeFilter || readFilter) ? 'Try different filters' : "You're all caught up!"}
            />
          ) : (
            <div style={{
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              {data.notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    padding: 'var(--space-md)',
                    borderBottom: index < data.notifications.length - 1 ? 'var(--border-width) solid var(--color-border)' : 'none',
                    background: notification.read ? 'transparent' : 'rgba(59, 130, 246, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', flex: 1 }}>
                      <span style={{ fontSize: 'var(--icon-md)' }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: notification.read ? 'var(--font-weight-normal)' : 'var(--font-weight-semibold)',
                          marginBottom: 'var(--space-xs)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)',
                        }}>
                          <span>{notification.title || 'Notification'}</span>
                          {!notification.read && (
                            <span aria-hidden="true" style={{
                              width: 'var(--space-sm)',
                              height: 'var(--space-sm)',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--color-primary)',
                              display: 'inline-block',
                            }} />
                          )}
                        </div>
                        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                          {notification.message}
                        </p>
                        <div style={{
                          marginTop: 'var(--space-sm)',
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-secondary)',
                          display: 'flex',
                          gap: 'var(--space-md)',
                        }}>
                          <StatusBadge
                            status={notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            variant={getStatusVariant(notification.type)}
                            size="sm"
                          />
                          <span>·</span>
                          <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      {!notification.read && (
                        <button
                          onClick={async () => {
                            const success = await markAsRead(notification.id);
                            if (success) refetch();
                          }}
                          aria-label={`Mark ${notification.title || 'notification'} as read`}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-primary)',
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
                        aria-label={`Delete ${notification.title || 'notification'}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 'var(--space-xs) var(--space-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-danger)',
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

          <Pagination
            page={page}
            pageSize={20}
            total={data.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
