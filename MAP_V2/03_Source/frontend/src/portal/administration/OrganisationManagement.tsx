import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'org-1', type: 'status', title: 'Organisations', size: 'lg' },
  { id: 'org-2', type: 'status', title: 'Business Units', size: 'lg' },
  { id: 'org-3', type: 'status', title: 'Departments', size: 'lg' },
  { id: 'org-4', type: 'status', title: 'Projects', size: 'lg' },
  { id: 'org-5', type: 'status', title: 'Organisation Health', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Organisations', description: '42 organisations registered' },
  { status: 'success' as const, title: 'Business Units', description: '28 business units active' },
  { status: 'success' as const, title: 'Departments', description: '85 departments configured' },
  { status: 'success' as const, title: 'Projects', description: '124 projects across all departments' },
  { status: 'success' as const, title: 'Organisation Health', description: 'All organisations operating normally' },
];

export const OrganisationManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Organisation Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage organisational structure and business units</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
