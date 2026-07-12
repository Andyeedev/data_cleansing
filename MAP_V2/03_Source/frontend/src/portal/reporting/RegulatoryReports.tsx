import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'reg-rpt-1', type: 'status', title: 'Regulatory Submission', size: 'lg' },
  { id: 'reg-rpt-2', type: 'status', title: 'Compliance Filing', size: 'lg' },
  { id: 'reg-rpt-3', type: 'status', title: 'Data Governance Report', size: 'lg' },
  { id: 'reg-rpt-4', type: 'status', title: 'Risk Report', size: 'lg' },
  { id: 'reg-rpt-5', type: 'status', title: 'Regulatory Dashboard', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Regulatory Submission', description: 'Regulatory submission status and deadlines' },
  { status: 'success' as const, title: 'Compliance Filing', description: 'Compliance filing history and upcoming deadlines' },
  { status: 'success' as const, title: 'Data Governance Report', description: 'Data governance metrics and compliance' },
  { status: 'warning' as const, title: 'Risk Report', description: 'Regulatory risk assessment and mitigation status' },
  { status: 'success' as const, title: 'Regulatory Dashboard', description: 'Real-time regulatory compliance dashboard' },
];

export const RegulatoryReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Regulatory Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Regulatory compliance and submission reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
