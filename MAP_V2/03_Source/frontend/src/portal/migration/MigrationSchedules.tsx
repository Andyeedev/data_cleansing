import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const schedules = [
  { id: 's1', name: 'Nightly Customer Sync', cron: '0 2 * * *', nextRun: 'Tonight 02:00', status: 'active', type: 'recurring' },
  { id: 's2', name: 'Weekly Transaction Batch', cron: '0 6 * * 1', nextRun: 'Monday 06:00', status: 'active', type: 'recurring' },
  { id: 's3', name: 'Monthly Compliance Report', cron: '0 8 1 * *', nextRun: '1st Aug 08:00', status: 'active', type: 'recurring' },
  { id: 's4', name: 'Ad-hoc: Product Catalog', cron: '-', nextRun: 'Scheduled', status: 'queued', type: 'one-time' },
];

const statusStyles = {
  active: 'bg-success-50 text-success-500',
  queued: 'bg-warning-50 text-warning-500',
  paused: 'bg-neutral-20 text-neutral-60',
  failed: 'bg-error-50 text-error-500',
};

export const MigrationSchedules = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Migration Schedules</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
          New Schedule
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'sched-active', label: 'Active Schedules', value: 12 },
          { id: 'sched-recurring', label: 'Recurring', value: 8 },
          { id: 'sched-upcoming', label: 'Upcoming', value: 6 },
          { id: 'sched-completed', label: 'Completed Today', value: 4 },
        ].map((kpi) => (
          <WidgetRenderer
            key={kpi.id}
            config={{ id: kpi.id, type: 'kpi', title: kpi.label, size: 'md' } as WidgetConfig}
            data={{ value: kpi.value, label: kpi.label }}
          />
        ))}
      </div>

      <div className="bg-white border border-neutral-30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-30">
          <h3 className="text-sm font-semibold text-neutral-100">Scheduled Jobs</h3>
        </div>
        <div className="divide-y divide-neutral-30">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-100">{schedule.name}</p>
                <p className="text-xs text-neutral-60">Cron: {schedule.cron} | Next: {schedule.nextRun}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-20 text-neutral-60">
                {schedule.type}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[schedule.status as keyof typeof statusStyles]}`}>
                {schedule.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
