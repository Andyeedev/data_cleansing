import { ClipboardList, CheckCircle, Clock, AlertTriangle, Users, Loader2, AlertCircle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useNotifications, useUnreadCount } from '../../hooks/useNotifications';
import { useWorkflows } from '../../hooks/useWorkflows';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskDashboard = () => {
  const { tasks, total: totalTasks, loading: tasksLoading } = useTasks({ page_size: 10 });
  const { notifications, total: totalNotifications } = useNotifications({ is_read: false, page_size: 5 });
  const { workflows, total: totalWorkflows } = useWorkflows({ status: 'active' });
  const { count: unreadCount } = useUnreadCount();

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Overdue', value: overdueTasks, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  if (tasksLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Task Management Dashboard</h1>
        <p className="text-neutral-600 mt-1">Overview of tasks, workflows, and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Tasks</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-4 hover:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{task.title}</p>
                    {task.due_date && (
                      <p className="text-sm text-neutral-600 mt-1">Due: {task.due_date}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-4 text-center text-neutral-500">No tasks found</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Notifications</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-neutral-50">
                <p className="font-medium text-neutral-900">{notification.title}</p>
                <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                <p className="text-xs text-neutral-500 mt-1">{notification.created_at}</p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-4 text-center text-neutral-500">No notifications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
