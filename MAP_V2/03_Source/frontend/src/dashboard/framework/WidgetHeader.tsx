import { RefreshCw, Download } from 'lucide-react';
import type { WidgetHeaderProps } from './dashboard.types';

export const WidgetHeader = ({
  title,
  subtitle,
  actions,
  onRefresh,
  onExport,
}: WidgetHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-30">
      <div>
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
        {subtitle && (
          <p className="text-xs text-neutral-60 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-neutral-20 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-neutral-60" />
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="p-1.5 hover:bg-neutral-20 rounded-md transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4 text-neutral-60" />
          </button>
        )}
      </div>
    </div>
  );
};
