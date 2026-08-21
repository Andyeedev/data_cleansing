import { Settings } from 'lucide-react';

export function UserSettingsPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
        Settings
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 32 }}>
        Manage your display, notification, and account preferences.
      </p>

      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 48,
        textAlign: 'center',
      }}>
        <Settings size={32} style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }} />
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This section will provide profile management, notification preferences, and display settings.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 12, opacity: 0.7 }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}
