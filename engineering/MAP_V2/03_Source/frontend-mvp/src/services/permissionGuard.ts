interface User {
  roles?: string[];
}

export const permissionGuard = {
  hasRole(user: User | null, role: string): boolean {
    if (!user?.roles) return false;
    return user.roles.includes(role);
  },

  hasAnyRole(user: User | null, roles: string[]): boolean {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles!.includes(role));
  },

  canAccess(user: User | null, requiredRoles?: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return this.hasAnyRole(user, requiredRoles);
  },

  isAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin');
  },

  isManager(user: User | null): boolean {
    return this.hasAnyRole(user, ['admin', 'manager']);
  },

  isComplianceOfficer(user: User | null): boolean {
    return this.hasAnyRole(user, ['admin', 'compliance-officer']);
  },
};
