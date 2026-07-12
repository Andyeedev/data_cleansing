import { RefreshCw, Download, Printer, Filter, Calendar, Search, Bot, HelpCircle } from 'lucide-react';
import type { DashboardToolbarProps } from './dashboard.types';

export const DashboardToolbar = ({
  onRefresh,
  onExport,
  onPrint,
  onFilter,
  onDateRange,
  onSearch,
  onAIAssistant,
  onHelp,
  className = '',
}: DashboardToolbarProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      )}

      {onExport && (
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      )}

      {onPrint && (
        <button
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Print</span>
        </button>
      )}

      {onFilter && (
        <button
          onClick={onFilter}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      )}

      {onDateRange && (
        <button
          onClick={onDateRange}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Date Range</span>
        </button>
      )}

      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-60" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
          />
        </div>
      )}

      <div className="flex-1" />

      {onAIAssistant && (
        <button
          onClick={onAIAssistant}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-primary-500 hover:text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      )}

      {onHelp && (
        <button
          onClick={onHelp}
          className="p-2 text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 rounded-lg transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
