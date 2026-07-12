import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: 'info' as const,
    title: 'System Update',
    message: 'MAP Nexus™ has been updated to version 2.0',
    time: '5 min ago',
  },
  {
    id: 2,
    type: 'success' as const,
    title: 'Migration Complete',
    message: 'Customer data migration finished successfully',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'warning' as const,
    title: 'Validation Alert',
    message: '3 validation rules require attention',
    time: '2 hours ago',
  },
];

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const colorMap = {
  info: 'text-info-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
};

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-30 rounded-xl shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-30">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-neutral-80" />
          <h3 className="font-semibold text-neutral-100">Notifications</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-20 rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-neutral-60" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-auto">
        {mockNotifications.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className="p-4 border-b border-neutral-30 hover:bg-neutral-20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${colorMap[notification.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-100 text-sm">
                    {notification.title}
                  </p>
                  <p className="text-sm text-neutral-60 mt-1">{notification.message}</p>
                  <p className="text-xs text-neutral-60 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4">
        <button className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
};
