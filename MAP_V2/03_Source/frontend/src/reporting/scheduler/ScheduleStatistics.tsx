import { TrendingUp, TrendingDown, Clock, BarChart3, Activity, Zap } from 'lucide-react';
import { KPIWidget } from '../../components/widgets/cards/KPIWidget';
import { BarChartWidget } from '../../components/widgets/charts/BarChartWidget';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleStatistics = () => {
  const { metrics } = useReportScheduler();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduler Statistics</h1>
        <p className="text-neutral-60">Performance metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPIWidget
          config={{ id: 'success', type: 'kpi', title: 'Success Rate', size: 'md' }}
          state="success"
          data={{ value: `${metrics.successRate}%`, label: 'Success Rate', delta: 2.1, trend: 'up', icon: <TrendingUp className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'failure', type: 'kpi', title: 'Failure Rate', size: 'md' }}
          state="success"
          data={{ value: `${metrics.failureRate}%`, label: 'Failure Rate', delta: -0.5, trend: 'down', icon: <TrendingDown className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'runtime', type: 'kpi', title: 'Average Runtime', size: 'md' }}
          state="success"
          data={{ value: `${metrics.averageRuntime}s`, label: 'Avg Runtime', icon: <Clock className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'queue', type: 'kpi', title: 'Queue Length', size: 'md' }}
          state="success"
          data={{ value: metrics.queueSize, label: 'Queue Length', icon: <BarChart3 className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'peak', type: 'kpi', title: 'Peak Hours', size: 'md' }}
          state="success"
          data={{ value: metrics.peakHours, label: 'Peak Hours', icon: <Activity className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'usage', type: 'kpi', title: 'Widget Usage', size: 'md' }}
          state="success"
          data={{ value: metrics.totalScheduled, label: 'Active Schedules', icon: <Zap className="w-5 h-5" /> }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <h2 className="font-medium text-neutral-100 mb-4">Executions by Hour</h2>
          <BarChartWidget
            config={{ id: 'hourly', type: 'bar-chart', title: 'Executions by Hour', size: 'lg' }}
            state="success"
            data={{
              labels: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
              datasets: [{
                label: 'Executions',
                data: [2, 3, 5, 4, 3, 2, 1, 1, 2],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
              }],
            }}
          />
        </div>
        <div className="bg-white border border-neutral-20 rounded-lg p-4">
          <h2 className="font-medium text-neutral-100 mb-4">Executions by Frequency</h2>
          <BarChartWidget
            config={{ id: 'frequency', type: 'bar-chart', title: 'By Frequency', size: 'lg' }}
            state="success"
            data={{
              labels: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'],
              datasets: [{
                label: 'Schedules',
                data: [4, 2, 2, 1, 1],
                backgroundColor: [
                  'rgba(59, 130, 246, 0.5)',
                  'rgba(139, 92, 246, 0.5)',
                  'rgba(34, 197, 94, 0.5)',
                  'rgba(249, 115, 22, 0.5)',
                  'rgba(239, 68, 68, 0.5)',
                ],
                borderColor: [
                  'rgba(59, 130, 246, 1)',
                  'rgba(139, 92, 246, 1)',
                  'rgba(34, 197, 94, 1)',
                  'rgba(249, 115, 22, 1)',
                  'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
              }],
            }}
          />
        </div>
      </div>
    </div>
  );
};
