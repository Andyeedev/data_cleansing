import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPost } from '../utils/apiClient';
import { useUserList, useDeleteUser } from '../hooks/useUsers';
import { useRoleList } from '../hooks/useRoles';
import { useSettingList } from '../hooks/useSettings';
import { useFeatureFlagList } from '../hooks/useFeatureFlags';
import { useHealth } from '../hooks/useHealth';
import {
  ErrorState,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  TabBar,
  MetricCard,
} from '../components/shared';

type Tab = 'overview' | 'users' | 'roles' | 'settings' | 'feature-flags' | 'security' | 'maintenance';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'settings', label: 'Settings' },
  { key: 'feature-flags', label: 'Feature Flags' },
  { key: 'security', label: 'Security' },
  { key: 'maintenance', label: 'Maintenance' },
];

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
}

export function AdministrationPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError, setAuditError] = useState<string | null>(null);

  const isAdmin = userRoles.includes('admin');

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUserList({ page: 1, page_size: 100 });
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useRoleList({ page: 1, page_size: 100 });
  const { data: settingsData, loading: settingsLoading, error: settingsError } = useSettingList();
  const { data: featureFlags, loading: flagsLoading, error: flagsError } = useFeatureFlagList();
  const { health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    setAuditLoading(true);
    apiGet<{ entries: AuditEntry[]; total: number }>('/audit-log?limit=10')
      .then((res) => {
        if (!cancelled) setAuditLog(res.entries || []);
      })
      .catch((err) => {
        if (!cancelled) setAuditError(err instanceof Error ? err.message : 'Failed to load audit log');
      })
      .finally(() => {
        if (!cancelled) setAuditLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-md)' }}>Administration</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const totalUsers = usersData?.total ?? 0;
  const totalRoles = rolesData?.total ?? 0;
  const activeUsers = usersData?.users?.filter((u) => u.status === 'active').length ?? 0;
  const activeRoles = rolesData?.roles?.filter((r) => r.status === 'active').length ?? 0;
  const enabledFlags = featureFlags?.filter((f) => f.enabled).length ?? 0;

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-sm)' }}>Administration</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
          Manage users, roles, tenants, settings, feature flags, security, and maintenance.
        </p>
      </div>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as Tab)}
      />

      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard
              title="Total Users"
              value={usersLoading ? '—' : totalUsers}
              icon="👤"
              loading={usersLoading}
              error={usersError || undefined}
              onRetry={refetchUsers}
            />
            <MetricCard
              title="Active Users"
              value={usersLoading ? '—' : activeUsers}
              icon="✅"
              color="var(--color-success)"
              loading={usersLoading}
              error={usersError || undefined}
            />
            <MetricCard
              title="Total Roles"
              value={rolesLoading ? '—' : totalRoles}
              icon="🔑"
              loading={rolesLoading}
              error={rolesError || undefined}
            />
            <MetricCard
              title="Active Roles"
              value={rolesLoading ? '—' : activeRoles}
              icon="🛡"
              color="var(--color-success)"
              loading={rolesLoading}
              error={rolesError || undefined}
            />
            <MetricCard
              title="Settings"
              value={settingsLoading ? '—' : settingsData?.length ?? 0}
              icon="⚙"
              loading={settingsLoading}
              error={settingsError || undefined}
            />
            <MetricCard
              title="Feature Flags"
              value={flagsLoading ? '—' : featureFlags?.length ?? 0}
              icon="🚩"
              subtitle={`${enabledFlags} enabled`}
              loading={flagsLoading}
              error={flagsError || undefined}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>System Health</h3>
              {healthLoading ? (
                <LoadingSkeleton variant="card" />
              ) : healthError ? (
                <ErrorState message={healthError} onRetry={refetchHealth} />
              ) : health ? (
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>API:</span>
                    <StatusBadge status={health.api ? 'ACTIVE' : 'FAILED'} size="sm" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Database:</span>
                    <StatusBadge status={health.database ? 'ACTIVE' : 'FAILED'} size="sm" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Recent Audit Log</h3>
            {auditLoading ? (
              <LoadingSkeleton variant="table" rows={5} />
            ) : auditError ? (
              <ErrorState message={auditError} />
            ) : auditLog.length === 0 ? (
              <EmptyState title="No audit entries" description="No recent administrative actions recorded." />
            ) : (
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-background)' }}>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Action</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Entity</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>User</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((entry) => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge status={entry.action} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                          {entry.entity_type}: {entry.entity_id}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                          {entry.user_email}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UsersTab
          usersData={usersData}
          loading={usersLoading}
          error={usersError}
          onRefetch={refetchUsers}
          onNavigate={navigate}
        />
      )}

      {activeTab === 'roles' && (
        <RolesTab
          rolesData={rolesData}
          loading={rolesLoading}
          error={rolesError}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          settingsData={settingsData}
          loading={settingsLoading}
          error={settingsError}
        />
      )}

      {activeTab === 'feature-flags' && (
        <FeatureFlagsTab
          featureFlags={featureFlags}
          loading={flagsLoading}
          error={flagsError}
        />
      )}

      {activeTab === 'security' && (
        <SecurityTab />
      )}

      {activeTab === 'maintenance' && (
        <MaintenanceTab />
      )}
    </div>
  );
}

