import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const complianceWidgets: WidgetConfig[] = [
  { id: 'comp-dash', type: 'status', title: 'Compliance Dashboard', size: 'full' },
  { id: 'comp-status', type: 'status', title: 'Regulatory Status', size: 'lg' },
  { id: 'comp-standards', type: 'status', title: 'Standards Compliance', size: 'lg' },
  { id: 'comp-trends', type: 'chart', title: 'Compliance Trends', size: 'lg' },
  { id: 'comp-actions', type: 'status', title: 'Outstanding Actions', size: 'lg' },
];

export const Compliance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Compliance</h1>
        <p className="text-sm text-neutral-60 mt-1">Monitor regulatory and internal compliance requirements</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
