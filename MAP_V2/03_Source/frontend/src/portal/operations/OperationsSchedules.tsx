import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import type { OperationsMetrics } from '../types/OperationsMetrics';

interface OperationsSchedulesProps {
  metrics: OperationsMetrics;
  isLoading?: boolean;
}

export const OperationsSchedules = ({ metrics }: OperationsSchedulesProps) => {
  const scheduleKpis = [
    { id: 'sched-upcoming', label: 'Upcoming', value: metrics.upcomingExecutions },
    { id: 'sched-recurring', label: 'Recurring', value: metrics.recurringSchedules },
    { id: 'sched-completed', label: 'Completed', value: metrics.completedJobs },
    { id: 'sched-failed', label: 'Failed', value: metrics.failedJobs },
    { id: 'sched-cancelled', label: 'Cancelled', value: metrics.cancelledJobs },
  ];

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Schedule Manager</h3>
      <div className="grid grid-cols-2 gap-3">
        {scheduleKpis.map((kpi) => {
          const config: WidgetConfig = {
            id: kpi.id,
            type: 'kpi',
            title: kpi.label,
            size: 'sm',
          };

          return (
            <WidgetRenderer
              key={kpi.id}
              config={config}
              data={{ value: kpi.value, label: kpi.label }}
            />
          );
        })}
      </div>
    </div>
  );
};
