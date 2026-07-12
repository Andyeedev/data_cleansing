import { RefreshCw } from 'lucide-react';
import type { WidgetHeaderProps } from '../types/WidgetProps';

export const WidgetHeader = ({
  title,
  subtitle,
  icon,
  actions,
  onRefresh,
  onAction,
  className = '',
}: WidgetHeaderProps) => {
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-b border-neutral-30 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-neutral-60">{icon}</div>}
        <div>
          <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
          {subtitle && (
            <p className="text-xs text-neutral-60 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {actions?.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            disabled={action.disabled}
            className="p-1.5 hover:bg-neutral-20 rounded-md transition-colors disabled:opacity-50"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 hover:bg-neutral-20 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-neutral-60" />
          </button>
        )}
      </div>
    </div>
  );
};
