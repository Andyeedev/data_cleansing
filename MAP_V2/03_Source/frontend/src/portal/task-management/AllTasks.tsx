import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

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

export const AllTasks = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { tasks, total, loading, error } = useTasks({ status: statusFilter || undefined });

  const filteredTasks = search 
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">All Tasks</h1>
          <p className="text-neutral-600 mt-1">Manage all tasks ({total} total)</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 text-sm font-medium text-neutral-600">Task</th>
                <th className="text-left p-4 text-sm font-medium text-neutral-600">Due</th>
                <th className="text-left p-4 text-sm font-medium text-neutral-600">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-neutral-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-neutral-50 cursor-pointer">
                  <td className="p-4">
                    <p className="font-medium text-neutral-900">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-neutral-500 mt-1">{task.description}</p>
                    )}
                  </td>
                  <td className="p-4 text-neutral-600">{task.due_date || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500">No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
