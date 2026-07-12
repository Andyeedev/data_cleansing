import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'gov-rpt-1', type: 'status', title: 'Compliance Report', size: 'lg' },
  { id: 'gov-rpt-2', type: 'status', title: 'Governance Summary', size: 'lg' },
  { id: 'gov-rpt-3', type: 'status', title: 'Policy Compliance', size: 'lg' },
  { id: 'gov-rpt-4', type: 'status', title: 'Control Effectiveness', size: 'lg' },
  { id: 'gov-rpt-5', type: 'status', title: 'Governance KPI', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Compliance Report', description: 'Regulatory and internal compliance status' },
  { status: 'success' as const, title: 'Governance Summary', description: 'Executive summary of governance posture' },
  { status: 'success' as const, title: 'Policy Compliance', description: 'Policy adherence and compliance rates' },
  { status: 'success' as const, title: 'Control Effectiveness', description: 'Analysis of control effectiveness and coverage' },
  { status: 'info' as const, title: 'Governance KPI', description: 'Key governance performance indicators' },
];

export const GovernanceReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Governance Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Governance and compliance reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
