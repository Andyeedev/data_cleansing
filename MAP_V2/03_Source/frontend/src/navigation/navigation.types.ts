import type { LucideIcon } from 'lucide-react';

export interface NavigationBadge {
  count?: number;
  text?: string;
  variant: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export interface NavigationPermission {
  roles: string[];
  requireAll?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string | LucideIcon;
  permission?: NavigationPermission;
  visible?: boolean;
  badge?: NavigationBadge;
  description?: string;
  children?: NavigationItem[];
  divider?: boolean;
}

export interface NavigationGroup {
  id: string;
  label?: string;
  items: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label?: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  sections: NavigationSection[];
  settings: NavigationSettings;
}

export interface NavigationSettings {
  sidebarCollapsedWidth: string;
  sidebarExpandedWidth: string;
  headerHeight: string;
  footerHeight: string;
  mobileDrawerWidth: string;
}

export interface NavigationState {
  currentPage: string;
  selectedMenu: string | null;
  breadcrumbs: BreadcrumbItem[];
  sidebarExpanded: boolean;
  mobileDrawerOpen: boolean;
  searchOpen: boolean;
  notificationOpen: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string | LucideIcon;
}

export interface NavigationContextType extends NavigationState {
  setCurrentPage: (page: string) => void;
  setSelectedMenu: (menu: string | null) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleNotification: () => void;
  setNotificationOpen: (open: boolean) => void;
  updateBreadcrumbs: (items: BreadcrumbItem[]) => void;
}
