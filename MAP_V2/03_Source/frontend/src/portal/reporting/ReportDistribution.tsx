import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'dist-1', type: 'status', title: 'Email Distribution', size: 'lg' },
  { id: 'dist-2', type: 'grid', title: 'Download Centre', size: 'lg' },
  { id: 'dist-3', type: 'status', title: 'Secure Sharing', size: 'lg' },
  { id: 'dist-4', type: 'timeline', title: 'Distribution History', size: 'lg' },
  { id: 'dist-5', type: 'grid', title: 'Recipient Management', size: 'lg' },
];

export const ReportDistribution = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Distribution</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage report distribution and delivery</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
