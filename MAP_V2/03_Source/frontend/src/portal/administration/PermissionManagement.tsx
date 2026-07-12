import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'perm-1', type: 'status', title: 'Permission Matrix', size: 'lg' },
  { id: 'perm-2', type: 'status', title: 'Access Policies', size: 'lg' },
  { id: 'perm-3', type: 'status', title: 'Security Groups', size: 'lg' },
  { id: 'perm-4', type: 'status', title: 'Permission Audit', size: 'lg' },
  { id: 'perm-5', type: 'status', title: 'Access Requests', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Permission Matrix', description: '156 permissions mapped across 24 roles' },
  { status: 'success' as const, title: 'Access Policies', description: '12 access policies enforced' },
  { status: 'success' as const, title: 'Security Groups', description: '18 security groups configured' },
  { status: 'success' as const, title: 'Permission Audit', description: 'Last audit completed 7 days ago' },
  { status: 'info' as const, title: 'Access Requests', description: '3 pending access requests' },
];

export const PermissionManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Permission Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage permissions and access control</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
