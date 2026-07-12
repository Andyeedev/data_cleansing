import { Star } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

export const FavouriteReports = () => {
  const { allReports, toggleFavourite } = useReportCentre();
  const favourites = allReports.filter((r) => r.isFavourite);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Favourite Reports</h1>
        <p className="text-neutral-60">Your bookmarked reports</p>
      </div>
      {favourites.length === 0 ? (
        <div className="text-center py-12 text-neutral-50">
          <Star className="w-12 h-12 mx-auto mb-4 text-neutral-30" />
          <p>No favourite reports yet. Star a report to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map((report) => (
            <div key={report.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-neutral-100">{report.name}</h3>
                <button onClick={() => toggleFavourite(report.id)} className="text-warning-500">
                  <Star className="w-4 h-4 fill-warning-500" />
                </button>
              </div>
              <p className="text-sm text-neutral-60 mb-3">{report.description}</p>
              <div className="flex items-center justify-between text-xs text-neutral-50">
                <span className="capitalize">{report.category}</span>
                <span>{report.owner}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
