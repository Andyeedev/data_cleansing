import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'usr-1', type: 'status', title: 'User Directory', size: 'lg' },
  { id: 'usr-2', type: 'status', title: 'Active Users', size: 'lg' },
  { id: 'usr-3', type: 'status', title: 'User Activity', size: 'lg' },
  { id: 'usr-4', type: 'status', title: 'User Lifecycle', size: 'lg' },
  { id: 'usr-5', type: 'status', title: 'Account Status', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'User Directory', description: '1,247 users in the platform' },
  { status: 'success' as const, title: 'Active Users', description: '892 users active in last 30 days' },
  { status: 'success' as const, title: 'User Activity', description: 'User engagement trending upward' },
  { status: 'info' as const, title: 'User Lifecycle', description: '12 users pending onboarding' },
  { status: 'success' as const, title: 'Account Status', description: '98.5% of accounts in good standing' },
];

export const UserManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">User Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage platform users and accounts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
