import { Play, Pause, CheckCircle, Clock, Activity } from 'lucide-react';

const mockWorkflows = [
  { id: '1', name: 'User Provisioning', type: 'approval', status: 'active', instances: 12, lastRun: '2026-07-12 10:30' },
  { id: '2', name: 'Role Change Request', type: 'approval', status: 'active', instances: 5, lastRun: '2026-07-11 14:20' },
  { id: '3', name: 'Migration Execution', type: 'migration', status: 'active', instances: 8, lastRun: '2026-07-12 09:15' },
  { id: '4', name: 'Data Validation', type: 'validation', status: 'active', instances: 15, lastRun: '2026-07-12 11:00' },
  { id: '5', name: 'Compliance Check', type: 'governance', status: 'inactive', instances: 0, lastRun: '2026-07-10 16:45' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

const typeColors: Record<string, string> = {
  approval: 'bg-blue-100 text-blue-800',
  migration: 'bg-purple-100 text-purple-800',
  validation: 'bg-yellow-100 text-yellow-800',
  governance: 'bg-red-100 text-red-800',
};

export const TaskWorkflows = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workflows</h1>
          <p className="text-neutral-600 mt-1">Manage workflow definitions and instances</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Play className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Workflow Definitions</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {mockWorkflows.map((workflow) => (
            <div key={workflow.id} className="p-4 hover:bg-neutral-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Activity className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{workflow.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
                      <span>Instances: {workflow.instances}</span>
                      <span>Last run: {workflow.lastRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[workflow.type]}`}>
                    {workflow.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[workflow.status]}`}>
                    {workflow.status}
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
