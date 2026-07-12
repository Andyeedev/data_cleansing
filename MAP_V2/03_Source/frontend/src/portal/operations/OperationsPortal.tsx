import { useLocation } from 'react-router-dom';
import { PortalShell } from '../framework/PortalShell';
import { PortalRegistry } from '../registry/PortalRegistry';
import { OperationsHome } from './OperationsHome';
import { OperationsExecution } from './OperationsExecution';
import { OperationsQueues } from './OperationsQueues';
import { OperationsSchedules } from './OperationsSchedules';
import { OperationsMonitoring } from './OperationsMonitoring';
import { OperationsAlerts } from './OperationsAlerts';
import { OperationsRetry } from './OperationsRetry';
import { defaultOperationsMetrics } from '../types/OperationsMetrics';
import type { OperationsQueueItem, OperationsActivityItem, OperationsAlert } from '../types/OperationsQueue';

const DEMO_QUEUE: OperationsQueueItem[] = [
  { id: 'q-1', name: 'Data Validation Batch', type: 'execution', status: 'running', priority: 'high', createdAt: new Date().toISOString() },
  { id: 'q-2', name: 'Schema Migration', type: 'execution', status: 'queued', priority: 'medium', createdAt: new Date().toISOString() },
  { id: 'q-3', name: 'Data Quality Check', type: 'execution', status: 'completed', priority: 'low', createdAt: new Date().toISOString() },
];

const DEMO_ACTIVITIES: OperationsActivityItem[] = [
  { id: 'a-1', type: 'execution', title: 'Batch Complete', description: 'Migration batch completed successfully', timestamp: new Date().toISOString(), status: 'success' },
  { id: 'a-2', type: 'notification', title: 'Memory Alert', description: 'High memory usage detected', timestamp: new Date().toISOString(), status: 'warning' },
  { id: 'a-3', type: 'dataset', title: 'Health Check', description: 'System health check passed', timestamp: new Date().toISOString(), status: 'info' },
];

const DEMO_ALERTS: OperationsAlert[] = [
  { id: 'al-1', type: 'infrastructure', title: 'Connection Pool', message: 'Database connection pool exhausted', timestamp: new Date().toISOString(), severity: 'high', acknowledged: false },
  { id: 'al-2', type: 'warning', title: 'Queue Depth', message: 'Queue depth exceeding threshold', timestamp: new Date().toISOString(), severity: 'medium', acknowledged: false },
];

const ExecutionsPage = () => <OperationsExecution metrics={defaultOperationsMetrics} />;
const QueuesPage = () => <OperationsQueues queue={DEMO_QUEUE} />;
const SchedulesPage = () => <OperationsSchedules metrics={defaultOperationsMetrics} />;
const MonitoringPage = () => <OperationsMonitoring activities={DEMO_ACTIVITIES} />;
const AlertsPage = () => <OperationsAlerts alerts={DEMO_ALERTS} />;

const routeComponents: Record<string, React.ComponentType> = {
  '/operations': OperationsHome,
  '/operations/overview': OperationsHome,
  '/operations/executions': ExecutionsPage,
  '/operations/queues': QueuesPage,
  '/operations/schedules': SchedulesPage,
  '/operations/monitoring': MonitoringPage,
  '/operations/alerts': AlertsPage,
  '/operations/retry': OperationsRetry,
};

export const OperationsPortal = () => {
  const location = useLocation();
  const portal = PortalRegistry.get('operations');

  if (!portal) {
    return <div className="p-8 text-center text-neutral-60">Operations Portal not found</div>;
  }

  const PageComponent = routeComponents[location.pathname] || OperationsHome;

  return (
    <PortalShell portal={portal}>
      <PageComponent />
    </PortalShell>
  );
};
