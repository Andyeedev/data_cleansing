import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserList, useDeleteUser } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useTenantScope } from '../tenant/TenantContext';
import { useSubscription } from '../hooks/useSubscription';
import {
  ErrorState,
  LoadingSkeleton,
  EmptyState,
  StatusBadge,
  Pagination,
} from '../components/shared';

export function UsersPage() {
  const navigate = useNavigate();
  const { userRoles, user } = useAuth();
  // Phase C: tenant working scope. Super Admin may scope the list to one
  // tenant via ?tenant_id= (backend SA-only override); All-Tenants has no
  // safe aggregate, so the list is unavailable there (amendment 2).
  const { scope, scopeTenantId, isSuperAdmin } = useTenantScope();
  const isAllTenants = isSuperAdmin && scope.kind === 'all';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');

  const { data, loading, error, refetch } = useUserList({
    page,
    page_size: 20,
    status: statusFilter || undefined,
    search: search || undefined,
    tenant_id: scopeTenantId ?? undefined,
  });

  const { remove, loading: deleting } = useDeleteUser();

  // Phase E (E1): action affordances follow the envelope — destructive and
  // mutating actions render only with their grant (backend still enforces).
  const grants = user?.permissions ?? [];
  const canCreateUsers = grants.includes('users:create') || userRoles.includes('Super Admin');
  const canDeleteUsers = grants.includes('users:delete') || userRoles.includes('Super Admin');

  // Seat capacity from the existing subscription envelope (JWT tenant).
  const { subscription, isAtLimit } = useSubscription();
  const seatsFull = isAtLimit('users');
  const seatNote = subscription
    ? `${subscription.limits.users.current} of ${subscription.limits.users.max} seats used`
    : null;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"?`)) return;
    const success = await remove(userId);
    if (success) refetch();
  };

  // Phase C (B5 completion): guard matches the route guard (users:list), so
  // Tenant Admin with the grant is not denied by a stale 'admin' alias.
  const canListUsers =
    (user?.permissions ?? []).includes('users:list') || userRoles.includes('Super Admin');
  if (!canListUsers) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Users</h1>
        <ErrorState message="You do not have permission to view this page. Required permission: users:list" />
      </div>
    );
  }

  if (isAllTenants) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Users</h1>
        <EmptyState
          title="Not available for All Tenants"
          description="Select a tenant scope to list users. The aggregate user directory arrives in Stage D."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Users</h1>
          {seatNote && (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 'var(--space-xs) 0 0' }}>
              {seatNote}{seatsFull ? ' — seat limit reached' : ''}
            </p>
          )}
        </div>
        {canCreateUsers && (
          <button
            onClick={() => navigate('/administration/users/new')}
            disabled={seatsFull}
            title={seatsFull ? 'Seat limit reached for this plan' : 'Add user'}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: seatsFull ? 'var(--color-bg-secondary)' : 'var(--color-sidebar-active)',
              color: seatsFull ? 'var(--color-text-secondary)' : 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: seatsFull ? 'not-allowed' : 'pointer',
              fontSize: 'var(--font-size-base)',
            }}
          >
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        <input
          type="text"
          placeholder="Search users..."
          aria-label="Search users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-base)',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-base)',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading && <LoadingSkeleton variant="table" rows={10} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          {data.users.length === 0 ? (
            <EmptyState
              title="No users found"
              description={search ? 'Try a different search term' : 'Create your first user to get started'}
            />
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-base)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Name</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Email</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Department</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Last Login</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <button
                          onClick={() => navigate(`/administration/users/${user.id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-sidebar-active)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-base)',
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
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/administration/users/${user.id}`)}
                          aria-label={`View ${user.display_name || user.email}`}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
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
                {canDeleteUsers && (
                  <button
                    onClick={() => handleDelete(user.id, user.display_name || user.email)}
                    disabled={deleting}
                    aria-label={`Delete ${user.display_name || user.email}`}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 'var(--radius)',
                      padding: 'var(--space-xs) var(--space-sm)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-danger)',
                    }}
                  >
                    Delete
                  </button>
                )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data.total > 20 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Pagination
                page={page}
                pageSize={20}
                total={data.total}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
