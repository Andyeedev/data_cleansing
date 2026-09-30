import { useState } from 'react';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { EmptyState } from '../../components/shared';
import { KpiBox, ReportCard, StatusPill } from '../../components/reports/reportWidgets';
import { useAuth } from '../../context/AuthContext';
import { apiPost } from '../../utils/apiClient';

export function SecurityPage() {
  const { user } = useAuth();
  const roles = user?.roles ?? [];
  const permissions = user?.permissions ?? [];

  // Phase E (E10): own-password change via the existing capability
  // POST /api/v1/auth/change-password. No new endpoint or backend.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;

  const handleChangePassword = async () => {
    if (!passwordsMatch) return;
    setChanging(true);
    setChangeError(null);
    setChangeSuccess(false);
    try {
      await apiPost('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setChangeSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setChangeError(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setChanging(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Security"
        description="Session identity, assigned roles, and the permission set available to the current account."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <KpiBox label="Current user" value={user?.email ?? '—'} tone="info" />
        <KpiBox label="Assigned roles" value={roles.length} tone="neutral" />
        <KpiBox label="Permissions" value={permissions.length} tone="neutral" />
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <ReportCard title="Roles" subtitle="Roles granted to the current session">
          {roles.length === 0 ? (
            <EmptyState message="No roles assigned to this session." />
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {roles.map((role) => (
                <StatusPill key={role} status={role} />
              ))}
            </div>
          )}
        </ReportCard>

        <ReportCard title="Permissions" subtitle="Granular permissions available to this session">
          {permissions.length === 0 ? (
            <EmptyState message="No permissions exposed for this session." />
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {permissions.map((permission) => (
                <span
                  key={permission}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius)',
                    padding: '4px 10px',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {permission}
                </span>
              ))}
            </div>
          )}
        </ReportCard>
      </div>

      <ReportCard title="RBAC enforcement" subtitle="How access is enforced across the workbench">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Administration routes are protected by role and permission guards
          (Super Admin, Tenant Admin, and canonical <code>resource:action</code> permissions),
          and every endpoint re-enforces authorization server-side with tenant scope.
        </p>
      </ReportCard>

      <ReportCard title="Change own password" subtitle="Update the current session password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxWidth: 360 }}>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Current password
            <input
              type="password"
              aria-label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)' }}
            />
          </label>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            New password
            <input
              type="password"
              aria-label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)' }}
            />
          </label>
          <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Confirm new password
            <input
              type="password"
              aria-label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)' }}
            />
          </label>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Minimum 8 characters with uppercase, lowercase, and a digit.
          </span>
          {newPassword !== '' && confirmPassword !== '' && !passwordsMatch && (
            <span role="alert" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>
              New passwords do not match.
            </span>
          )}
          {changeError && (
            <span role="alert" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>
              {changeError}
            </span>
          )}
          {changeSuccess && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>
              Password changed successfully.
            </span>
          )}
          <div>
            <button
              onClick={handleChangePassword}
              disabled={changing || !currentPassword || !passwordsMatch}
              aria-label="Change own password"
              style={{
                padding: 'var(--space-xs) var(--space-md)',
                background: 'var(--color-sidebar-active)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: changing || !currentPassword || !passwordsMatch ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500,
              }}
            >
              {changing ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </ReportCard>
    </PageContainer>
  );
}