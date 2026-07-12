import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const reportWidgets: WidgetConfig[] = [
  { id: 'reg-compliance', type: 'report', title: 'Compliance Reports', size: 'lg' },
  { id: 'reg-audit', type: 'report', title: 'Audit Reports', size: 'lg' },
  { id: 'reg-governance', type: 'report', title: 'Governance Reports', size: 'lg' },
  { id: 'reg-executive', type: 'report', title: 'Executive Governance Summary', size: 'lg' },
  { id: 'reg-submission', type: 'report', title: 'Regulatory Submission Pack', size: 'lg' },
];

export const RegulatoryReporting = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Regulatory Reporting</h1>
        <p className="text-sm text-neutral-60 mt-1">Generate and manage regulatory reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
