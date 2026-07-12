import { FolderTree, Play, Bot, ListTodo } from 'lucide-react';

export const MigrationWorkspace = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-100">Migration Workspace</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Explorer */}
        <div className="bg-white border border-neutral-30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FolderTree className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-semibold text-neutral-100">Project Explorer</h3>
          </div>
          <div className="space-y-2">
            {['Core Customer Migration', 'Transaction Data Sync', 'Account Data Migration'].map((project) => (
              <div key={project} className="p-2 rounded-lg border border-neutral-30 hover:border-primary-300 cursor-pointer transition-colors">
                <p className="text-xs font-medium text-neutral-100">{project}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Queue */}
        <div className="bg-white border border-neutral-30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-warning-500" />
            <h3 className="text-sm font-semibold text-neutral-100">Execution Queue</h3>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Customer Batch 18', status: 'running' },
              { name: 'Transaction Run 42', status: 'running' },
              { name: 'Account Sync 12', status: 'queued' },
            ].map((item) => (
              <div key={item.name} className="p-2 rounded-lg border border-neutral-30 hover:border-primary-300 cursor-pointer transition-colors">
                <p className="text-xs font-medium text-neutral-100">{item.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  item.status === 'running' ? 'bg-success-50 text-success-500' : 'bg-warning-50 text-warning-500'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white border border-neutral-30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-neutral-100">AI Recommendations</h3>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-xs text-purple-700">Complete dataset mappings before next execution window</p>
            </div>
            <div className="p-2 rounded-lg bg-warning-50 border border-warning-200">
              <p className="text-xs text-warning-700">Review increased warning volume in Transaction Data</p>
            </div>
            <div className="p-2 rounded-lg bg-success-50 border border-success-200">
              <p className="text-xs text-success-700">Customer Migration on track for completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white border border-neutral-30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Play className="w-4 h-4 text-success-500" />
          <h3 className="text-sm font-semibold text-neutral-100">Active Sessions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Customer Batch 18', started: '10 min ago', progress: 65 },
            { name: 'Transaction Run 42', started: '8 min ago', progress: 45 },
          ].map((session) => (
            <div key={session.name} className="p-3 rounded-lg border border-neutral-30">
              <p className="text-sm font-medium text-neutral-100">{session.name}</p>
              <p className="text-xs text-neutral-60">Started: {session.started}</p>
              <div className="mt-2 h-2 bg-neutral-20 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${session.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
