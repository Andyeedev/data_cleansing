import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'role-1', type: 'status', title: 'Roles', size: 'lg' },
  { id: 'role-2', type: 'status', title: 'Role Templates', size: 'lg' },
  { id: 'role-3', type: 'status', title: 'Role Assignment', size: 'lg' },
  { id: 'role-4', type: 'status', title: 'Role Hierarchy', size: 'lg' },
  { id: 'role-5', type: 'status', title: 'Role Usage', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Roles', description: '24 roles configured across the platform' },
  { status: 'success' as const, title: 'Role Templates', description: '8 system templates, 6 custom templates' },
  { status: 'success' as const, title: 'Role Assignment', description: 'All users assigned appropriate roles' },
  { status: 'success' as const, title: 'Role Hierarchy', description: 'Role hierarchy properly configured' },
  { status: 'success' as const, title: 'Role Usage', description: 'Role utilisation within expected ranges' },
];

export const RoleManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Role Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage roles and role-based access control</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
