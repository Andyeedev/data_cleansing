import { useOperationsDashboard } from '../hooks/useOperationsDashboard';
import { OperationsExecution } from './OperationsExecution';
import { OperationsQueues } from './OperationsQueues';
import { OperationsAlerts } from './OperationsAlerts';
import { OperationsFailures } from './OperationsFailures';
import { OperationsMonitoring } from './OperationsMonitoring';
import { OperationsHealth } from './OperationsHealth';
import { OperationsSchedules } from './OperationsSchedules';

export const OperationsHome = () => {
  const { metrics, queue, alerts, activities, systemHealth, refresh } = useOperationsDashboard();

  return (
    <div className="space-y-6">
      {/* Execution Overview */}
      <OperationsExecution metrics={metrics} onRefresh={refresh} />

      {/* Queue + Alerts + Failures Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OperationsQueues queue={queue} />
        <OperationsAlerts alerts={alerts} />
        <OperationsFailures metrics={metrics} />
      </div>

      {/* Schedules + Monitoring + Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OperationsSchedules metrics={metrics} />
        <OperationsMonitoring activities={activities} />
        <OperationsHealth systemHealth={systemHealth} />
      </div>
    </div>
  );
};
