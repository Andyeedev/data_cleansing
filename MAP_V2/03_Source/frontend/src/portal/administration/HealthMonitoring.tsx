import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'health-1', type: 'kpi', title: 'Platform Health', size: 'lg' },
  { id: 'health-2', type: 'status', title: 'Service Availability', size: 'lg' },
  { id: 'health-3', type: 'status', title: 'API Status', size: 'lg' },
  { id: 'health-4', type: 'status', title: 'Database Status', size: 'lg' },
  { id: 'health-5', type: 'status', title: 'Infrastructure Overview', size: 'lg' },
];

const sampleData = [
  { value: '98.7%', label: 'Overall platform health score' },
  { status: 'success' as const, title: 'Service Availability', description: '99.99% uptime in last 30 days' },
  { status: 'success' as const, title: 'API Status', description: 'All API endpoints responding normally' },
  { status: 'success' as const, title: 'Database Status', description: 'Databases healthy, replication lag <1ms' },
  { status: 'success' as const, title: 'Infrastructure Overview', description: 'All infrastructure components operational' },
];

export const HealthMonitoring = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Health Monitoring</h1>
        <p className="text-sm text-neutral-60 mt-1">Monitor platform health and availability</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
