import type { OperationsQueueItem } from '../types/OperationsQueue';

interface OperationsQueuesProps {
  queue: OperationsQueueItem[];
}

const statusStyles = {
  running: 'bg-success-50 text-success-500',
  queued: 'bg-warning-50 text-warning-500',
  waiting: 'bg-neutral-20 text-neutral-60',
  failed: 'bg-error-50 text-error-500',
  paused: 'bg-info-50 text-info-500',
  completed: 'bg-success-50 text-success-500',
};

const priorityStyles = {
  high: 'bg-error-50 text-error-500',
  medium: 'bg-warning-50 text-warning-500',
  low: 'bg-neutral-20 text-neutral-60',
};

export const OperationsQueues = ({ queue }: OperationsQueuesProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-100">Execution Queue</h3>
        <span className="text-xs text-neutral-60">{queue.length} items</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queue.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 rounded-lg border border-neutral-30 hover:border-primary-300 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-neutral-100 truncate">{item.name}</p>
              <p className="text-[10px] text-neutral-60">{item.dataset} | {item.createdAt}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[item.status]}`}>
              {item.status}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityStyles[item.priority]}`}>
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
