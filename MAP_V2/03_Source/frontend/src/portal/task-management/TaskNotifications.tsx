import { Bell, CheckCircle, AlertTriangle, Info, Trash } from 'lucide-react';

const mockNotifications = [
  { id: '1', type: 'success', title: 'Task Completed', message: 'Data validation batch completed successfully', time: '5 min ago', read: false },
  { id: '2', type: 'warning', title: 'Approval Required', message: 'Role change request needs your approval', time: '1 hour ago', read: false },
  { id: '3', type: 'info', title: 'Workflow Update', message: 'Migration workflow stage 2 started', time: '2 hours ago', read: true },
  { id: '4', type: 'error', title: 'Task Failed', message: 'Batch processing job failed due to timeout', time: '3 hours ago', read: true },
  { id: '5', type: 'info', title: 'New Assignment', message: 'You have been assigned a new task', time: '5 hours ago', read: true },
];

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
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-neutral-600 mt-1">Stay updated on tasks and workflows</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {mockNotifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-neutral-50 ${!notification.read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${typeColors[notification.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{notification.title}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
                  </div>
                  <button className="p-1 text-neutral-400 hover:text-red-600 rounded">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