function UsersTab({ usersData, loading, error, onRefetch, onNavigate }: {
  usersData: { users: Array<{ id: string; display_name: string | null; first_name: string; last_name: string; email: string; department: string | null; status: string; last_login_at: string | null }>; total: number } | null;
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onNavigate: (path: string) => void;
}) {
  const { remove, loading: deleting } = useDeleteUser();

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"?`)) return;
    const success = await remove(userId);
    if (success) onRefetch();
  };

  if (loading) return <LoadingSkeleton variant="table" rows={8} />;
  if (error) return <ErrorState message={error} onRetry={onRefetch} />;
  if (!usersData || usersData.users.length === 0) {
    return <EmptyState title="No users found" description="Create your first user to get started" />;
  }

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--color-background)' }}>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Name</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Email</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Department</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Status</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Last Login</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersData.users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <button
                  onClick={() => onNavigate(`/administration/users/${user.id}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-sidebar-active)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {user.display_name || `${user.first_name} ${user.last_name}`}
                </button>
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>{user.email}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>{user.department || '—'}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <StatusBadge status={user.status} size="sm" />
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                <button
                  onClick={() => onNavigate(`/administration/users/${user.id}`)}
                  style={{
                    background: 'none',
                    border: 'var(--border-width) solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-xs)',
                    marginRight: 'var(--space-sm)',
                    color: 'var(--color-text)',
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.display_name || user.email)}
                  disabled={deleting}
                  style={{
                    background: 'none',
                    border: 'var(--border-width) solid var(--color-danger)',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-danger)',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolesTab({ rolesData, loading, error }: {
  rolesData: { roles: Array<{ id: string; name: string; description: string | null; type: string; status: string; is_system: boolean }>; total: number } | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <LoadingSkeleton variant="table" rows={5} />;
  if (error) return <ErrorState message={error} />;
  if (!rolesData || rolesData.roles.length === 0) {
    return <EmptyState title="No roles found" description="No roles configured in the system" />;
  }

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--color-background)' }}>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Name</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Description</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Type</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Status</th>
            <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>System</th>
          </tr>
        </thead>
        <tbody>
          {rolesData.roles.map((role) => (
            <tr key={role.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <span style={{ fontWeight: 500 }}>{role.name}</span>
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>{role.description || '—'}</td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <StatusBadge status={role.type} variant="info" size="sm" />
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <StatusBadge status={role.status} size="sm" />
              </td>
              <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                {role.is_system ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab({ settingsData, loading, error }: {
  settingsData: Array<{ category: string; key: string; value: unknown; description: string | null }> | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <LoadingSkeleton variant="list" rows={6} />;
  if (error) return <ErrorState message={error} />;
  if (!settingsData || settingsData.length === 0) {
    return <EmptyState title="No settings found" description="No system settings configured" />;
  }

  const grouped = settingsData.reduce<Record<string, typeof settingsData>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {Object.entries(grouped).map(([category, settings]) => (
        <div key={category}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)', textTransform: 'capitalize' }}>
            {category}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {settings.map((s) => (
              <div
                key={`${s.category}-${s.key}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>{s.key}</span>
                  {s.description && (
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: 'var(--space-sm)' }}>
                      — {s.description}
                    </span>
                  )}
                </div>
                <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                  {String(s.value ?? '—')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureFlagsTab({ featureFlags, loading, error }: {
  featureFlags: Array<{ key: string; name: string; description: string | null; enabled: boolean; rollout_percentage: number; status: string }> | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <LoadingSkeleton variant="list" rows={4} />;
  if (error) return <ErrorState message={error} />;
  if (!featureFlags || featureFlags.length === 0) {
    return <EmptyState title="No feature flags found" description="No feature flags configured" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {featureFlags.map((flag) => (
        <div
          key={flag.key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{flag.name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
              Key: {flag.key}
            </div>
            {flag.description && (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                {flag.description}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Rollout: {flag.rollout_percentage}%
            </span>
            <StatusBadge
              status={flag.enabled ? 'ENABLED' : 'DISABLED'}
              variant={flag.enabled ? 'success' : 'danger'}
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SecurityTab() {
  const securityItems = [
    { label: 'Password Policy', status: 'ACTIVE', detail: 'Minimum 8 characters, special characters required' },
    { label: 'Session Timeout', status: 'ACTIVE', detail: '30 minutes idle timeout' },
    { label: 'Two-Factor Authentication', status: 'INACTIVE', detail: 'Not enforced' },
    { label: 'IP Allowlisting', status: 'INACTIVE', detail: 'Not configured' },
    { label: 'API Rate Limiting', status: 'ACTIVE', detail: '100 requests per minute' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>Security Policies</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {securityItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                {item.detail}
              </div>
            </div>
            <StatusBadge status={item.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceTab() {
  const [purging, setPurging] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = async () => {
    setCacheCleared(false);
    setPurging(true);
    try {
      await apiPost('/admin/cache/clear', {});
      setCacheCleared(true);
    } catch {
      // silent
    } finally {
      setPurging(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-md)' }}>System Maintenance</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>Clear Application Cache</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
              Purge all cached data. This may cause temporary performance degradation.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            {cacheCleared && <StatusBadge status="Cache Cleared" variant="success" size="sm" />}
            <button
              onClick={handleClearCache}
              disabled={purging}
              style={{
                padding: 'var(--space-xs) var(--space-md)',
                background: purging ? 'var(--color-bg-secondary)' : 'var(--color-danger)',
                color: purging ? 'var(--color-text-secondary)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: purging ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 500,
              }}
            >
              {purging ? 'Clearing...' : 'Clear Cache'}
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>Database Cleanup</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
              Remove orphaned records and optimize database tables.
            </div>
          </div>
          <button
            style={{
              padding: 'var(--space-xs) var(--space-md)',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 500,
            }}
          >
            Run Cleanup
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 500 }}>Export Audit Log</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
              Download the full audit trail as a CSV file.
            </div>
          </div>
          <button
            style={{
              padding: 'var(--space-xs) var(--space-md)',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 500,
            }}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
