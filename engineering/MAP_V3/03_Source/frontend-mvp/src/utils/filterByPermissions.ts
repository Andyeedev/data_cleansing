import type { MetadataNavItem } from '../types/metadata';

export function filterByPermissions(
  items: MetadataNavItem[],
  userRoles: string[],
): MetadataNavItem[] {
  return items
    .filter((item) => {
      if (item.visible === false) return false;
      if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
      return item.requiredRoles.some((role) => userRoles.includes(role));
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterByPermissions(item.children, userRoles) : [],
    }));
}
