import type { OperationsSystemHealth } from '../types/OperationsQueue';

interface OperationsHealthProps {
  systemHealth: OperationsSystemHealth[];
  isLoading?: boolean;
}

const statusColors = {
  healthy: 'bg-success-500',
  degraded: 'bg-warning-500',
  down: 'bg-error-500',
};

const statusLabels = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
};

export const OperationsHealth = ({ systemHealth }: OperationsHealthProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">System Health</h3>

      <div className="space-y-3">
        {systemHealth.map((item) => (
          <div key={item.component} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
              <span className="text-xs text-neutral-100">{item.component}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.latency && (
                <span className="text-[10px] text-neutral-60">{item.latency}</span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                item.status === 'healthy' ? 'bg-success-50 text-success-500' :
                item.status === 'degraded' ? 'bg-warning-50 text-warning-500' :
                'bg-error-50 text-error-500'
              }`}>
                {statusLabels[item.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
