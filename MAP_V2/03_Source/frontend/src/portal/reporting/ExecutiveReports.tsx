import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'exec-rpt-1', type: 'status', title: 'Executive Dashboard Report', size: 'lg' },
  { id: 'exec-rpt-2', type: 'status', title: 'Migration Health Report', size: 'lg' },
  { id: 'exec-rpt-3', type: 'status', title: 'Portfolio Summary', size: 'lg' },
  { id: 'exec-rpt-4', type: 'status', title: 'KPI Report', size: 'lg' },
  { id: 'exec-rpt-5', type: 'status', title: 'Board Pack', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Executive Dashboard Report', description: 'Comprehensive executive overview with key metrics and trends' },
  { status: 'success' as const, title: 'Migration Health Report', description: 'Real-time migration health scores and performance indicators' },
  { status: 'success' as const, title: 'Portfolio Summary', description: 'End-of-period portfolio performance summary' },
  { status: 'success' as const, title: 'KPI Report', description: 'Key performance indicators across all migration projects' },
  { status: 'info' as const, title: 'Board Pack', description: 'Board-level summary report generated quarterly' },
];

export const ExecutiveReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Executive Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">High-level executive and board reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
