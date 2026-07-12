import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'sched-1', type: 'status', title: 'Scheduled Jobs', size: 'lg' },
  { id: 'sched-2', type: 'status', title: 'Upcoming Reports', size: 'lg' },
  { id: 'sched-3', type: 'status', title: 'Completed Reports', size: 'lg' },
  { id: 'sched-4', type: 'status', title: 'Failed Reports', size: 'lg' },
  { id: 'sched-5', type: 'timeline', title: 'Schedule Calendar', size: 'lg' },
];

export const ScheduledReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduled Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage scheduled report execution</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
