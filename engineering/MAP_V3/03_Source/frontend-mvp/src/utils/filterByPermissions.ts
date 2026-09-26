import type { MetadataNavItem } from '../types/metadata';

export function filterByPermissions(
  items: MetadataNavItem[],
  userRoles: string[],
  userPermissions: string[] = [],
): MetadataNavItem[] {
  return items
    .filter((item) => {
      if (item.visible === false) return false;
      if (item.requiredPermissions && item.requiredPermissions.length > 0) {
        if (!item.requiredPermissions.some((perm) => userPermissions.includes(perm))) return false;
      } else if (item.requiredRoles && item.requiredRoles.length > 0) {
        if (!item.requiredRoles.some((role) => userRoles.includes(role))) return false;
      }
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterByPermissions(item.children, userRoles, userPermissions) : [],
    }));
}