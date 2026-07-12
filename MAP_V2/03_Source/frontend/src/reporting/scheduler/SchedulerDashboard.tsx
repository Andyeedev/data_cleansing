import { Calendar, Clock, AlertTriangle, Activity, TrendingUp, Zap } from 'lucide-react';
import { KPIWidget } from '../../components/widgets/cards/KPIWidget';
import { StatusWidget } from '../../components/widgets/cards/StatusWidget';
import { AISummaryWidget } from '../../components/widgets/ai/AISummaryWidget';
import { useReportScheduler } from './hooks/useReportScheduler';

export const SchedulerDashboard = () => {
  const { metrics } = useReportScheduler();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduler Dashboard</h1>
        <p className="text-neutral-60">Overview of scheduled report automation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPIWidget
          config={{ id: 'scheduled', type: 'kpi', title: 'Scheduled Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.totalScheduled, label: 'Scheduled Reports', icon: <Calendar className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'running', type: 'kpi', title: 'Running Jobs', size: 'md' }}
          state="success"
          data={{ value: metrics.runningJobs, label: 'Running Jobs', icon: <Activity className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'next', type: 'kpi', title: 'Next Executions', size: 'md' }}
          state="success"
          data={{ value: metrics.nextExecutions, label: 'Next Executions', icon: <Clock className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'failed', type: 'kpi', title: 'Failed Schedules', size: 'md' }}
          state="success"
          data={{ value: metrics.failedSchedules, label: 'Failed Schedules', icon: <AlertTriangle className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'queue', type: 'kpi', title: 'Queue Size', size: 'md' }}
          state="success"
          data={{ value: metrics.queueSize, label: 'Queue Size', icon: <TrendingUp className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'health', type: 'kpi', title: 'Scheduler Health', size: 'md' }}
          state="success"
          data={{ value: `${metrics.healthScore}%`, label: 'Health Score', icon: <Zap className="w-5 h-5" /> }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AISummaryWidget
          config={{ id: 'ai-rec', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' }}
          state="success"
          data={{
            summary: 'Scheduler health is optimal. Consider unpause the Security Audit Report schedule. The daily Audit Trail Report is performing well with consistent execution times.',
            recommendations: [
              'Unpause Security Audit Report schedule',
              'Review failed Security Audit Report delivery',
              'Optimize Audit Trail Report runtime',
            ],
          }}
        />
        <StatusWidget
          config={{ id: 'status', type: 'status', title: 'Scheduler Status', size: 'lg' }}
          state="success"
          data={{
            status: 'success',
            title: 'Scheduler Operational',
            description: `${metrics.totalScheduled} schedules active. ${metrics.runningJobs} jobs currently running. Next execution in 2 hours.`,
          }}
        />
      </div>
    </div>
  );
};
