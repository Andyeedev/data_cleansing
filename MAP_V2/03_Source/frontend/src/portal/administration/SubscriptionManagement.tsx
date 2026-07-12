import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'sub-1', type: 'status', title: 'Subscription Plans', size: 'lg' },
  { id: 'sub-2', type: 'status', title: 'Subscription Status', size: 'lg' },
  { id: 'sub-3', type: 'status', title: 'Tenant Plans', size: 'lg' },
  { id: 'sub-4', type: 'status', title: 'Usage', size: 'lg' },
  { id: 'sub-5', type: 'status', title: 'Billing Overview', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Subscription Plans', description: '4 plans: Free, Starter, Professional, Enterprise' },
  { status: 'success' as const, title: 'Subscription Status', description: 'All subscriptions active and current' },
  { status: 'success' as const, title: 'Tenant Plans', description: 'Plan distribution across tenants' },
  { status: 'success' as const, title: 'Usage', description: 'Usage within plan limits for all tenants' },
  { status: 'success' as const, title: 'Billing Overview', description: 'All billing up to date' },
];

export const SubscriptionManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Subscription Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage subscriptions and billing</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
