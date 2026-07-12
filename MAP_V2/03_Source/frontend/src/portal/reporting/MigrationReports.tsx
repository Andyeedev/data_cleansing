import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'mig-rpt-1', type: 'status', title: 'Migration Progress', size: 'lg' },
  { id: 'mig-rpt-2', type: 'status', title: 'Dataset Status', size: 'lg' },
  { id: 'mig-rpt-3', type: 'status', title: 'Completion Report', size: 'lg' },
  { id: 'mig-rpt-4', type: 'status', title: 'Migration Summary', size: 'lg' },
  { id: 'mig-rpt-5', type: 'status', title: 'Migration Metrics', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Migration Progress', description: 'Overall migration progress across all projects' },
  { status: 'success' as const, title: 'Dataset Status', description: 'Dataset migration status and completion percentages' },
  { status: 'success' as const, title: 'Completion Report', description: 'Detailed completion analysis for finished migrations' },
  { status: 'success' as const, title: 'Migration Summary', description: 'Executive summary of migration activities' },
  { status: 'info' as const, title: 'Migration Metrics', description: 'Key metrics and performance indicators for migrations' },
];

export const MigrationReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Migration Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Data migration reporting and analytics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
