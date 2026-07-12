import { Play, Activity, Loader2 } from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  draft: 'bg-yellow-100 text-yellow-800',
};

const typeColors: Record<string, string> = {
  approval: 'bg-blue-100 text-blue-800',
  migration: 'bg-purple-100 text-purple-800',
  governance: 'bg-red-100 text-red-800',
  custom: 'bg-gray-100 text-gray-800',
  notification: 'bg-yellow-100 text-yellow-800',
  task: 'bg-green-100 text-green-800',
};

export const TaskWorkflows = () => {
  const { workflows, total, loading, error } = useWorkflows();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workflows</h1>
          <p className="text-neutral-600 mt-1">Manage workflow definitions and instances ({total} total)</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Play className="w-4 h-4" />
          New Workflow
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
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Workflow Definitions</h2>
          </div>
          <div className="divide-y divide-neutral-200">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-4 hover:bg-neutral-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <Activity className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{workflow.name}</p>
                      {workflow.description && (
                        <p className="text-sm text-neutral-600 mt-1">{workflow.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                        <span>Steps: {workflow.steps?.length || 0}</span>
                        <span>Version: {workflow.version}</span>
                        <span>Updated: {workflow.updated_at}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[workflow.type] || 'bg-gray-100 text-gray-800'}`}>
                      {workflow.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[workflow.status] || 'bg-gray-100 text-gray-800'}`}>
                      {workflow.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {workflows.length === 0 && (
              <div className="p-8 text-center text-neutral-500">No workflows found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
