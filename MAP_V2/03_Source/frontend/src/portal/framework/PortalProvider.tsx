import { useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PortalContext, PortalNavigationContext, PortalPermissionsContext } from './PortalContext';
import { PortalRegistry } from '../registry/PortalRegistry';
import { PortalPermissions } from '../permissions/PortalPermissions';
import type { PortalContextValue, PortalNavigationContextValue, PortalPermissionsContextValue } from '../types/PortalContext';
import type { PortalDefinition } from '../types/PortalDefinition';
import type { User } from '../../authentication/types/auth.types';

interface PortalProviderProps {
  children: ReactNode;
  user?: User | null;
  tenantId?: string | null;
}

export const PortalProvider = ({ children, user = null, tenantId = null }: PortalProviderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPortal, setCurrentPortalState] = useState<PortalDefinition | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentPortals, setRecentPortals] = useState<string[]>([]);
  const [favouritePortals, setFavouritePortals] = useState<string[]>([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [featureFlags] = useState<string[]>([]);

  const role = useMemo(() => user?.roles?.[0] || null, [user]);
  const permissions = useMemo(() => user?.permissions || [], [user]);

  const setCurrentPortal = useCallback((portalId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const portal = PortalRegistry.get(portalId);
      if (portal) {
        setCurrentPortalState(portal);
        PortalRegistry.recordAccess(portalId);
        setRecentPortals((prev) => {
          const filtered = prev.filter((id) => id !== portalId);
          return [portalId, ...filtered].slice(0, 10);
        });
      } else {
        setError(`Portal "${portalId}" not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portal');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPortal = useCallback(() => {
    if (currentPortal) {
      setCurrentPortal(currentPortal.id);
    }
  }, [currentPortal, setCurrentPortal]);

  useEffect(() => {
    const matched = PortalRegistry.getByRoute(location.pathname);
    if (matched && matched.id !== currentPortal?.id) {
      setCurrentPortal(matched.id);
    }
  }, [location.pathname, currentPortal?.id, setCurrentPortal]);

  const navigateToPortal = useCallback((portalId: string) => {
    const portal = PortalRegistry.get(portalId);
    if (portal) {
      navigate(portal.defaultRoute || portal.route);
    }
  }, [navigate]);

  const addToFavourites = useCallback((portalId: string) => {
    setFavouritePortals((prev) =>
      prev.includes(portalId) ? prev : [...prev, portalId]
    );
  }, []);

  const removeFromFavourites = useCallback((portalId: string) => {
    setFavouritePortals((prev) => prev.filter((id) => id !== portalId));
  }, []);

  const canAccessPortal = useCallback((portalId: string): boolean => {
    const portal = PortalRegistry.get(portalId);
    if (!portal) return false;
    return PortalPermissions.canAccessPortal({ portal, user, tenantId, featureFlags });
  }, [user, tenantId, featureFlags]);

  const canAccessWidget = useCallback((_widgetId: string): boolean => {
    return PortalPermissions.canAccessWidget([], user);
  }, [user]);

  const hasRoleFn = useCallback((checkRole: string): boolean => {
    return PortalPermissions.hasRole(user, checkRole);
  }, [user]);

  const hasPermissionFn = useCallback((permission: string): boolean => {
    return PortalPermissions.hasPermission(user, permission);
  }, [user]);

  const hasFeatureFlagFn = useCallback((flag: string): boolean => {
    return PortalPermissions.hasFeatureFlag(featureFlags, flag);
  }, [featureFlags]);

  const portalContextValue: PortalContextValue = {
    currentPortal,
    currentPortalId: currentPortal?.id || null,
    user,
    tenantId,
    role,
    permissions,
    theme,
    notificationCount,
    currentRoute: location.pathname,
    isLoading,
    error,
    setCurrentPortal,
    setTheme,
    setNotificationCount,
    refreshPortal,
  };

  const navigationContextValue: PortalNavigationContextValue = {
    activePortalId: currentPortal?.id || null,
    recentPortals,
    favouritePortals,
    sidebarExpanded,
    navigateToPortal,
    addToFavourites,
    removeFromFavourites,
    toggleSidebar: () => setSidebarExpanded((prev) => !prev),
    setSidebarExpanded,
  };

  const permissionsContextValue: PortalPermissionsContextValue = {
    canAccessPortal,
    canAccessWidget,
    hasRole: hasRoleFn,
    hasPermission: hasPermissionFn,
    hasFeatureFlag: hasFeatureFlagFn,
    isReadOnly: PortalPermissions.isReadOnly(user),
  };

  return (
    <PortalContext.Provider value={portalContextValue}>
      <PortalNavigationContext.Provider value={navigationContextValue}>
        <PortalPermissionsContext.Provider value={permissionsContextValue}>
          {children}
        </PortalPermissionsContext.Provider>
      </PortalNavigationContext.Provider>
    </PortalContext.Provider>
  );
};
