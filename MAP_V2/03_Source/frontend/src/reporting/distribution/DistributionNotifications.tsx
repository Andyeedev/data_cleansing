import { useDistribution } from './hooks/useDistribution';

export const DistributionNotifications = () => {
  const { notifications } = useDistribution();

  const typeColors: Record<string, string> = {
    email: '#3b82f6',
    teams: '#8b5cf6',
    sms: '#10b981',
    portal: '#f59e0b',
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Notifications</h2>
      <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        {notifications.map((notification) => (
          <div key={notification.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)', background: notification.read ? 'transparent' : 'var(--color-background, #f9fafb)' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: typeColors[notification.type] || '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
              {notification.type.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)', marginBottom: '0.25rem' }}>{notification.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>{notification.message}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginTop: '0.25rem' }}>{new Date(notification.createdAt).toLocaleString()}</div>
            </div>
            {!notification.read && (
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--color-primary, #2563eb)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
