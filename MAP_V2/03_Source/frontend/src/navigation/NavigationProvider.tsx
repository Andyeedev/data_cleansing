import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationContext } from './NavigationContext';
import type { NavigationState, BreadcrumbItem } from './navigation.types';
import { findNavigationItemByPath, getParentItem } from './navigation.config';

interface NavigationProviderProps {
  children: React.ReactNode;
}

const initialState: NavigationState = {
  currentPage: '/',
  selectedMenu: null,
  breadcrumbs: [],
  sidebarExpanded: true,
  mobileDrawerOpen: false,
  searchOpen: false,
  notificationOpen: false,
};

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [state, setState] = useState<NavigationState>(initialState);
  const location = useLocation();

  const setCurrentPage = useCallback((page: string) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setSelectedMenu = useCallback((menu: string | null) => {
    setState((prev) => ({ ...prev, selectedMenu: menu }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarExpanded: !prev.sidebarExpanded }));
  }, []);

  const setSidebarExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({ ...prev, sidebarExpanded: expanded }));
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setState((prev) => ({ ...prev, mobileDrawerOpen: !prev.mobileDrawerOpen }));
  }, []);

  const setMobileDrawerOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, mobileDrawerOpen: open }));
  }, []);

  const toggleSearch = useCallback(() => {
    setState((prev) => ({ ...prev, searchOpen: !prev.searchOpen, notificationOpen: false }));
  }, []);

  const setSearchOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, searchOpen: open, notificationOpen: false }));
  }, []);

  const toggleNotification = useCallback(() => {
    setState((prev) => ({ ...prev, notificationOpen: !prev.notificationOpen, searchOpen: false }));
  }, []);

  const setNotificationOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, notificationOpen: open, searchOpen: false }));
  }, []);

  const updateBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    setState((prev) => ({ ...prev, breadcrumbs: items }));
  }, []);

  // Auto-generate breadcrumbs from location
  useEffect(() => {
    const path = location.pathname;
    setCurrentPage(path);

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    if (path !== '/') {
      const item = findNavigationItemByPath(path);
      const parent = getParentItem(path);

      if (parent) {
        breadcrumbs.push({
          label: parent.label,
          path: parent.path,
        });
      }

      if (item && item.path !== parent?.path) {
        breadcrumbs.push({
          label: item.label,
        });
      }
    }

    updateBreadcrumbs(breadcrumbs);
  }, [location.pathname, setCurrentPage, updateBreadcrumbs]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname, setMobileDrawerOpen]);

  // Close drawers on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setSearchOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [setMobileDrawerOpen, setSearchOpen, setNotificationOpen]);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        setCurrentPage,
        setSelectedMenu,
        toggleSidebar,
        setSidebarExpanded,
        toggleMobileDrawer,
        setMobileDrawerOpen,
        toggleSearch,
        setSearchOpen,
        toggleNotification,
        setNotificationOpen,
        updateBreadcrumbs,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
