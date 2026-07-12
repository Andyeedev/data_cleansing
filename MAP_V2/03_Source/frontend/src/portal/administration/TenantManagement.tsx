import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'ten-1', type: 'status', title: 'Tenant Directory', size: 'lg' },
  { id: 'ten-2', type: 'status', title: 'Tenant Status', size: 'lg' },
  { id: 'ten-3', type: 'status', title: 'Tenant Provisioning', size: 'lg' },
  { id: 'ten-4', type: 'status', title: 'Tenant Configuration', size: 'lg' },
  { id: 'ten-5', type: 'status', title: 'Tenant Usage', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Tenant Directory', description: '18 active tenants in the platform' },
  { status: 'success' as const, title: 'Tenant Status', description: 'All tenants operational' },
  { status: 'info' as const, title: 'Tenant Provisioning', description: '1 tenant pending provisioning' },
  { status: 'success' as const, title: 'Tenant Configuration', description: 'All tenant configurations validated' },
  { status: 'success' as const, title: 'Tenant Usage', description: 'Usage within limits for all tenants' },
];

export const TenantManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Tenant Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage multi-tenant platform instances</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
