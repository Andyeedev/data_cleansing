import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Filter } from 'lucide-react';

const mockMyTasks = [
  { id: '1', title: 'Validate customer dataset migration', status: 'in_progress', priority: 'high', due: '2026-07-15', project: 'Customer Data Migration' },
  { id: '2', title: 'Review data quality rules', status: 'pending', priority: 'medium', due: '2026-07-18', project: 'Data Quality Framework' },
  { id: '3', title: 'Update mapping configuration', status: 'pending', priority: 'high', due: '2026-07-14', project: 'Schema Mapping' },
  { id: '4', title: 'Execute validation batch', status: 'in_progress', priority: 'low', due: '2026-07-20', project: 'Validation Engine' },
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

export const MyTasks = () => {
  const [filter, setFilter] = useState('all');

  const filteredTasks = filter === 'all' 
    ? mockMyTasks 
    : mockMyTasks.filter(t => t.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Tasks</h1>
          <p className="text-neutral-600 mt-1">Tasks assigned to you</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-600" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="divide-y divide-neutral-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-neutral-50 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{task.title}</p>
                  <p className="text-sm text-neutral-600 mt-1">{task.project}</p>
                  <p className="text-sm text-neutral-500 mt-1">Due: {task.due}</p>
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
