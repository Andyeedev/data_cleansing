import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'ops-rpt-1', type: 'status', title: 'Daily Operations', size: 'lg' },
  { id: 'ops-rpt-2', type: 'status', title: 'Validation Status', size: 'lg' },
  { id: 'ops-rpt-3', type: 'status', title: 'Execution Summary', size: 'lg' },
  { id: 'ops-rpt-4', type: 'status', title: 'Exception Summary', size: 'lg' },
  { id: 'ops-rpt-5', type: 'status', title: 'Operational Dashboard Report', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Daily Operations', description: 'Daily operational metrics and activity summary' },
  { status: 'success' as const, title: 'Validation Status', description: 'Current validation run status and completion rates' },
  { status: 'success' as const, title: 'Execution Summary', description: 'Summary of all execution runs and outcomes' },
  { status: 'warning' as const, title: 'Exception Summary', description: 'Overview of open and resolved exceptions' },
  { status: 'success' as const, title: 'Operational Dashboard Report', description: 'Comprehensive operational dashboard with all KPIs' },
];

export const OperationalReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Operational Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Day-to-day operations reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
