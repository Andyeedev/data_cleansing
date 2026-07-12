import { useState } from 'react';
import { Search, X } from 'lucide-react';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <div className="flex items-center bg-neutral-20 rounded-lg px-3 py-2 w-96">
        <Search className="w-4 h-4 text-neutral-60 mr-2" />
        <input
          type="text"
          placeholder="Search pages, reports, projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent outline-none text-sm w-full text-neutral-100 placeholder-neutral-60"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 hover:bg-neutral-30 rounded-md transition-colors"
          >
            <X className="w-3 h-3 text-neutral-60" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-30 rounded-xl shadow-lg z-50 max-h-80 overflow-auto">
            <div className="p-4">
              <p className="text-sm text-neutral-60 mb-3">
                Search results for "{query}"
              </p>
              <div className="space-y-2">
                <div className="p-3 hover:bg-neutral-20 rounded-lg cursor-pointer transition-colors">
                  <p className="text-sm font-medium text-neutral-100">Dashboard</p>
                  <p className="text-xs text-neutral-60">Executive Dashboard</p>
                </div>
                <div className="p-3 hover:bg-neutral-20 rounded-lg cursor-pointer transition-colors">
                  <p className="text-sm font-medium text-neutral-100">Migration Jobs</p>
                  <p className="text-xs text-neutral-60">View all migration jobs</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
