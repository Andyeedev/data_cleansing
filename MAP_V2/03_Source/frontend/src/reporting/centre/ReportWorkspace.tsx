import { useState } from 'react';
import { Search, Grid, List, Download, Share2, Star, Eye } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

export const ReportWorkspace = () => {
  const { reports, toggleFavourite } = useReportCentre();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Workspace</h1>
        <p className="text-neutral-60">Browse, preview, organise and export reports</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-50" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-50 hover:bg-neutral-10'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-50 hover:bg-neutral-10'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-neutral-100">{report.name}</h3>
                <button onClick={() => toggleFavourite(report.id)}>
                  <Star className={`w-4 h-4 ${report.isFavourite ? 'fill-warning-500 text-warning-500' : 'text-neutral-300'}`} />
                </button>
              </div>
              <p className="text-sm text-neutral-60 mb-3">{report.description}</p>
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary-500 text-white rounded text-xs font-medium hover:bg-primary-600">
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button className="p-1.5 border border-neutral-30 rounded text-neutral-50 hover:bg-neutral-50">
                  <Download className="w-3 h-3" />
                </button>
                <button className="p-1.5 border border-neutral-30 rounded text-neutral-50 hover:bg-neutral-50">
                  <Share2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-20 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-5 border-b border-neutral-20">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-neutral-70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-neutral-10 hover:bg-neutral-5">
                  <td className="px-4 py-3 text-sm text-neutral-100 font-medium">{report.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60 capitalize">{report.category}</td>
                  <td className="px-4 py-3 text-sm text-neutral-60">{report.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-neutral-50 hover:text-primary-600"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 text-neutral-50 hover:text-primary-600"><Download className="w-4 h-4" /></button>
                      <button className="p-1 text-neutral-50 hover:text-primary-600"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
