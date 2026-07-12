import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'ff-1', type: 'status', title: 'Enabled Features', size: 'lg' },
  { id: 'ff-2', type: 'status', title: 'Preview Features', size: 'lg' },
  { id: 'ff-3', type: 'status', title: 'Experimental Features', size: 'lg' },
  { id: 'ff-4', type: 'status', title: 'Tenant Overrides', size: 'lg' },
  { id: 'ff-5', type: 'status', title: 'Rollout Status', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Enabled Features', description: '45 features enabled in production' },
  { status: 'info' as const, title: 'Preview Features', description: '8 features in preview mode' },
  { status: 'info' as const, title: 'Experimental Features', description: '3 features in experimental phase' },
  { status: 'success' as const, title: 'Tenant Overrides', description: '12 tenant-specific feature overrides' },
  { status: 'success' as const, title: 'Rollout Status', description: 'All rollouts proceeding as planned' },
];

export const FeatureFlags = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Feature Flags</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage feature flags and rollouts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
