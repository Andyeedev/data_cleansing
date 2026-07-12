import type { PortalDefinition } from '../types/PortalDefinition';
import type { User } from '../../authentication/types/auth.types';

export interface PortalPermissionCheck {
  portal: PortalDefinition;
  user: User | null;
  tenantId: string | null;
  featureFlags: string[];
}

export class PortalPermissions {
  static canAccessPortal(check: PortalPermissionCheck): boolean {
    const { portal, user } = check;

    if (!portal.enabled) return false;
    if (portal.status === 'inactive' || portal.status === 'deprecated') return false;

    if (!user) return portal.roles.length === 0;

    if (portal.roles.length > 0) {
      const userRoles = user.roles || [];
      const hasRole = portal.roles.some((role) => userRoles.includes(role));
      if (!hasRole) return false;
    }

    return true;
  }

  static canAccessWidget(
    widgetPermissions: string[] | undefined,
    user: User | null
  ): boolean {
    if (!widgetPermissions || widgetPermissions.length === 0) return true;
    if (!user) return false;

    const userPermissions = user.permissions || [];
    return widgetPermissions.some((perm) => userPermissions.includes(perm));
  }

  static hasRole(user: User | null, role: string): boolean {
    if (!user) return false;
    return (user.roles || []).includes(role);
  }

  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    return (user.permissions || []).includes(permission);
  }

  static hasFeatureFlag(flags: string[], flag: string): boolean {
    return flags.includes(flag);
  }

  static getVisiblePortals(
    portals: PortalDefinition[],
    user: User | null,
    featureFlags: string[] = []
  ): PortalDefinition[] {
    return portals.filter((portal) => {
      if (!portal.enabled) return false;
      if (portal.status !== 'active') return false;

      if (portal.featureFlags && portal.featureFlags.length > 0) {
        const hasFlags = portal.featureFlags.every((flag) =>
          featureFlags.includes(flag)
        );
        if (!hasFlags) return false;
      }

      if (portal.roles.length > 0 && user) {
        const userRoles = user.roles || [];
        const hasRole = portal.roles.some((role) => userRoles.includes(role));
        if (!hasRole) return false;
      }

      return true;
    });
  }

  static isReadOnly(user: User | null): boolean {
    if (!user) return true;
    return (user.roles || []).includes('viewer');
  }
}
