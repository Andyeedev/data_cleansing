import { X } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';
import type { ReportCategory, ReportStatus } from './types/ReportCentreTypes';

export const ReportFilters = () => {
  const { filters, setFilters } = useReportCentre();

  const categories: { value: ReportCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'executive', label: 'Executive' },
    { value: 'migration', label: 'Migration' },
    { value: 'validation', label: 'Validation' },
    { value: 'governance', label: 'Governance' },
    { value: 'risk', label: 'Risk' },
    { value: 'security', label: 'Security' },
    { value: 'administration', label: 'Administration' },
    { value: 'audit', label: 'Audit' },
    { value: 'ai', label: 'AI' },
  ];

  const statuses: { value: ReportStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'generating', label: 'Generating' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  const hasActiveFilters = filters.category !== 'all' || filters.status !== 'all' || filters.isFavourite || filters.isScheduled;

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      owner: '',
      dateFrom: '',
      dateTo: '',
      isFavourite: false,
      isScheduled: false,
      tags: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Report Filters</h1>
          <p className="text-neutral-60">Filter and refine your report search</p>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="bg-white border border-neutral-20 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-70 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as ReportCategory | 'all' })}
              className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-70 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as ReportStatus | 'all' })}
              className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-70 mb-2">Owner</label>
            <input
              type="text"
              placeholder="Filter by owner..."
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-70 mb-2">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-70 mb-2">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isFavourite}
              onChange={(e) => setFilters({ ...filters, isFavourite: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-neutral-70">Favourites Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isScheduled}
              onChange={(e) => setFilters({ ...filters, isScheduled: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-neutral-70">Scheduled Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
