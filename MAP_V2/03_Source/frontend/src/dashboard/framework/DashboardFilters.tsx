import { ChevronDown } from 'lucide-react';
import type { DashboardFiltersProps } from './dashboard.types';

export const DashboardFilters = ({
  filters,
  onFilterChange,
  className = '',
}: DashboardFiltersProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          {filter.type === 'dropdown' && (
            <div className="relative">
              <select
                value={filter.value as string}
                onChange={(e) => onFilterChange(filter.id, e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">{filter.placeholder || filter.label}</option>
                {filter.options?.map((option) => (
                  <option key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-60 pointer-events-none" />
            </div>
          )}

          {filter.type === 'search' && (
            <input
              type="text"
              placeholder={filter.placeholder || filter.label}
              value={filter.value as string}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              className="pl-3 pr-3 py-2 text-sm border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
            />
          )}

          {filter.type === 'checkbox' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.value as boolean}
                onChange={(e) => onFilterChange(filter.id, e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-100">{filter.label}</span>
            </label>
          )}

          {filter.type === 'toggle' && (
            <button
              onClick={() => onFilterChange(filter.id, !filter.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                filter.value ? 'bg-primary-500' : 'bg-neutral-30'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  filter.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
