import { Bell, CheckCircle, AlertTriangle, Info, Trash, Loader2 } from 'lucide-react';
import { useNotifications, useMarkAllRead, useDeleteNotification } from '../../hooks/useNotifications';

const typeIcons: Record<string, React.ElementType> = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
};

const typeColors: Record<string, string> = {
  success: 'text-green-600 bg-green-50',
  warning: 'text-yellow-600 bg-yellow-50',
  info: 'text-blue-600 bg-blue-50',
  error: 'text-red-600 bg-red-50',
};

export const TaskNotifications = () => {
  const { notifications, loading, error, refetch } = useNotifications();
  const { markAllRead } = useMarkAllRead();
  const { remove } = useDeleteNotification();

  const handleMarkAllRead = async () => {
    await markAllRead();
    refetch();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-600 mt-1">Stay updated on tasks and workflows</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Mark all as read
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="divide-y divide-neutral-200">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Info;
              const colorClass = typeColors[notification.type] || 'text-gray-600 bg-gray-50';
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-neutral-50 ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">{notification.title}</p>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-neutral-500 mt-1">{notification.created_at}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="p-8 text-center text-neutral-500">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
