import { useState } from 'react';

export const DistributionSettings = () => {
  const [settings] = useState({
    defaultFormat: 'pdf',
    defaultChannel: 'email',
    notifications: { email: true, teams: true, sms: false, portal: true },
    autoRetry: true,
    maxRetries: 3,
    retryIntervalMinutes: 5,
  });

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Defaults</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Default Format</label>
            <div style={{ padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{settings.defaultFormat.toUpperCase()}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Default Channel</label>
            <div style={{ padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{settings.defaultChannel}</div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Notifications</h3>
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: value ? '#10b981' : '#6b7280' }}>{value ? 'Enabled' : 'Disabled'}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Retry Policy</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Auto Retry</label>
            <div style={{ padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{settings.autoRetry ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Max Retries</label>
            <div style={{ padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{settings.maxRetries}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Retry Interval (minutes)</label>
            <div style={{ padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{settings.retryIntervalMinutes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
