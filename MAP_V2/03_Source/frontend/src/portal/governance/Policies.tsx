import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const policyWidgets: WidgetConfig[] = [
  { id: 'pol-gov', type: 'status', title: 'Governance Policies', size: 'lg' },
  { id: 'pol-lib', type: 'grid', title: 'Policy Library', size: 'lg' },
  { id: 'pol-status', type: 'status', title: 'Policy Status', size: 'lg' },
  { id: 'pol-reviews', type: 'status', title: 'Policy Reviews', size: 'lg' },
  { id: 'pol-approvals', type: 'status', title: 'Policy Approvals', size: 'lg' },
];

export const Policies = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Policies</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage and track governance policies</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policyWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
