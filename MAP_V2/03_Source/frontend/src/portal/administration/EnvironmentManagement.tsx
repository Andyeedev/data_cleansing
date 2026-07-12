import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'env-1', type: 'status', title: 'Development', size: 'lg' },
  { id: 'env-2', type: 'status', title: 'Test', size: 'lg' },
  { id: 'env-3', type: 'status', title: 'UAT', size: 'lg' },
  { id: 'env-4', type: 'status', title: 'Production', size: 'lg' },
  { id: 'env-5', type: 'status', title: 'Environment Configuration', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Development', description: 'Dev environment healthy, 2 services updating' },
  { status: 'success' as const, title: 'Test', description: 'Test environment stable' },
  { status: 'success' as const, title: 'UAT', description: 'UAT environment ready for testing' },
  { status: 'success' as const, title: 'Production', description: 'Production environment healthy' },
  { status: 'success' as const, title: 'Environment Configuration', description: 'All environment configs synchronized' },
];

export const EnvironmentManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Environment Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage platform environments</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
