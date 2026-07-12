import type { ExecutiveNotificationItem } from '../types/ExecutiveDashboard';

interface ExecutiveNotificationsProps {
  notifications: ExecutiveNotificationItem[];
}

const typeStyles = {
  critical: 'border-l-error-500 bg-error-50',
  system: 'border-l-info-500 bg-info-50',
  approval: 'border-l-warning-500 bg-warning-50',
  review: 'border-l-primary-500 bg-primary-50',
  escalation: 'border-l-error-500 bg-error-50',
};

export const ExecutiveNotifications = ({ notifications }: ExecutiveNotificationsProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-100">Notifications</h3>
        <span className="text-xs text-primary-500 cursor-pointer hover:underline">
          View All ({notifications.filter((n) => !n.read).length} unread)
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`border-l-4 rounded-r-lg p-3 ${typeStyles[notification.type]} ${!notification.read ? 'font-medium' : 'opacity-70'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-100 truncate">{notification.title}</p>
                <p className="text-xs text-neutral-60 truncate">{notification.message}</p>
              </div>
              <span className="text-[10px] text-neutral-50 whitespace-nowrap">{notification.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
