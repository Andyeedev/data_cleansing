import { User, Mail, Shield, Calendar, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
        Profile
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 32 }}>
        View and manage your account information.
      </p>

      {/* Avatar + Name Card */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 32,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 24,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)' }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            {user?.email || 'user@example.com'}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <InfoRow icon={<User size={16} />} label="Full Name" value={user?.name || 'User'} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={user?.email || 'user@example.com'} />
        <InfoRow
          icon={<Shield size={16} />}
          label="Roles"
          value={user?.roles?.join(', ') || 'No roles assigned'}
        />
        <InfoRow
          icon={<Calendar size={16} />}
          label="User ID"
          value={user?.id || 'N/A'}
          last
        />
      </div>

      {/* Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Key size={16} />
          Change Password
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, last = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      borderBottom: last ? 'none' : '1px solid var(--color-border)',
      gap: 12,
    }}>
      <div style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--color-text)' }}>{value}</div>
      </div>
    </div>
  );
}
