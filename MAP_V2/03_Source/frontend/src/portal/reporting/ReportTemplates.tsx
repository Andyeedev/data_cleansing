import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'tpl-1', type: 'grid', title: 'Standard Templates', size: 'lg' },
  { id: 'tpl-2', type: 'grid', title: 'Executive Templates', size: 'lg' },
  { id: 'tpl-3', type: 'grid', title: 'Audit Templates', size: 'lg' },
  { id: 'tpl-4', type: 'grid', title: 'Governance Templates', size: 'lg' },
  { id: 'tpl-5', type: 'grid', title: 'Custom Templates', size: 'lg' },
];

export const ReportTemplates = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Templates</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage and create report templates</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
