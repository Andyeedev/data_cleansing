import type { MetadataNavItem } from '../types/metadata';
import { ADMIN_SECTIONS, type AdminSection } from './adminSections';

/**
 * Phase B — capability resolution against the single ADMIN_SECTIONS catalogue.
 *
 * Semantics intentionally match the two existing enforcement points so the
 * shell can never show what the route would deny (and vice versa):
 * `ProtectedRoute` (components/ProtectedRoute.tsx) and `filterByPermissions`
 * (utils/filterByPermissions.ts) — permissions first (OR-match), else roles
 * (OR-match). Hiding is UX only; the backend remains authoritative (spec §13:
 * "A hidden menu item is not a security control").
 */

export interface AdminEnvelope {
  roles: string[];
  permissions: string[];
}

type Gated = Pick<MetadataNavItem, 'requiredRoles' | 'requiredPermissions'>;

export function canAccessSection(section: Gated, envelope: AdminEnvelope): boolean {
  if (section.requiredPermissions && section.requiredPermissions.length > 0) {
    return section.requiredPermissions.some((perm) => envelope.permissions.includes(perm));
  }
  if (section.requiredRoles && section.requiredRoles.length > 0) {
    return section.requiredRoles.some((role) => envelope.roles.includes(role));
  }
  return true;
}

/** Rail entries visible to this principal, in spec §4.1 order. */
export function visibleAdminSections(envelope: AdminEnvelope): AdminSection[] {
  return ADMIN_SECTIONS.filter((section) => canAccessSection(section, envelope));
}

/**
 * Deepest catalogue section matching a pathname (so `/administration/users/9`
 * resolves to Users). Overview (`/administration`) matches only itself and
 * acts as the fallback for unknown `/administration/*` paths — callers must
 * still let the route guard deny those.
 */
export function adminSectionForPath(pathname: string): AdminSection | undefined {
  if (pathname === '/administration') {
    return ADMIN_SECTIONS.find((section) => section.path === '/administration');
  }
  const rest = ADMIN_SECTIONS.filter((section) => section.path !== '/administration')
    .sort((a, b) => b.path.length - a.path.length);
  return rest.find(
    (section) => pathname === section.path || pathname.startsWith(`${section.path}/`),
  );
}

const SECTIONS_BY_PATH = new Map(ADMIN_SECTIONS.map((section) => [section.path, section]));

/**
 * Reconcile one server-provided nav item against the catalogue. Known admin
 * paths adopt the catalogue's label/capabilityId/gates — this overrides the
 * mock's `requiredRoles: ["admin"]` alias, which matches no real principal.
 * Unknown items pass through untouched. Scoped to the administration subtree
 * only; non-admin navigation is out of Phase B scope.
 */
export function resolveServerNavItem(item: MetadataNavItem): MetadataNavItem {
  if (item.id === 'administration' || item.path === '/administration') {
    return {
      ...item,
      requiredPermissions: undefined,
      requiredRoles: ['Super Admin', 'Tenant Admin'],
      children: (item.children ?? []).map((child) => {
        const known = SECTIONS_BY_PATH.get(child.path);
        if (!known) return child;
        return {
          ...child,
          label: known.label,
          capabilityId: known.capabilityId,
          requiredPermissions: known.requiredPermissions,
          requiredRoles: known.requiredRoles,
        };
      }),
    };
  }
  return item;
}
