import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, Info, X, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationList, useMarkAsRead, useMarkAllAsRead, useDeleteNotification, useUnreadCount } from '../../hooks/useNotifications';
import type { Notification } from '../../types/notifications';

const POLL_INTERVAL = 30000;

const severityConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info:    { icon: Info,          color: '#0078d4', bg: '#f0f6fc' },
  success: { icon: CheckCircle,   color: '#28a745', bg: '#f0faf0' },
  warning: { icon: AlertTriangle, color: '#ffb900', bg: '#fff8e1' },
  error:   { icon: AlertTriangle, color: '#d13438', bg: '#fde7e9' },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { data, loading, refetch } = useNotificationList({ page: 1, page_size: 20 });
  const { count: unreadCount, refetch: refetchCount } = useUnreadCount();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();
  const { remove } = useDeleteNotification();
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = data?.notifications || [];

  const poll = useCallback(() => {
    refetch();
    refetchCount();
  }, [refetch, refetchCount]);

  useEffect(() => {
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [poll]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAllRead = async () => {
    const success = await markAllAsRead();
    if (success) poll();
  };

  const handleMarkRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) poll();
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) poll();
  };

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        right: 0,
        top: '100%',
        marginTop: 8,
        width: 380,
        maxHeight: 480,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} style={{ color: 'var(--color-text)' }} />
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              background: '#d13438',
              borderRadius: 10,
              padding: '1px 7px',
              lineHeight: '18px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 4,
                color: 'var(--color-primary)',
                display: 'flex',
              }}
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              color: 'var(--color-text-secondary)',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: 380 }}>
        {loading && notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
            No notifications
          </div>
        ) : (
          notifications.map((n) => {
            const sev = severityConfig[n.type] || severityConfig.info;
            const Icon = sev.icon;
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--color-border)',
                  background: n.is_read ? 'transparent' : 'var(--color-bg-secondary)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.is_read ? 'transparent' : 'var(--color-bg-secondary)')}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: sev.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <Icon size={16} style={{ color: sev.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}>
                    <span style={{
                      fontWeight: n.is_read ? 400 : 600,
                      fontSize: 13,
                      color: 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {n.title}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                      title="Delete"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 2,
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        flexShrink: 0,
                        opacity: 0.5,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                    margin: '2px 0 4px',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {n.message}
                  </p>
                  <span style={{
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                    opacity: 0.7,
                  }}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
                {!n.is_read && (
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#0078d4',
                    flexShrink: 0,
                    marginTop: 6,
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '10px 16px',
          textAlign: 'center',
        }}>
          <button
            onClick={handleViewAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
