import { Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { TimelineWidget } from '../../components/widgets/system/TimelineWidget';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleTimeline = () => {
  const { schedules, queue } = useReportScheduler();

  const pastExecutions = schedules
    .filter((s) => s.lastRun)
    .map((s) => ({
      id: `past-${s.id}`,
      title: s.reportName,
      description: `Last executed: ${s.lastRun}`,
      timestamp: s.lastRun,
      type: 'info' as const,
    }));

  const currentJobs = queue
    .filter((q) => q.status === 'running')
    .map((q) => ({
      id: q.id,
      title: q.reportName,
      description: `Progress: ${q.progress}%`,
      timestamp: q.startedAt || '',
      type: 'info' as const,
    }));

  const futureSchedules = schedules
    .filter((s) => s.status === 'active')
    .map((s) => ({
      id: `future-${s.id}`,
      title: s.reportName,
      description: `Next run: ${s.frequency} at ${s.time}`,
      timestamp: s.startDate,
      type: 'info' as const,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Schedule Timeline</h1>
        <p className="text-neutral-60">Timeline view of past, current and future schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <h2 className="font-medium text-neutral-100">Past Executions</h2>
          </div>
          <div className="space-y-3">
            {pastExecutions.length === 0 ? (
              <p className="text-sm text-neutral-50">No past executions</p>
            ) : (
              pastExecutions.map((item) => (
                <div key={item.id} className="p-3 bg-neutral-5 rounded-lg border-l-4 border-success-500">
                  <div className="font-medium text-neutral-100 text-sm">{item.title}</div>
                  <div className="text-xs text-neutral-60">{item.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium text-neutral-100">Current Jobs</h2>
          </div>
          <div className="space-y-3">
            {currentJobs.length === 0 ? (
              <p className="text-sm text-neutral-50">No jobs currently running</p>
            ) : (
              currentJobs.map((item) => (
                <div key={item.id} className="p-3 bg-neutral-5 rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium text-neutral-100 text-sm">{item.title}</div>
                  <div className="text-xs text-neutral-60">{item.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <h2 className="font-medium text-neutral-100">Future Schedules</h2>
          </div>
          <div className="space-y-3">
            {futureSchedules.length === 0 ? (
              <p className="text-sm text-neutral-50">No future schedules</p>
            ) : (
              futureSchedules.map((item) => (
                <div key={item.id} className="p-3 bg-neutral-5 rounded-lg border-l-4 border-purple-500">
                  <div className="font-medium text-neutral-100 text-sm">{item.title}</div>
                  <div className="text-xs text-neutral-60">{item.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-4">
        <h2 className="font-medium text-neutral-100 mb-4">Activity Timeline</h2>
        <TimelineWidget
          config={{ id: 'timeline', type: 'timeline', title: 'Schedule Activity', size: 'full' }}
          state="success"
          data={{
            items: [...pastExecutions.slice(0, 3), ...currentJobs, ...futureSchedules.slice(0, 3)].sort(
              (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
            ),
          }}
        />
      </div>
    </div>
  );
};
