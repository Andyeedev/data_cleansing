import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'job-1', type: 'status', title: 'Scheduled Jobs', size: 'lg' },
  { id: 'job-2', type: 'status', title: 'Running Jobs', size: 'lg' },
  { id: 'job-3', type: 'status', title: 'Failed Jobs', size: 'lg' },
  { id: 'job-4', type: 'status', title: 'Retry Queue', size: 'lg' },
  { id: 'job-5', type: 'timeline', title: 'Job History', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Scheduled Jobs', description: '34 jobs scheduled and running on time' },
  { status: 'success' as const, title: 'Running Jobs', description: '5 jobs currently executing' },
  { status: 'warning' as const, title: 'Failed Jobs', description: '2 jobs failed in last 24 hours' },
  { status: 'info' as const, title: 'Retry Queue', description: '3 jobs in retry queue' },
  { title: 'Job History', description: 'Job execution history for last 7 days' },
];

export const JobScheduler = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Job Scheduler</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage scheduled jobs and task queues</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
