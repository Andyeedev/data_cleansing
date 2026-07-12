import { CheckCircle, XCircle, Clock, User, Loader2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskApprovals = () => {
  const { tasks, loading, error } = useTasks({ status: 'pending' });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Approvals</h1>
        <p className="text-neutral-600 mt-1">Review and manage pending approvals</p>
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
              <div key={task.id} className="p-4 hover:bg-neutral-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                      {task.assigned_by && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Requester: {task.assigned_by}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.created_at}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                    {task.status === 'pending' && (
                      <div className="flex items-center gap-1 ml-2">
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-8 text-center text-neutral-500">No pending approvals</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
