import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { WidgetErrorProps } from '../types/WidgetProps';

export const WidgetError = ({
  error,
  onRetry,
  className = '',
}: WidgetErrorProps) => {
  return (
    <div className={`flex items-center justify-center h-full min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="p-3 bg-error-50 rounded-full">
          <AlertTriangle className="w-6 h-6 text-error-500" />
        </div>
        <p className="text-sm text-error-500 font-medium">Failed to load</p>
        <p className="text-xs text-neutral-60 max-w-[200px]">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
