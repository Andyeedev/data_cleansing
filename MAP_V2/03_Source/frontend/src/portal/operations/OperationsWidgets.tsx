import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { PortalRegistry } from '../registry/PortalRegistry';

export const buildOperationsWidgetConfigs = (): WidgetConfig[] => {
  const portal = PortalRegistry.get('operations');
  if (!portal) return [];

  return portal.widgets.map((widget) => ({
    id: widget.id,
    type: widget.type,
    title: widget.title,
    size: widget.size || 'md',
    config: widget.config,
  }));
};

export const getOperationsWidgetConfig = (widgetId: string): WidgetConfig | undefined => {
  const configs = buildOperationsWidgetConfigs();
  return configs.find((c) => c.id === widgetId);
};
