import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const exceptionWidgets: WidgetConfig[] = [
  { id: 'exc-open', type: 'status', title: 'Open Exceptions', size: 'lg' },
  { id: 'exc-approved', type: 'status', title: 'Approved Exceptions', size: 'lg' },
  { id: 'exc-workflow', type: 'timeline', title: 'Exception Workflow', size: 'lg' },
  { id: 'exc-history', type: 'timeline', title: 'Exception History', size: 'lg' },
  { id: 'exc-resolution', type: 'status', title: 'Exception Resolution', size: 'lg' },
];

export const Exceptions = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Exceptions</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage policy and control exceptions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exceptionWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
