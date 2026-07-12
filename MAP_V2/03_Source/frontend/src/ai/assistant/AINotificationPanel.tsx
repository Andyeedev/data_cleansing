import { useState } from 'react';

export interface AINotification {
  id: string;
  type: 'insight' | 'recommendation' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  module: string;
}

const MOCK_NOTIFICATIONS: AINotification[] = [
  {
    id: '1',
    type: 'insight',
    title: 'Migration Progress Insight',
    message: 'Migration is 78% complete. Expected completion in 3 days.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    module: 'migration'
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Optimization Recommendation',
    message: 'Consider batch processing for improved validation performance.',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    module: 'operations'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Security Alert',
    message: 'Unusual login pattern detected for admin account.',
    timestamp: new Date(Date.now() - 10800000),
    read: true,
    module: 'security'
  }
];

export const AINotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<AINotification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insight': return '💡';
      case 'recommendation': return '🎯';
      case 'alert': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight': return '#3b82f6';
      case 'recommendation': return '#8b5cf6';
      case 'alert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Notifications</span>
          {unreadCount > 0 && (
            <span style={{
              padding: '2px 6px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 600
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: unreadCount > 0 ? '#3b82f6' : '#9ca3af',
            cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '11px'
          }}
        >
          Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: filter === f ? '#f9fafb' : 'transparent',
              border: 'none',
              borderBottom: filter === f ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: filter === f ? 500 : 400,
              color: filter === f ? '#3b82f6' : '#6b7280',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '32px 16px'
          }}>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                backgroundColor: notification.read ? '#ffffff' : '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>
                  {getTypeIcon(notification.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151'
                    }}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getTypeColor(notification.type)
                      }} />
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                    {notification.message}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                      {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '1px 4px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '2px',
                      color: '#6b7280'
                    }}>
                      {notification.module}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AINotificationPanel;
