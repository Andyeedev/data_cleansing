import { describe, it, expect } from 'vitest';
import { ADMIN_SECTIONS } from './adminSections';
import {
  adminSectionForPath,
  canAccessSection,
  resolveServerNavItem,
  visibleAdminSections,
  type AdminEnvelope,
} from './capabilities';

const SUPER_ADMIN: AdminEnvelope = {
  roles: ['Super Admin'],
  permissions: [
    'users:list', 'users:read', 'users:create', 'users:update', 'users:delete',
    'roles:list', 'roles:read', 'roles:create', 'roles:update', 'roles:delete', 'roles:assign',
    'invitations:read', 'invitations:create', 'invitations:update', 'invitations:revoke', 'invitations:resend',
    'settings:read', 'settings:update',
    'systems:list', 'systems:read', 'systems:create', 'systems:update', 'systems:delete', 'systems:test',
    'reports:read', 'reports:export',
  ],
};

// Tenant-scoped grant set per the Stage A seed (no invitations:update).
const TENANT_ADMIN: AdminEnvelope = {
  roles: ['Tenant Admin'],
  permissions: [
    'users:create', 'users:read', 'users:update', 'users:delete', 'users:list',
    'roles:create', 'roles:read', 'roles:update', 'roles:delete', 'roles:list', 'roles:assign',
    'invitations:create', 'invitations:read', 'invitations:revoke', 'invitations:resend',
    'systems:create', 'systems:read', 'systems:update', 'systems:delete', 'systems:list', 'systems:test',
    'settings:read', 'settings:update',
    'reports:read', 'reports:export',
  ],
};

const VIEWER: AdminEnvelope = { roles: ['Viewer'], permissions: [] };

const visiblePaths = (envelope: AdminEnvelope) =>
  visibleAdminSections(envelope).map((section) => section.path);

describe('Phase B capability resolution', () => {
  it('exposes the 12 spec §4.1 sections in order from the single catalogue', () => {
    expect(ADMIN_SECTIONS.map((section) => section.path)).toEqual([
      '/administration',
      '/administration/users',
      '/administration/roles',
      '/administration/invitations',
      '/administration/registrations',
      '/administration/tenants',
      '/administration/subscriptions',
      '/administration/settings',
      '/administration/feature-flags',
      '/administration/security',
      '/administration/notifications',
      '/administration/maintenance',
    ]);
    for (const section of ADMIN_SECTIONS) {
      expect(section.capabilityId, section.path).toBeTruthy();
    }
  });

  it('Super Admin sees the full global surface', () => {
    expect(visibleAdminSections(SUPER_ADMIN)).toHaveLength(12);
  });

  it('Tenant Admin sees only its tenant-scoped surface', () => {
    expect(visiblePaths(TENANT_ADMIN)).toEqual([
      '/administration',
      '/administration/users',
      '/administration/roles',
      '/administration/invitations',
      '/administration/settings',
    ]);
  });

  it('Tenant Admin is denied the platform/global boundary', () => {
    const paths = visiblePaths(TENANT_ADMIN);
    for (const denied of [
      '/administration/tenants',
      '/administration/registrations',
      '/administration/subscriptions',
      '/administration/permissions',
      '/administration/feature-flags',
      '/administration/security',
      '/administration/notifications',
      '/administration/maintenance',
    ]) {
      expect(paths, denied).not.toContain(denied);
    }
  });

  it('Viewer sees no administration surface', () => {
    expect(visibleAdminSections(VIEWER)).toHaveLength(0);
  });

  it('permissions take precedence over roles, matching ProtectedRoute', () => {
    const section = ADMIN_SECTIONS.find((s) => s.path === '/administration/users')!;
    expect(canAccessSection(section, { roles: [], permissions: ['users:list'] })).toBe(true);
    expect(canAccessSection(section, { roles: ['Super Admin'], permissions: [] })).toBe(false);
  });

  it('resolves detail paths to their section', () => {
    expect(adminSectionForPath('/administration/users/9')?.path).toBe('/administration/users');
    expect(adminSectionForPath('/administration')?.path).toBe('/administration');
    expect(adminSectionForPath('/administration/nope')).toBeUndefined();
  });

  it('overrides the mock ["admin"] alias gates for known admin paths', () => {
    const resolved = resolveServerNavItem({
      id: 'administration',
      label: 'Administration',
      path: '/administration',
      requiredRoles: ['admin'],
      children: [
        { id: 'tenants', label: 'Tenants', path: '/administration/tenants', requiredRoles: ['admin'] },
        { id: 'mystery', label: 'Mystery', path: '/administration/mystery', requiredRoles: ['admin'] },
      ],
    });
    expect(resolved.children?.[0].requiredRoles).toEqual(['Super Admin']);
    expect(resolved.children?.[0].capabilityId).toBe('admin.tenantManagement');
    expect(resolved.children?.[1].requiredRoles).toEqual(['admin']);
  });

  it('gives the administration parent the hub gate and leaves other trees alone', () => {
    const parent = resolveServerNavItem({
      id: 'administration',
      label: 'Administration',
      path: '/administration',
      requiredRoles: ['admin'],
      children: [
        { id: 'tenants', label: 'Tenants', path: '/administration/tenants', requiredRoles: ['admin'] },
      ],
    });
    expect(parent.label).toBe('Administration');
    expect(parent.requiredRoles).toEqual(['Super Admin', 'Tenant Admin']);
    expect(parent.children?.[0].requiredRoles).toEqual(['Super Admin']);

    const other = resolveServerNavItem({
      id: 'migration',
      label: 'Migration',
      path: '/migration',
      requiredRoles: ['admin'],
    });
    expect(other.requiredRoles).toEqual(['admin']);
  });
});
