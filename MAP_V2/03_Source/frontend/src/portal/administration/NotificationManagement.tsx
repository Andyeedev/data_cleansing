import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'notif-1', type: 'status', title: 'Notification Templates', size: 'lg' },
  { id: 'notif-2', type: 'status', title: 'Delivery Channels', size: 'lg' },
  { id: 'notif-3', type: 'status', title: 'Email', size: 'lg' },
  { id: 'notif-4', type: 'status', title: 'Teams', size: 'lg' },
  { id: 'notif-5', type: 'status', title: 'SMS', size: 'lg' },
  { id: 'notif-6', type: 'status', title: 'Notification History', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Notification Templates', description: '18 notification templates configured' },
  { status: 'success' as const, title: 'Delivery Channels', description: 'Email, Teams, SMS channels active' },
  { status: 'success' as const, title: 'Email', description: 'Email delivery functioning normally' },
  { status: 'success' as const, title: 'Teams', description: 'Teams integration active' },
  { status: 'success' as const, title: 'SMS', description: 'SMS gateway connected' },
  { status: 'success' as const, title: 'Notification History', description: '1,247 notifications sent this month' },
];

export const NotificationManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Notification Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage notification templates and delivery</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
