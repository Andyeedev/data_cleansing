import type { LucideIcon } from 'lucide-react';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

export type PortalCategory =
  | 'executive'
  | 'operations'
  | 'migration'
  | 'governance'
  | 'reporting'
  | 'security'
  | 'administration'
  | 'ai';

export type PortalStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated';

export interface PortalDefinition {
  id: string;
  name: string;
  description: string;
  icon: string | LucideIcon;
  category: PortalCategory;
  route: string;
  defaultRoute?: string;
  version: string;
  owner: string;
  enabled: boolean;
  status: PortalStatus;
  roles: string[];
  permissions: string[];
  featureFlags?: string[];
  subscriptionRequired?: string;
  theme?: 'light' | 'dark' | 'auto';
  navigationGroup?: string;
  widgets: PortalWidgetConfig[];
  navigation?: PortalNavigationItem[];
  metadata?: Record<string, unknown>;
}

export interface PortalWidgetConfig {
  id: string;
  type: string;
  title?: string;
  size?: WidgetConfig['size'];
  position?: {
    section: string;
    order: number;
  };
  config?: Record<string, unknown>;
  permissions?: string[];
  roles?: string[];
}

export interface PortalNavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string | LucideIcon;
  badge?: {
    count?: number;
    text?: string;
    variant: 'default' | 'primary' | 'success' | 'warning' | 'error';
  };
  children?: PortalNavigationItem[];
  visible?: boolean;
}

export interface PortalMetadata {
  definition: PortalDefinition;
  registeredAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
  accessCount: number;
}

export interface PortalConfig {
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumb?: boolean;
  showStatusBar?: boolean;
  showEnvironmentBanner?: boolean;
  maxContentWidth?: string;
  customStyles?: Record<string, string>;
}
