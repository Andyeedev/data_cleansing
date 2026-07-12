import { useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { useMyTasks } from '../../hooks/useTasks';

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

export const MyTasks = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { tasks, total, loading, error } = useMyTasks({ status: statusFilter || undefined });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Tasks</h1>
          <p className="text-neutral-600 mt-1">Tasks assigned to you ({total} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-600" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
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
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-neutral-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                    )}
                    <p className="text-sm text-neutral-500 mt-1">
                      {task.due_date ? `Due: ${task.due_date}` : 'No due date'}
                    </p>
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
              <div className="p-8 text-center text-neutral-500">No tasks found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
