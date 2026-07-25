import { useAuth } from '../../context/AuthContext';
import type { MockRole } from '../../types/auth';

const ROLES: MockRole[] = ['admin', 'manager', 'operator', 'viewer'];

const ROLE_LABELS: Record<MockRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  operator: 'Operator',
  viewer: 'Viewer',
};

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Role:</span>
      <select
        aria-label="Switch role"
        value={user.roles[0]}
        onChange={(e) => switchRole(e.target.value as MockRole)}
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
