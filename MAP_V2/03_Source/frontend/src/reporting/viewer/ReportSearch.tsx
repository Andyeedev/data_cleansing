import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

export const ReportSearch = () => {
  const { searchQuery, setSearchQuery, searchResults, highlightMatches, setHighlightMatches } = useReportViewer();

  return (
    <ViewerSidebarPanel title="Search">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-50" />
          <input
            type="text"
            placeholder="Search in report..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-neutral-30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Search in report"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-50 hover:text-neutral-70"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between text-sm text-neutral-60">
            <span>
              {searchResults.count > 0
                ? `${searchResults.currentMatch} of ${searchResults.count}`
                : 'No results'}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1 text-neutral-50 hover:text-neutral-70 disabled:opacity-50"
                disabled={searchResults.count === 0}
                aria-label="Previous match"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-neutral-50 hover:text-neutral-70 disabled:opacity-50"
                disabled={searchResults.count === 0}
                aria-label="Next match"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-neutral-70 cursor-pointer">
          <input
            type="checkbox"
            checked={highlightMatches}
            onChange={(e) => setHighlightMatches(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Highlight matches
        </label>
      </div>
    </ViewerSidebarPanel>
  );
};
