import { useReportScheduler } from './hooks/useReportScheduler';
import { TimelineWidget } from '../../components/widgets/system/TimelineWidget';

export const ScheduleHistory = () => {
  const { schedules, logs } = useReportScheduler();

  const historyItems = schedules.map((s) => ({
    id: s.id,
    reportName: s.reportName,
    lastRun: s.lastRun,
    frequency: s.frequency,
    status: s.status,
    owner: s.owner,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Schedule History</h1>
        <p className="text-neutral-60">Execution history, runtime, status, errors and audit trail</p>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Last Execution</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Frequency</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Owner</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr key={item.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{item.reportName}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{item.lastRun}</td>
                <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{item.frequency}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.status === 'active' ? 'bg-success-100 text-success-700' :
                    item.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                    'bg-neutral-200 text-neutral-60'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-60">{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-4">
        <h2 className="font-medium text-neutral-100 mb-4">Audit Trail</h2>
        <TimelineWidget
          config={{ id: 'audit', type: 'timeline', title: 'Execution Audit Trail', size: 'full' }}
          state="success"
          data={{
            items: logs.map((log) => ({
              id: log.id,
              title: log.scheduleName,
              description: log.message,
              timestamp: log.timestamp,
              type: log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'info',
            })),
          }}
        />
      </div>
    </div>
  );
};
