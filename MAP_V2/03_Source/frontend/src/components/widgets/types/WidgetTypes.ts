import type { ComponentType, ReactNode } from 'react';

// Widget Categories
export type WidgetCategory = 'cards' | 'charts' | 'tables' | 'reports' | 'ai' | 'system' | 'custom';

// Widget Sizes
export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Widget States
export type WidgetState = 'idle' | 'loading' | 'success' | 'error' | 'empty' | 'offline';

// Widget Variants
export type WidgetVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

// Widget Definition (metadata for registry)
export interface WidgetDefinition {
  id: string;
  name: string;
  type: string;
  category: WidgetCategory;
  icon?: string;
  component: ComponentType<WidgetProps>;
  description?: string;
  roles?: string[];
  permissions?: string[];
  datasource?: string;
  refreshInterval?: number;
  defaultSize: WidgetSize;
  defaultConfig?: Record<string, unknown>;
  enabled: boolean;
}

// Widget Configuration (instance config)
export interface WidgetConfig {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  size?: WidgetSize;
  variant?: WidgetVariant;
  icon?: ReactNode;
  height?: number | string;
  width?: number | string;
  refreshInterval?: number;
  datasource?: string;
  permissions?: string[];
  roles?: string[];
  config?: Record<string, unknown>;
  actions?: WidgetAction[];
  responsive?: WidgetResponsive;
}

// Widget Action
export interface WidgetAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// Widget Responsive Config
export interface WidgetResponsive {
  sm?: Partial<WidgetConfig>;
  md?: Partial<WidgetConfig>;
  lg?: Partial<WidgetConfig>;
  xl?: Partial<WidgetConfig>;
}

// Widget Props (base interface for all widgets)
export interface WidgetProps {
  config: WidgetConfig;
  state?: WidgetState;
  data?: unknown;
  error?: string | null;
  onRefresh?: () => void;
  onAction?: (actionId: string) => void;
  children?: ReactNode;
  className?: string;
}

// Widget Registry Entry
export interface WidgetRegistryEntry {
  definition: WidgetDefinition;
  registeredAt: Date;
}

// Widget Event
export interface WidgetEvent {
  type: 'refresh' | 'action' | 'state-change' | 'error';
  widgetId: string;
  payload?: unknown;
  timestamp: Date;
}

// Widget Metadata (for dashboard rendering)
export interface WidgetMetadata {
  id: string;
  type: string;
  config: WidgetConfig;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
