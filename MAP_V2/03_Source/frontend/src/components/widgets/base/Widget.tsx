import type { ReactNode } from 'react';
import { WidgetHeader } from './WidgetHeader';
import { WidgetFooter } from './WidgetFooter';
import { WidgetLoader } from './WidgetLoader';
import { WidgetError } from './WidgetError';
import type { WidgetConfig, WidgetState, WidgetAction } from '../types/WidgetTypes';

const sizeClasses = {
  sm: 'col-span-1',
  md: 'col-span-1 sm:col-span-2',
  lg: 'col-span-1 sm:col-span-2 lg:col-span-3',
  xl: 'col-span-1 sm:col-span-2 lg:col-span-4',
  full: 'col-span-1 sm:col-span-2 lg:col-span-6',
};

interface WidgetProps {
  config: WidgetConfig;
  state?: WidgetState;
  error?: string | null;
  actions?: WidgetAction[];
  onRefresh?: () => void;
  onAction?: (actionId: string) => void;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Widget = ({
  config,
  state = 'idle',
  error,
  actions,
  onRefresh,
  onAction,
  footer,
  children,
  className = '',
}: WidgetProps) => {
  return (
    <div
      className={`bg-white border border-neutral-30 rounded-xl overflow-hidden ${sizeClasses[config.size || 'md']} ${className}`}
      style={{
        height: config.height,
        width: config.width,
      }}
      data-widget-id={config.id}
      data-widget-type={config.type}
    >
      <WidgetHeader
        title={config.title || ''}
        subtitle={config.subtitle}
        icon={config.icon}
        actions={actions}
        onRefresh={onRefresh}
        onAction={onAction}
      />

      <div className="relative min-h-[200px]">
        {state === 'loading' && <WidgetLoader />}
        {state === 'error' && error && (
          <WidgetError error={error} onRetry={onRefresh} />
        )}
        {state === 'empty' && (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-sm text-neutral-60">No data available</p>
          </div>
        )}
        {state === 'offline' && (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-sm text-warning-500">Offline</p>
          </div>
        )}
        {state === 'idle' && children}
        {state === 'success' && children}
      </div>

      {footer && <WidgetFooter>{footer}</WidgetFooter>}
    </div>
  );
};
