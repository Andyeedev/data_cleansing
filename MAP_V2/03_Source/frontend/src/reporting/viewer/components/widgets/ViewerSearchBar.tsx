import React from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useReportViewer } from '../../ReportViewerContext';

export const ViewerSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, searchResults, highlightMatches, setHighlightMatches } = useReportViewer();

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-50" />
        <input
          type="text"
          placeholder="Search in report..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 py-1.5 text-sm border border-neutral-30 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Search in report"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-50 hover:text-neutral-70"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {searchQuery && (
        <>
          <span className="text-xs text-neutral-50 whitespace-nowrap">
            {searchResults.count > 0
              ? `${searchResults.currentMatch} of ${searchResults.count}`
              : 'No results'}
          </span>
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
          <label className="flex items-center gap-1 text-xs text-neutral-60 cursor-pointer">
            <input
              type="checkbox"
              checked={highlightMatches}
              onChange={(e) => setHighlightMatches(e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            Highlight
          </label>
        </>
      )}
    </div>
  );
};
