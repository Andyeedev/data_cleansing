import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const controlWidgets: WidgetConfig[] = [
  { id: 'ctrl-cat', type: 'grid', title: 'Control Catalogue', size: 'lg' },
  { id: 'ctrl-active', type: 'status', title: 'Active Controls', size: 'lg' },
  { id: 'ctrl-perf', type: 'chart', title: 'Control Performance', size: 'lg' },
  { id: 'ctrl-failed', type: 'status', title: 'Failed Controls', size: 'lg' },
  { id: 'ctrl-coverage', type: 'chart', title: 'Control Coverage', size: 'lg' },
];

export const Controls = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Controls</h1>
        <p className="text-sm text-neutral-60 mt-1">Monitor control effectiveness and coverage</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {controlWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
