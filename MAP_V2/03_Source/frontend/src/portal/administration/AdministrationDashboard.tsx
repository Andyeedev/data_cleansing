import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'dash-1', type: 'kpi', title: 'Platform KPIs', size: 'lg' },
  { id: 'dash-2', type: 'status', title: 'Tenant Overview', size: 'lg' },
  { id: 'dash-3', type: 'status', title: 'User Activity', size: 'lg' },
  { id: 'dash-4', type: 'status', title: 'Job Scheduler', size: 'lg' },
  { id: 'dash-5', type: 'notification', title: 'Platform Alerts', size: 'lg' },
  { id: 'dash-6', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' },
];

const sampleData = [
  { value: '98.7%', label: 'Platform health score' },
  { status: 'success' as const, title: 'Tenant Overview', description: '18 tenants, all operational' },
  { status: 'success' as const, title: 'User Activity', description: '1,247 active users this month' },
  { status: 'success' as const, title: 'Job Scheduler', description: '34 scheduled jobs, 2 failed' },
  { title: 'Platform Alerts', description: '2 active warnings' },
  { summary: 'Platform is healthy. Consider upgrading 3 licences expiring soon. 1 tenant approaching user limit.' },
];

export const AdministrationDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Administration Dashboard</h1>
        <p className="text-sm text-neutral-60 mt-1">Operational administration workspace</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
