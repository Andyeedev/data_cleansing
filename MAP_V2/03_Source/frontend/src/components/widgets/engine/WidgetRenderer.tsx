import { useState, useCallback, useEffect, type ComponentType } from 'react';
import type { WidgetConfig, WidgetState } from '../types/WidgetTypes';
import { WidgetFactory } from './WidgetFactory';
import { Widget } from '../base/Widget';
import { WidgetLoader } from '../base/WidgetLoader';
import { WidgetError } from '../base/WidgetError';

interface WidgetRendererProps {
  config: WidgetConfig;
  data?: unknown;
  onRefresh?: () => void;
  onAction?: (actionId: string) => void;
  className?: string;
}

export const WidgetRenderer = ({
  config,
  data,
  onRefresh,
  onAction,
  className = '',
}: WidgetRendererProps) => {
  const [state, setState] = useState<WidgetState>('idle');
  const [error, setError] = useState<string | null>(null);

  const WidgetComponent: ComponentType | null = WidgetFactory.create(config);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setState('loading');
    setError(null);
    onRefresh?.();
  }, [onRefresh]);

  // Handle action
  const handleAction = useCallback(
    (actionId: string) => {
      onAction?.(actionId);
    },
    [onAction]
  );

  // Update state based on data
  useEffect(() => {
    if (data === undefined) {
      setState('idle');
    } else if (data === null) {
      setState('empty');
    } else if (typeof data === 'object' && Array.isArray(data) && data.length === 0) {
      setState('empty');
    } else {
      setState('success');
    }
  }, [data]);

  // Auto-refresh interval
  useEffect(() => {
    if (!config.refreshInterval) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.refreshInterval, handleRefresh]);

  if (!WidgetComponent) {
    return (
      <Widget
        config={config}
        state="error"
        error={`Widget type "${config.type}" not found`}
        className={className}
      >
        <WidgetError
          error={`Widget type "${config.type}" not available`}
          onRetry={handleRefresh}
        />
      </Widget>
    );
  }

  return (
    <Widget
      config={config}
      state={state}
      error={error}
      actions={config.actions}
      onRefresh={handleRefresh}
      onAction={handleAction}
      className={className}
    >
      {state === 'loading' ? (
        <WidgetLoader />
      ) : state === 'error' && error ? (
        <WidgetError error={error} onRetry={handleRefresh} />
      ) : (
        <WidgetComponent
          {...({
            config,
            state,
            data,
            error,
            onRefresh: handleRefresh,
            onAction: handleAction,
          } as React.ComponentPropsWithoutRef<typeof WidgetComponent>)}
        />
      )}
    </Widget>
  );
};

/**
 * Render multiple widgets from config array
 */
export const WidgetRendererList = ({
  widgets,
  className = '',
}: {
  widgets: Array<{ config: WidgetConfig; data?: unknown }>;
  className?: string;
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ${className}`}>
      {widgets.map((widget) => (
        <WidgetRenderer
          key={widget.config.id}
          config={widget.config}
          data={widget.data}
        />
      ))}
    </div>
  );
};
