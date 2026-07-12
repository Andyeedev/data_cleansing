import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'sys-1', type: 'status', title: 'General Settings', size: 'lg' },
  { id: 'sys-2', type: 'status', title: 'Security Settings', size: 'lg' },
  { id: 'sys-3', type: 'status', title: 'Email Settings', size: 'lg' },
  { id: 'sys-4', type: 'status', title: 'Logging Settings', size: 'lg' },
  { id: 'sys-5', type: 'status', title: 'Integration Settings', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'General Settings', description: 'General platform settings configured' },
  { status: 'success' as const, title: 'Security Settings', description: 'Security settings enforced' },
  { status: 'success' as const, title: 'Email Settings', description: 'Email service configured and tested' },
  { status: 'success' as const, title: 'Logging Settings', description: 'Logging levels configured' },
  { status: 'success' as const, title: 'Integration Settings', description: '5 integrations active' },
];

export const SystemSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">System Settings</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage system-wide settings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
