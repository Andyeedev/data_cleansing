import { Star } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

export const RecentReports = () => {
  const { allReports, toggleFavourite } = useReportCentre();
  const recentReports = allReports.filter((r) => r.lastGenerated).sort((a, b) => (b.lastGenerated ?? '').localeCompare(a.lastGenerated ?? ''));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Recent Reports</h1>
        <p className="text-neutral-60">Recently generated reports</p>
      </div>
      <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-5 border-b border-neutral-20">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Last Generated</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Owner</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Favourite</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((report) => (
              <tr key={report.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{report.name}</td>
                <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{report.category}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{report.lastGenerated}</td>
                <td className="px-4 py-3 text-sm text-neutral-60">{report.owner}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFavourite(report.id)} className="text-neutral-40 hover:text-warning-500">
                    <Star className={`w-4 h-4 ${report.isFavourite ? 'fill-warning-500 text-warning-500' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
