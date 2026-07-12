import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'cfg-1', type: 'status', title: 'Global Configuration', size: 'lg' },
  { id: 'cfg-2', type: 'status', title: 'Regional Settings', size: 'lg' },
  { id: 'cfg-3', type: 'status', title: 'Branding', size: 'lg' },
  { id: 'cfg-4', type: 'status', title: 'Default Preferences', size: 'lg' },
  { id: 'cfg-5', type: 'status', title: 'Platform Options', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Global Configuration', description: 'All global settings validated' },
  { status: 'success' as const, title: 'Regional Settings', description: '5 regions configured' },
  { status: 'success' as const, title: 'Branding', description: 'Custom branding applied' },
  { status: 'success' as const, title: 'Default Preferences', description: 'Default preferences set for all tenants' },
  { status: 'success' as const, title: 'Platform Options', description: 'Platform options configured' },
];

export const PlatformConfiguration = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Platform Configuration</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage global platform settings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
