import type { MetadataNavItem } from '../types/metadata';

/**
 * Phase B — single authoritative Administration catalogue.
 *
 * Authoritative model = spec §4.1 rail list + the gates the backend and the
 * route guards actually enforce (Stage A). This is the ONE definition of the
 * admin surface: the global sidebar admin subtree (Shell.tsx) and the
 * AdminConsole rail both render from here.
 *
 * The backend mock nav (`app/api/routes/navigation_routes.py::MOCK_NAV_ITEMS`)
 * was used ONLY to reconcile `capabilityId`/labels — it is not authoritative
 * (its `requiredRoles: ["admin"]` matches no real principal) and must not be
 * promoted into a second catalogue. Two ids below (`admin.overview`,
 * `admin.subscriptionManagement`) have no server counterpart because the mock
 * lacks Overview/Subscriptions; they follow the server's `admin.*` scheme.
 *
 * Gates mirror the AppRoutes route guards exactly: where the route requires a
 * permission the section requires that permission; where the route is
 * Super-Admin-only the section requires the Super Admin role. The "Roles &
 * Permissions" rail entry points at `/administration/roles` (section home);
 * `/administration/permissions` remains a Super-Admin-only deep link whose
 * full rewrite belongs to Stage E.
 */
export interface AdminSection extends MetadataNavItem {
  capabilityId: string;
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: 'admin-overview',
    capabilityId: 'admin.overview',
    label: 'Overview',
    path: '/administration',
    navGroup: 'system',
    navOrder: 1,
    requiredRoles: ['Super Admin', 'Tenant Admin'],
  },
  {
    id: 'admin-users',
    capabilityId: 'admin.userManagement',
    label: 'Users',
    path: '/administration/users',
    navGroup: 'system',
    navOrder: 2,
    requiredPermissions: ['users:list'],
  },
  {
    id: 'admin-roles',
    capabilityId: 'admin.roleManagement',
    label: 'Roles & Permissions',
    path: '/administration/roles',
    navGroup: 'system',
    navOrder: 3,
    requiredPermissions: ['roles:list'],
  },
  {
    id: 'admin-invitations',
    capabilityId: 'admin.userManagement',
    label: 'Invitations',
    path: '/administration/invitations',
    navGroup: 'system',
    navOrder: 4,
    requiredPermissions: ['invitations:read'],
  },
  {
    id: 'admin-registrations',
    capabilityId: 'admin.userManagement',
    label: 'Registrations',
    path: '/administration/registrations',
    navGroup: 'system',
    navOrder: 5,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-tenants',
    capabilityId: 'admin.tenantManagement',
    label: 'Tenants',
    path: '/administration/tenants',
    navGroup: 'system',
    navOrder: 6,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-subscriptions',
    capabilityId: 'admin.subscriptionManagement',
    label: 'Subscriptions',
    path: '/administration/subscriptions',
    navGroup: 'system',
    navOrder: 7,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-settings',
    capabilityId: 'admin.systemSettings',
    label: 'Settings',
    path: '/administration/settings',
    navGroup: 'system',
    navOrder: 8,
    requiredPermissions: ['settings:read'],
  },
  {
    id: 'admin-feature-flags',
    capabilityId: 'admin.featureFlags',
    label: 'Feature Flags',
    path: '/administration/feature-flags',
    navGroup: 'system',
    navOrder: 9,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-security',
    capabilityId: 'admin.securityManagement',
    label: 'Security',
    path: '/administration/security',
    navGroup: 'system',
    navOrder: 10,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-notifications',
    capabilityId: 'platform.notificationServices',
    label: 'Notifications',
    path: '/administration/notifications',
    navGroup: 'system',
    navOrder: 11,
    requiredRoles: ['Super Admin'],
  },
  {
    id: 'admin-maintenance',
    capabilityId: 'admin.maintenanceHealth',
    label: 'Maintenance',
    path: '/administration/maintenance',
    navGroup: 'system',
    navOrder: 12,
    requiredRoles: ['Super Admin'],
  },
];

/** The catalogue as plain nav items (for the sidebar / rail renderers). */
export function adminSectionsAsNavItems(): MetadataNavItem[] {
  return ADMIN_SECTIONS.map((section) => ({ ...section }));
}
