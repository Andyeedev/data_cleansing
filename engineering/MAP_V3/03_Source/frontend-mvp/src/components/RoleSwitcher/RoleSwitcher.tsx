import { useAuth } from '../../context/AuthContext';

const ROLES = ['admin', 'manager', 'operator', 'viewer'] as const;

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  operator: 'Operator',
  viewer: 'Viewer',
};

export function RoleSwitcher() {
  const { user, userRoles, switchRole } = useAuth();

  if (!user) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Role:</span>
      <select
        aria-label="Switch role"
        value={userRoles[0] ?? 'viewer'}
        onChange={(e) => switchRole(e.target.value)}
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '4px 8px',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
    </div>
  );
}
