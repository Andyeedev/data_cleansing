import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'sess-1', type: 'status', title: 'Active Sessions', size: 'lg' },
  { id: 'sess-2', type: 'status', title: 'Session Timeout', size: 'lg' },
  { id: 'sess-3', type: 'status', title: 'Concurrent Sessions', size: 'lg' },
  { id: 'sess-4', type: 'status', title: 'Session History', size: 'lg' },
  { id: 'sess-5', type: 'status', title: 'Forced Logout', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Active Sessions', description: '234 active sessions across 89 users' },
  { status: 'success' as const, title: 'Session Timeout', description: '30-minute idle timeout enforced' },
  { status: 'success' as const, title: 'Concurrent Sessions', description: 'Max 3 concurrent sessions per user' },
  { status: 'info' as const, title: 'Session History', description: '90-day session history retained' },
  { status: 'success' as const, title: 'Forced Logout', description: 'Admin can force logout all sessions' },
];

export const SessionManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Session Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Monitor and manage user sessions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
