import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { PortalRegistry } from '../registry/PortalRegistry';

export const buildExecutiveWidgetConfigs = (): WidgetConfig[] => {
  const portal = PortalRegistry.get('executive');
  if (!portal) return [];

  return portal.widgets.map((widget) => ({
    id: widget.id,
    type: widget.type,
    title: widget.title,
    size: widget.size || 'md',
    config: widget.config,
  }));
};

export const getExecutiveWidgetConfig = (widgetId: string): WidgetConfig | undefined => {
  const configs = buildExecutiveWidgetConfigs();
  return configs.find((c) => c.id === widgetId);
};
