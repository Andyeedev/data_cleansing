import { User } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

export const MyReports = () => {
  const { allReports } = useReportCentre();
  const myReports = allReports.filter((r) => r.owner === 'John Smith');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">My Reports</h1>
        <p className="text-neutral-60">Reports you own or have created</p>
      </div>
      {myReports.length === 0 ? (
        <div className="text-center py-12 text-neutral-50">
          <User className="w-12 h-12 mx-auto mb-4 text-neutral-30" />
          <p>You don't own any reports yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myReports.map((report) => (
            <div key={report.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-neutral-100 mb-2">{report.name}</h3>
              <p className="text-sm text-neutral-60 mb-3">{report.description}</p>
              <div className="flex items-center justify-between text-xs text-neutral-50">
                <span className="capitalize">{report.category}</span>
                <span>{report.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
