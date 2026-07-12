import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'lic-1', type: 'status', title: 'Licence Allocation', size: 'lg' },
  { id: 'lic-2', type: 'status', title: 'Licence Usage', size: 'lg' },
  { id: 'lic-3', type: 'status', title: 'Available Licences', size: 'lg' },
  { id: 'lic-4', type: 'status', title: 'Expiring Licences', size: 'lg' },
  { id: 'lic-5', type: 'status', title: 'Consumption Dashboard', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Licence Allocation', description: '1,500 licences allocated, 1,247 in use' },
  { status: 'success' as const, title: 'Licence Usage', description: '82.3% licence utilisation rate' },
  { status: 'success' as const, title: 'Available Licences', description: '253 licences available for allocation' },
  { status: 'warning' as const, title: 'Expiring Licences', description: '3 licences expiring within 30 days' },
  { status: 'success' as const, title: 'Consumption Dashboard', description: 'Licence consumption within budget' },
];

export const Licensing = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Licensing</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage platform licences and allocations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
