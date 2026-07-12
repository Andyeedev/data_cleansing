import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'aud-rpt-1', type: 'status', title: 'Audit Pack', size: 'lg' },
  { id: 'aud-rpt-2', type: 'status', title: 'Audit Evidence', size: 'lg' },
  { id: 'aud-rpt-3', type: 'timeline', title: 'Audit Timeline', size: 'lg' },
  { id: 'aud-rpt-4', type: 'status', title: 'Audit Findings', size: 'lg' },
  { id: 'aud-rpt-5', type: 'status', title: 'Audit History', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Audit Pack', description: 'Complete audit documentation package' },
  { status: 'success' as const, title: 'Audit Evidence', description: 'Supporting evidence for audit findings' },
  { title: 'Audit Timeline', description: 'Chronological view of audit activities and milestones' },
  { status: 'warning' as const, title: 'Audit Findings', description: 'Summary of audit findings and recommendations' },
  { status: 'success' as const, title: 'Audit History', description: 'Historical audit results and trends' },
];

export const AuditReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Audit Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Internal and external audit reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
