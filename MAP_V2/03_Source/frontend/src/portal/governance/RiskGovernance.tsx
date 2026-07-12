import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const riskWidgets: WidgetConfig[] = [
  { id: 'risk-enterprise', type: 'chart', title: 'Enterprise Risk', size: 'lg' },
  { id: 'risk-migration', type: 'chart', title: 'Migration Risk', size: 'lg' },
  { id: 'risk-operational', type: 'chart', title: 'Operational Risk', size: 'lg' },
  { id: 'risk-register', type: 'grid', title: 'Risk Register', size: 'lg' },
  { id: 'risk-trends', type: 'chart', title: 'Risk Trends', size: 'lg' },
];

export const RiskGovernance = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Risk Governance</h1>
        <p className="text-sm text-neutral-60 mt-1">Enterprise risk management and oversight</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
