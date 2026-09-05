import { describe, it, expect } from 'vitest';
import { permissionGuard } from './permissionGuard';

describe('permissionGuard', () => {
  const adminUser = { roles: ['admin', 'manager'] };
  const managerUser = { roles: ['manager'] };
  const complianceUser = { roles: ['compliance-officer'] };
  const viewerUser = { roles: ['viewer'] };
  const emptyUser = { roles: [] };
  const nullUser = null;

  describe('hasRole', () => {
    it('returns true if user has the role', () => {
      expect(permissionGuard.hasRole(adminUser, 'admin')).toBe(true);
    });

    it('returns false if user does not have the role', () => {
      expect(permissionGuard.hasRole(managerUser, 'admin')).toBe(false);
    });

    it('returns false if user is null', () => {
      expect(permissionGuard.hasRole(nullUser, 'admin')).toBe(false);
    });

    it('returns false if user has no roles', () => {
      expect(permissionGuard.hasRole(emptyUser, 'admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('returns true if user has one of the roles', () => {
      expect(permissionGuard.hasAnyRole(adminUser, ['admin', 'viewer'])).toBe(true);
    });

    it('returns true if user has multiple matching roles', () => {
      expect(permissionGuard.hasAnyRole(adminUser, ['admin', 'manager'])).toBe(true);
    });

    it('returns false if user has none of the roles', () => {
      expect(permissionGuard.hasAnyRole(viewerUser, ['admin', 'manager'])).toBe(false);
    });

    it('returns false if user is null', () => {
      expect(permissionGuard.hasAnyRole(nullUser, ['admin'])).toBe(false);
    });

    it('returns false if user has no roles', () => {
      expect(permissionGuard.hasAnyRole(emptyUser, ['admin'])).toBe(false);
    });
  });

  describe('canAccess', () => {
    it('returns true if no required roles specified', () => {
      expect(permissionGuard.canAccess(viewerUser)).toBe(true);
    });

    it('returns true if required roles is empty', () => {
      expect(permissionGuard.canAccess(viewerUser, [])).toBe(true);
    });

    it('returns true if user has required role', () => {
      expect(permissionGuard.canAccess(managerUser, ['admin', 'manager'])).toBe(true);
    });

    it('returns false if user lacks required role', () => {
      expect(permissionGuard.canAccess(viewerUser, ['admin', 'manager'])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns true if user is admin', () => {
      expect(permissionGuard.isAdmin(adminUser)).toBe(true);
    });

    it('returns false if user is not admin', () => {
      expect(permissionGuard.isAdmin(managerUser)).toBe(false);
    });

    it('returns false if user is null', () => {
      expect(permissionGuard.isAdmin(nullUser)).toBe(false);
    });
  });

  describe('isManager', () => {
    it('returns true if user is admin (admin is also manager)', () => {
      expect(permissionGuard.isManager(adminUser)).toBe(true);
    });

    it('returns true if user is manager', () => {
      expect(permissionGuard.isManager(managerUser)).toBe(true);
    });

    it('returns false if user is viewer', () => {
      expect(permissionGuard.isManager(viewerUser)).toBe(false);
    });
  });

  describe('isComplianceOfficer', () => {
    it('returns true if user is admin (admin is also compliance)', () => {
      expect(permissionGuard.isComplianceOfficer(adminUser)).toBe(true);
    });

    it('returns true if user is compliance-officer', () => {
      expect(permissionGuard.isComplianceOfficer(complianceUser)).toBe(true);
    });

    it('returns false if user is manager', () => {
      expect(permissionGuard.isComplianceOfficer(managerUser)).toBe(false);
    });
  });
});
