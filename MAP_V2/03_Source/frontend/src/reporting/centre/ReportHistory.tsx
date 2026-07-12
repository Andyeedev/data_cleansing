import { Download, Share2, FileText, CheckCircle } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  generated: FileText,
  downloaded: Download,
  shared: Share2,
  exported: CheckCircle,
};

export const ReportHistory = () => {
  const { history } = useReportCentre();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report History</h1>
        <p className="text-neutral-60">History of report generation, downloads and sharing</p>
      </div>
      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Report</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Action</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Timestamp</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Format</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const Icon = actionIcons[entry.action] ?? FileText;
              return (
                <tr key={entry.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                  <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{entry.reportName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-60">
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{entry.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{entry.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{entry.user}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60 uppercase">{entry.format ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
