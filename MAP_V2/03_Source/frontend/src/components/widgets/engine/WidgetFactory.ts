import type { ComponentType } from 'react';
import type { WidgetConfig, WidgetDefinition } from '../types/WidgetTypes';
import { WidgetRegistry } from '../registry/WidgetRegistry';

export class WidgetFactory {
  /**
   * Create a widget component from configuration
   */
  static create(config: WidgetConfig): ComponentType | null {
    const definition = WidgetRegistry.get(config.type);

    if (!definition) {
      console.warn(`Widget type "${config.type}" not found in registry`);
      return null;
    }

    if (!definition.enabled) {
      console.warn(`Widget type "${config.type}" is disabled`);
      return null;
    }

    return definition.component as ComponentType;
  }

  /**
   * Create multiple widgets from an array of configs
   */
  static createMany(configs: WidgetConfig[]): Array<{ config: WidgetConfig; component: ComponentType | null }> {
    return configs.map((config) => ({
      config,
      component: WidgetFactory.create(config),
    }));
  }

  /**
   * Get widget definition
   */
  static getDefinition(type: string): WidgetDefinition | undefined {
    return WidgetRegistry.get(type);
  }

  /**
   * Check if widget type is available
   */
  static isAvailable(type: string): boolean {
    return WidgetRegistry.has(type);
  }

  /**
   * Get all available widget types
   */
  static getAvailableTypes(): string[] {
    return WidgetRegistry.getAllIds();
  }

  /**
   * Get widgets by category
   */
  static getByCategory(category: string): WidgetDefinition[] {
    return WidgetRegistry.getByCategory(category as WidgetDefinition['category']);
  }

  /**
   * Merge default config with provided config
   */
  static mergeConfig(type: string, userConfig: Partial<WidgetConfig>): WidgetConfig {
    const definition = WidgetRegistry.get(type);

    const defaultConfig: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      size: definition?.defaultSize || 'md',
      ...definition?.defaultConfig,
    };

    return {
      ...defaultConfig,
      ...userConfig,
      config: {
        ...definition?.defaultConfig,
        ...userConfig.config,
      },
    };
  }
}
