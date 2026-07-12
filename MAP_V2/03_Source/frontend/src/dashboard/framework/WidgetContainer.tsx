import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { WidgetHeader } from './WidgetHeader';
import { WidgetFooter } from './WidgetFooter';
import type { WidgetContainerProps } from './dashboard.types';

const sizeClasses = {
  sm: 'col-span-1',
  md: 'col-span-1 sm:col-span-2',
  lg: 'col-span-1 sm:col-span-2 lg:col-span-3',
  xl: 'col-span-1 sm:col-span-2 lg:col-span-4',
  full: 'col-span-1 sm:col-span-2 lg:col-span-6',
};

export const WidgetContainer = ({
  id,
  title,
  subtitle,
  size = 'md',
  status = 'idle',
  refreshable = true,
  exportable = false,
  onRefresh,
  onExport,
  headerActions,
  footer,
  children,
  className = '',
}: WidgetContainerProps) => {
  return (
    <div
      className={`bg-white border border-neutral-30 rounded-xl overflow-hidden ${sizeClasses[size]} ${className}`}
      data-widget-id={id}
    >
      <WidgetHeader
        title={title}
        subtitle={subtitle}
        actions={headerActions}
        onRefresh={refreshable ? onRefresh : undefined}
        onExport={exportable ? onExport : undefined}
      />

      <div className="relative min-h-[200px]">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <LoadingSpinner size="md" />
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-error-500">Failed to load data</p>
              <button
                onClick={onRefresh}
                className="mt-2 text-sm text-primary-500 hover:text-primary-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {status === 'empty' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-neutral-60">No data available</p>
          </div>
        )}

        {status === 'idle' && children}
      </div>

      {footer && <WidgetFooter>{footer}</WidgetFooter>}
    </div>
  );
};
