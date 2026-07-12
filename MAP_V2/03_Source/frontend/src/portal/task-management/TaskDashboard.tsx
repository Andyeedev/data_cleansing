import { ClipboardList, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';

const stats = [
  { label: 'Total Tasks', value: '124', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'In Progress', value: '38', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Completed', value: '82', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Overdue', value: '4', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
];

const recentTasks = [
  { id: '1', title: 'Validate customer dataset migration', status: 'in_progress', priority: 'high', assignee: 'John Smith', due: '2026-07-15' },
  { id: '2', title: 'Review governance policies', status: 'pending', priority: 'medium', assignee: 'Sarah Jones', due: '2026-07-18' },
  { id: '3', title: 'Execute batch processing job', status: 'completed', priority: 'low', assignee: 'Mike Chen', due: '2026-07-12' },
  { id: '4', title: 'Update mapping rules', status: 'pending', priority: 'high', assignee: 'Emily Davis', due: '2026-07-14' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskDashboard = () => {
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

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {recentTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {task.assignee}
                    </span>
                    <span>Due: {task.due}</span>
                  </div>
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
        </div>
      </div>
    </div>
  );
};
