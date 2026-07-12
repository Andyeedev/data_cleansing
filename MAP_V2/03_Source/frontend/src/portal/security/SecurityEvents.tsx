import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'evt-1', type: 'status', title: 'Critical Alerts', size: 'lg' },
  { id: 'evt-2', type: 'status', title: 'Failed Logins', size: 'lg' },
  { id: 'evt-3', type: 'status', title: 'Suspicious Activity', size: 'lg' },
  { id: 'evt-4', type: 'status', title: 'Security Incidents', size: 'lg' },
  { id: 'evt-5', type: 'timeline', title: 'Event Timeline', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Critical Alerts', description: 'No critical alerts in last 24 hours' },
  { status: 'warning' as const, title: 'Failed Logins', description: '12 failed login attempts detected' },
  { status: 'success' as const, title: 'Suspicious Activity', description: 'No suspicious activity detected' },
  { status: 'success' as const, title: 'Security Incidents', description: 'No open security incidents' },
  { title: 'Event Timeline', description: 'Security events from last 7 days' },
];

export const SecurityEvents = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Security Events</h1>
        <p className="text-sm text-neutral-60 mt-1">Monitor security events and alerts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
