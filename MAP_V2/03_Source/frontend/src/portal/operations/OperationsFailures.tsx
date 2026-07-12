import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import type { OperationsMetrics } from '../types/OperationsMetrics';

interface OperationsFailuresProps {
  metrics: OperationsMetrics;
  isLoading?: boolean;
}

export const OperationsFailures = ({ metrics }: OperationsFailuresProps) => {
  const failureKpis = [
    { id: 'fail-failed', label: 'Failed Controls', value: metrics.failedControls },
    { id: 'fail-retry', label: 'Retry Queue', value: metrics.retryQueue },
    { id: 'fail-validation', label: 'Validation Errors', value: metrics.validationErrors },
    { id: 'fail-timeout', label: 'Execution Timeouts', value: metrics.executionTimeouts },
  ];

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Failures & Retries</h3>
      <div className="grid grid-cols-2 gap-3">
        {failureKpis.map((kpi) => {
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
