import type { WidgetDefinition, WidgetCategory } from '../types/WidgetTypes';
import type { ComponentType } from 'react';

// Card Widgets
import { KPIWidget } from '../cards/KPIWidget';
import { StatusWidget } from '../cards/StatusWidget';
import { MetricWidget } from '../cards/MetricWidget';

// Chart Widgets
import { BarChartWidget } from '../charts/BarChartWidget';
import { LineChartWidget } from '../charts/LineChartWidget';
import { PieChartWidget } from '../charts/PieChartWidget';
import { AreaChartWidget } from '../charts/AreaChartWidget';
import { GaugeWidget } from '../charts/GaugeWidget';

// Table Widgets
import { GridWidget } from '../tables/GridWidget';
import { SummaryTableWidget } from '../tables/SummaryTableWidget';

// Report Widgets
import { HtmlReportWidget } from '../reports/HtmlReportWidget';
import { AuditReportWidget } from '../reports/AuditReportWidget';

// AI Widgets
import { AISummaryWidget } from '../ai/AISummaryWidget';
import { AIInsightWidget } from '../ai/AIInsightWidget';
import { AIRecommendationWidget } from '../ai/AIRecommendationWidget';

// System Widgets
import { NotificationWidget } from '../system/NotificationWidget';
import { TaskWidget } from '../system/TaskWidget';
import { TimelineWidget } from '../system/TimelineWidget';

class WidgetRegistryClass {
  private registry: Map<string, WidgetDefinition> = new Map();

  register(definition: WidgetDefinition): void {
    this.registry.set(definition.id, definition);
  }

  unregister(id: string): void {
    this.registry.delete(id);
  }

  get(id: string): WidgetDefinition | undefined {
    return this.registry.get(id);
  }

  getByCategory(category: WidgetCategory): WidgetDefinition[] {
    return Array.from(this.registry.values()).filter(
      (def) => def.category === category
    );
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.registry.values());
  }

  getComponent(id: string): ComponentType | undefined {
    const definition = this.registry.get(id);
    return definition?.component as ComponentType | undefined;
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  getAllIds(): string[] {
    return Array.from(this.registry.keys());
  }

  clear(): void {
    this.registry.clear();
  }
}

// Singleton instance
export const WidgetRegistry = new WidgetRegistryClass();

// Register all built-in widgets
const registerBuiltinWidgets = () => {
  // Card Widgets
  WidgetRegistry.register({
    id: 'kpi',
    name: 'KPI Card',
    type: 'kpi',
    category: 'cards',
    component: KPIWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Key Performance Indicator card with value, delta, and trend',
    defaultSize: 'md',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'status',
    name: 'Status Card',
    type: 'status',
    category: 'cards',
    component: StatusWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Status indicator card',
    defaultSize: 'sm',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'metric',
    name: 'Metric Card',
    type: 'metric',
    category: 'cards',
    component: MetricWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Metric display card',
    defaultSize: 'md',
    enabled: true,
  });

  // Chart Widgets
  WidgetRegistry.register({
    id: 'bar-chart',
    name: 'Bar Chart',
    type: 'bar-chart',
    category: 'charts',
    component: BarChartWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Bar chart widget',
    defaultSize: 'lg',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'line-chart',
    name: 'Line Chart',
    type: 'line-chart',
    category: 'charts',
    component: LineChartWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Line chart widget',
    defaultSize: 'lg',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'pie-chart',
    name: 'Pie Chart',
    type: 'pie-chart',
    category: 'charts',
    component: PieChartWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Pie chart widget',
    defaultSize: 'md',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'area-chart',
    name: 'Area Chart',
    type: 'area-chart',
    category: 'charts',
    component: AreaChartWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Area chart widget',
    defaultSize: 'lg',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'gauge',
    name: 'Gauge',
    type: 'gauge',
    category: 'charts',
    component: GaugeWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Gauge chart widget',
    defaultSize: 'md',
    enabled: true,
  });

  // Table Widgets
  WidgetRegistry.register({
    id: 'grid',
    name: 'Data Grid',
    type: 'grid',
    category: 'tables',
    component: GridWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Data grid table widget',
    defaultSize: 'full',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'summary-table',
    name: 'Summary Table',
    type: 'summary-table',
    category: 'tables',
    component: SummaryTableWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Summary table widget',
    defaultSize: 'lg',
    enabled: true,
  });

  // Report Widgets
  WidgetRegistry.register({
    id: 'html-report',
    name: 'HTML Report',
    type: 'html-report',
    category: 'reports',
    component: HtmlReportWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'HTML report widget',
    defaultSize: 'full',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'audit-report',
    name: 'Audit Report',
    type: 'audit-report',
    category: 'reports',
    component: AuditReportWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Audit report widget',
    defaultSize: 'full',
    enabled: true,
  });

  // AI Widgets
  WidgetRegistry.register({
    id: 'ai-summary',
    name: 'AI Summary',
    type: 'ai-summary',
    category: 'ai',
    component: AISummaryWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'AI-generated summary',
    defaultSize: 'lg',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'ai-insight',
    name: 'AI Insight',
    type: 'ai-insight',
    category: 'ai',
    component: AIInsightWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'AI insights panel',
    defaultSize: 'lg',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'ai-recommendation',
    name: 'AI Recommendation',
    type: 'ai-recommendation',
    category: 'ai',
    component: AIRecommendationWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'AI recommendations panel',
    defaultSize: 'lg',
    enabled: true,
  });

  // System Widgets
  WidgetRegistry.register({
    id: 'notification',
    name: 'Notifications',
    type: 'notification',
    category: 'system',
    component: NotificationWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Notification panel',
    defaultSize: 'md',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'task',
    name: 'Tasks',
    type: 'task',
    category: 'system',
    component: TaskWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Task list widget',
    defaultSize: 'md',
    enabled: true,
  });

  WidgetRegistry.register({
    id: 'timeline',
    name: 'Timeline',
    type: 'timeline',
    category: 'system',
    component: TimelineWidget as unknown as ComponentType<import('../types/WidgetTypes').WidgetProps>,
    description: 'Activity timeline',
    defaultSize: 'md',
    enabled: true,
  });
};

// Auto-register on import
registerBuiltinWidgets();
