import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'audit-1', type: 'status', title: 'Login History', size: 'lg' },
  { id: 'audit-2', type: 'status', title: 'Administrative Changes', size: 'lg' },
  { id: 'audit-3', type: 'status', title: 'Credential Activity', size: 'lg' },
  { id: 'audit-4', type: 'status', title: 'Configuration Changes', size: 'lg' },
  { id: 'audit-5', type: 'status', title: 'User Activity', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Login History', description: '2,847 login events in last 30 days' },
  { status: 'info' as const, title: 'Administrative Changes', description: '15 admin actions in last 7 days' },
  { status: 'success' as const, title: 'Credential Activity', description: 'All credential operations logged' },
  { status: 'info' as const, title: 'Configuration Changes', description: '8 configuration changes in last 7 days' },
  { status: 'success' as const, title: 'User Activity', description: 'User activity logs retained for 90 days' },
];

export const AuditLogs = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Audit Logs</h1>
        <p className="text-sm text-neutral-60 mt-1">Review security audit trails and logs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
