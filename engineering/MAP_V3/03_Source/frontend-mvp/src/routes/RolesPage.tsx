import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleList, useDeleteRole } from '../hooks/useRoles';
import { useAuth } from '../context/AuthContext';
import { ErrorState, LoadingSkeleton, StatusBadge, EmptyState, Pagination } from '../components/shared';

export function RolesPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, loading, error, refetch } = useRoleList({
    page,
    page_size: 20,
    status: statusFilter || undefined,
  });

  const { remove, loading: deleting } = useDeleteRole();

  const handleDelete = async (roleId: string, roleName: string) => {
    if (!confirm(`Delete role "${roleName}"?`)) return;
    const success = await remove(roleId);
    if (success) refetch();
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Roles</h1>
        <ErrorState title="Access Denied" message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Roles</h1>
        <button
          onClick={() => navigate('/administration/roles/new')}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-sidebar-active)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Add Role
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading && <LoadingSkeleton variant="table" rows={5} />}
      {error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <>
          {data.roles.length === 0 ? (
            <EmptyState
              title="No roles found"
              description="Create your first role to get started"
              action={{ label: 'Add Role', onClick: () => navigate('/administration/roles/new') }}
            />
          ) : (
            <div style={{
              border: 'var(--border-width) solid var(--color-border)',
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
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.roles.map((role) => (
                    <tr
                      key={role.id}
                      style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}
                    >
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <button
                          onClick={() => navigate(`/administration/roles/${role.id}`)}
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
                          {role.name}
                        </button>
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
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/administration/roles/${role.id}`)}
                          aria-label={`View ${role.name}`}
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
                        {!role.is_system && (
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            disabled={deleting}
                            aria-label={`Delete ${role.name}`}
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-md)' }}>
            <Pagination
              page={page}
              pageSize={20}
              total={data.total}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
