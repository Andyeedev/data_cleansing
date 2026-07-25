import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleList, useDeleteRole } from '../hooks/useRoles';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

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
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Roles</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Roles</h1>
        <button
          onClick={() => navigate('/administration/roles/new')}
          style={{
            padding: '8px 16px',
            background: 'var(--color-sidebar-active)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Add Role
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <>
          {data.roles.length === 0 ? (
            <div style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No roles found</p>
              <p style={{ fontSize: 14 }}>Create your first role to get started</p>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>System</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.roles.map((role) => (
                    <tr
                      key={role.id}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => navigate(`/administration/roles/${role.id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-sidebar-active)',
                            cursor: 'pointer',
                            fontSize: 14,
                            padding: 0,
                            textDecoration: 'underline',
                          }}
                        >
                          {role.name}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{role.description || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#6366f1',
                        }}>
                          {role.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: role.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: role.status === 'active' ? '#22c55e' : '#ef4444',
                        }}>
                          {role.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                        {role.is_system ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/administration/roles/${role.id}`)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 12,
                            marginRight: 8,
                            color: 'var(--color-text)',
                          }}
                        >
                          View
                        </button>
                        {!role.is_system && (
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            disabled={deleting}
                            style={{
                              background: 'none',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: 'var(--radius)',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 12,
                              color: '#ef4444',
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page >= Math.ceil(data.total / 20) ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(data.total / 20) ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
