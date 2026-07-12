import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import type { OperationsMetrics } from '../types/OperationsMetrics';

interface OperationsExecutionProps {
  metrics: OperationsMetrics;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const OperationsExecution = ({ metrics, onRefresh }: OperationsExecutionProps) => {
  const kpis = [
    { id: 'ops-running', label: 'Running', value: metrics.runningExecutions, color: 'text-success-500' },
    { id: 'ops-queued', label: 'Queued', value: metrics.queuedJobs, color: 'text-warning-500' },
    { id: 'ops-completed', label: 'Completed Today', value: metrics.completedToday, color: 'text-primary-500' },
    { id: 'ops-failed', label: 'Failed Today', value: metrics.failedToday, color: 'text-error-500' },
    { id: 'ops-runtime', label: 'Avg Runtime', value: metrics.averageRuntime, color: 'text-neutral-100' },
    { id: 'ops-success', label: 'Success Rate', value: `${metrics.executionSuccessRate}%`, color: 'text-success-500' },
  ];

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Execution Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const config: WidgetConfig = {
            id: kpi.id,
            type: 'kpi',
            title: kpi.label,
            size: 'md',
          };

          return (
            <WidgetRenderer
              key={kpi.id}
              config={config}
              data={{ value: kpi.value, label: kpi.label }}
              onRefresh={onRefresh}
            />
          );
        })}
      </div>
    </div>
  );
};
