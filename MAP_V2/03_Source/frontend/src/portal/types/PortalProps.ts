import type { ReactNode } from 'react';
import type { PortalDefinition, PortalConfig } from './PortalDefinition';

export interface PortalShellProps {
  portal: PortalDefinition;
  children: ReactNode;
  config?: Partial<PortalConfig>;
  className?: string;
}

export interface PortalRendererProps {
  portalId: string;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

export interface PortalHeaderProps {
  portal: PortalDefinition;
  onMenuToggle?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  className?: string;
}

export interface PortalContentProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export interface PortalFooterProps {
  portal?: PortalDefinition;
  className?: string;
}

export interface PortalBreadcrumbProps {
  portal: PortalDefinition;
  items?: PortalBreadcrumbItem[];
  className?: string;
}

export interface PortalBreadcrumbItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface PortalLayoutProps {
  portal: PortalDefinition;
  children: ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumb?: boolean;
}

export interface PortalLoaderProps {
  message?: string;
  portal?: PortalDefinition;
}

export interface PortalErrorProps {
  error: string;
  portal?: PortalDefinition;
  onRetry?: () => void;
  onNavigateHome?: () => void;
}
