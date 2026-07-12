import { useCallback, useMemo } from 'react';
import { usePortal as usePortalContext, usePortalNavigation as usePortalNavigationContext, usePortalPermissions as usePortalPermissionsContext } from '../framework/PortalContext';
import { PortalRegistry } from '../registry/PortalRegistry';
import type { PortalDefinition } from '../types/PortalDefinition';

export const usePortal = () => {
  const context = usePortalContext();

  const currentPortalDef = useMemo(() => {
    if (!context.currentPortalId) return null;
    return PortalRegistry.get(context.currentPortalId) || null;
  }, [context.currentPortalId]);

  const availablePortals = useMemo(() => {
    return PortalRegistry.getEnabled();
  }, []);

  const navigateToPortal = useCallback((portalId: string) => {
    const portal = PortalRegistry.get(portalId);
    if (portal) {
      window.location.href = portal.defaultRoute || portal.route;
    }
  }, []);

  return {
    ...context,
    currentPortalDef,
    availablePortals,
    navigateToPortal,
  };
};

export const usePortalNavigation = () => {
  return usePortalNavigationContext();
};

export const usePortalPermissions = () => {
  return usePortalPermissionsContext();
};

export const useRecentPortals = (limit: number = 5): PortalDefinition[] => {
  const { recentPortals } = usePortalNavigationContext();

  return useMemo(() => {
    return recentPortals
      .slice(0, limit)
      .map((id) => PortalRegistry.get(id))
      .filter((p): p is PortalDefinition => p !== undefined);
  }, [recentPortals, limit]);
};

export const useFavouritePortals = (): PortalDefinition[] => {
  const { favouritePortals } = usePortalNavigationContext();

  return useMemo(() => {
    return favouritePortals
      .map((id) => PortalRegistry.get(id))
      .filter((p): p is PortalDefinition => p !== undefined);
  }, [favouritePortals]);
};

export const usePortalSearch = (query: string): PortalDefinition[] => {
  return useMemo(() => {
    if (!query.trim()) return PortalRegistry.getEnabled();
    return PortalRegistry.search(query);
  }, [query]);
};
