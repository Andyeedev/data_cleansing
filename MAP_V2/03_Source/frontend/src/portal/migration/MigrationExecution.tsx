import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const executions = [
  { id: 'e1', name: 'Customer Batch 18', status: 'running', started: '10 min ago', progress: 65, records: '12,450' },
  { id: 'e2', name: 'Transaction Run 42', status: 'running', started: '8 min ago', progress: 45, records: '8,230' },
  { id: 'e3', name: 'Account Sync 12', status: 'queued', started: '-', progress: 0, records: '-' },
  { id: 'e4', name: 'Customer Batch 17', status: 'completed', started: '1 hour ago', progress: 100, records: '11,890' },
  { id: 'e5', name: 'Transaction Run 41', status: 'completed', started: '2 hours ago', progress: 100, records: '9,100' },
];

const statusStyles = {
  running: 'bg-success-50 text-success-500',
  queued: 'bg-warning-50 text-warning-500',
  completed: 'bg-primary-50 text-primary-500',
  failed: 'bg-error-50 text-error-500',
};

export const MigrationExecution = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Migration Execution</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-success-500 text-white rounded-lg text-sm hover:bg-success-600 transition-colors">
            Start Migration
          </button>
          <button className="px-4 py-2 bg-error-500 text-white rounded-lg text-sm hover:bg-error-600 transition-colors">
            Stop All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'exec-running', label: 'Running', value: 5 },
          { id: 'exec-queued', label: 'Queued', value: 8 },
          { id: 'exec-completed', label: 'Completed Today', value: 18 },
          { id: 'exec-failed', label: 'Failed Today', value: 1 },
        ].map((kpi) => (
          <WidgetRenderer
            key={kpi.id}
            config={{ id: kpi.id, type: 'kpi', title: kpi.label, size: 'md' } as WidgetConfig}
            data={{ value: kpi.value, label: kpi.label }}
          />
        ))}
      </div>

      <div className="bg-white border border-neutral-30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-30">
          <h3 className="text-sm font-semibold text-neutral-100">Execution Queue</h3>
        </div>
        <div className="divide-y divide-neutral-30">
          {executions.map((exec) => (
            <div key={exec.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-100">{exec.name}</p>
                <p className="text-xs text-neutral-60">Started: {exec.started} | Records: {exec.records}</p>
              </div>
              <div className="w-20">
                <div className="h-2 bg-neutral-20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${exec.progress}%` }} />
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[exec.status as keyof typeof statusStyles]}`}>
                {exec.status}
              </span>
              <div className="flex gap-1">
                {exec.status === 'running' && (
                  <button className="text-[10px] px-2 py-1 bg-error-50 text-error-500 rounded hover:bg-error-100">Stop</button>
                )}
                {exec.status === 'queued' && (
                  <button className="text-[10px] px-2 py-1 bg-success-50 text-success-500 rounded hover:bg-success-100">Start</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
