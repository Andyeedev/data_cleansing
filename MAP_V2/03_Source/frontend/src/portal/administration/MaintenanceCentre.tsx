import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'mnt-1', type: 'status', title: 'Maintenance Windows', size: 'lg' },
  { id: 'mnt-2', type: 'status', title: 'Scheduled Downtime', size: 'lg' },
  { id: 'mnt-3', type: 'status', title: 'Backup Status', size: 'lg' },
  { id: 'mnt-4', type: 'status', title: 'Upgrade Planning', size: 'lg' },
  { id: 'mnt-5', type: 'timeline', title: 'Maintenance History', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Maintenance Windows', description: 'No maintenance windows scheduled' },
  { status: 'success' as const, title: 'Scheduled Downtime', description: 'No downtime scheduled' },
  { status: 'success' as const, title: 'Backup Status', description: 'Last backup completed 2 hours ago' },
  { status: 'info' as const, title: 'Upgrade Planning', description: 'v2.5.0 upgrade planned for next week' },
  { title: 'Maintenance History', description: 'Recent maintenance activities' },
];

export const MaintenanceCentre = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Maintenance Centre</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage maintenance windows and backups</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
