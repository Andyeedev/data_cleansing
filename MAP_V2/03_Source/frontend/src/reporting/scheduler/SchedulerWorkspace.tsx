import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { KPIWidget } from '../../components/widgets/cards/KPIWidget';
import { StatusWidget } from '../../components/widgets/cards/StatusWidget';
import { useReportScheduler } from './hooks/useReportScheduler';

export const SchedulerWorkspace = () => {
  const { metrics, schedules, queue } = useReportScheduler();

  const activeSchedules = schedules.filter((s) => s.status === 'active');
  const recentQueue = queue.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduler Workspace</h1>
        <p className="text-neutral-60">Quick overview and actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget
          config={{ id: 'active', type: 'kpi', title: 'Active Schedules', size: 'md' }}
          state="success"
          data={{ value: activeSchedules.length, label: 'Active Schedules', icon: <Calendar className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'queue', type: 'kpi', title: 'In Queue', size: 'md' }}
          state="success"
          data={{ value: metrics.queueSize, label: 'In Queue', icon: <Clock className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'health', type: 'kpi', title: 'Health', size: 'md' }}
          state="success"
          data={{ value: `${metrics.healthScore}%`, label: 'Health Score', icon: <CheckCircle className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'failed', type: 'kpi', title: 'Failed', size: 'md' }}
          state="success"
          data={{ value: metrics.failedSchedules, label: 'Failed', icon: <AlertTriangle className="w-5 h-5" /> }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <h2 className="font-medium text-neutral-100 mb-4">Active Schedules</h2>
          <div className="space-y-3">
            {activeSchedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-neutral-5 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-100 text-sm">{s.reportName}</div>
                  <div className="text-xs text-neutral-60 capitalize">{s.frequency} at {s.time}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <h2 className="font-medium text-neutral-100 mb-4">Recent Queue Activity</h2>
          <div className="space-y-3">
            {recentQueue.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-3 bg-neutral-5 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-100 text-sm">{q.reportName}</div>
                  <div className="text-xs text-neutral-60">{q.startedAt}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                  q.status === 'running' ? 'bg-blue-100 text-blue-700' :
                  q.status === 'completed' ? 'bg-success-100 text-success-700' :
                  q.status === 'failed' ? 'bg-danger-100 text-danger-700' :
                  'bg-neutral-200 text-neutral-60'
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-4">
        <StatusWidget
          config={{ id: 'status', type: 'status', title: 'System Status', size: 'full' }}
          state="success"
          data={{
            status: 'success',
            title: 'Scheduler Operational',
            description: `${activeSchedules.length} schedules active. ${metrics.runningJobs} jobs running. All systems nominal.`,
          }}
        />
      </div>
    </div>
  );
};
