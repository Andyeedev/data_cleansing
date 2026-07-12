import { useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

export const ReportSearch = () => {
  const { allReports } = useReportCentre();
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = [...new Set(allReports.flatMap((r) => r.tags))];

  const filteredReports = allReports.filter((report) => {
    const matchesQuery = !query || report.name.toLowerCase().includes(query.toLowerCase()) || report.description.toLowerCase().includes(query.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => report.tags.includes(tag));
    return matchesQuery && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Search</h1>
        <p className="text-neutral-60">Search across all reports</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-50" />
        <input
          type="text"
          placeholder="Search by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-neutral-30 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-70 mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-70 hover:bg-neutral-20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-neutral-50">{filteredReports.length} results found</div>

      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-neutral-100">{report.name}</h3>
                <p className="text-sm text-neutral-60 mt-1">{report.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {report.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-neutral-100 rounded text-xs text-neutral-60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-neutral-50 capitalize">{report.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
