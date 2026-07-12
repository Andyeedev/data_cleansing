import { useReportCentre } from './hooks/useReportCentre';

export const ScheduledReports = () => {
  const { schedules } = useReportCentre();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Scheduled Reports</h1>
        <p className="text-neutral-60">Reports scheduled for automatic generation</p>
      </div>
      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Frequency</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Next Run</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Last Run</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Recipients</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{schedule.reportName}</td>
                <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{schedule.frequency}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{schedule.nextRun}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{schedule.lastRun}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${schedule.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-neutral-200 text-neutral-60'}`}>
                    {schedule.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-60">{schedule.recipients.length} recipients</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
