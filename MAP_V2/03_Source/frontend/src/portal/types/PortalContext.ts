import type { PortalDefinition, PortalMetadata } from './PortalDefinition';
import type { User } from '../../authentication/types/auth.types';

export interface PortalContextValue {
  currentPortal: PortalDefinition | null;
  currentPortalId: string | null;
  user: User | null;
  tenantId: string | null;
  role: string | null;
  permissions: string[];
  theme: 'light' | 'dark' | 'auto';
  notificationCount: number;
  currentRoute: string;
  isLoading: boolean;
  error: string | null;

  setCurrentPortal: (portalId: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setNotificationCount: (count: number) => void;
  refreshPortal: () => void;
}

export interface PortalNavigationContextValue {
  activePortalId: string | null;
  recentPortals: string[];
  favouritePortals: string[];
  sidebarExpanded: boolean;

  navigateToPortal: (portalId: string) => void;
  addToFavourites: (portalId: string) => void;
  removeFromFavourites: (portalId: string) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export interface PortalPermissionsContextValue {
  canAccessPortal: (portalId: string) => boolean;
  canAccessWidget: (widgetId: string) => boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasFeatureFlag: (flag: string) => boolean;
  isReadOnly: boolean;
}

export interface PortalState {
  currentPortal: PortalDefinition | null;
  portals: PortalMetadata[];
  isLoading: boolean;
  error: string | null;
}
