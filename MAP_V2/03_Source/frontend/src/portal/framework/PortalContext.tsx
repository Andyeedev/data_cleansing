import { createContext, useContext } from 'react';
import type { PortalContextValue, PortalNavigationContextValue, PortalPermissionsContextValue } from '../types/PortalContext';

export const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export const PortalNavigationContext = createContext<PortalNavigationContextValue | undefined>(undefined);

export const PortalPermissionsContext = createContext<PortalPermissionsContextValue | undefined>(undefined);

export const usePortal = (): PortalContextValue => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

export const usePortalNavigation = (): PortalNavigationContextValue => {
  const context = useContext(PortalNavigationContext);
  if (!context) {
    throw new Error('usePortalNavigation must be used within a PortalProvider');
  }
  return context;
};

export const usePortalPermissions = (): PortalPermissionsContextValue => {
  const context = useContext(PortalPermissionsContext);
  if (!context) {
    throw new Error('usePortalPermissions must be used within a PortalProvider');
  }
  return context;
};
