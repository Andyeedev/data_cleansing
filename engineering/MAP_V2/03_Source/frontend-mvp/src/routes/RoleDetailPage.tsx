import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole, useRolePermissions, useUpdateRole, useDeleteRole } from '../hooks/useRoles';
import { usePermissionList, useAssignPermission, useRemovePermission } from '../hooks/usePermissions';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRoles } = useAuth();

  const { data: role, loading, error } = useRole(id ?? null);
  const { data: rolePermissions, loading: rolePermsLoading, refetch: refetchRolePerms } = useRolePermissions(id ?? null);
  const { data: allPermissions, loading: allPermsLoading } = usePermissionList();
  const { update, loading: updating } = useUpdateRole();
  const { remove, loading: deleting } = useDeleteRole();
  const { assign, loading: assigning } = useAssignPermission();
  const { remove: removePerm, loading: removing } = useRemovePermission();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: '',
  });

  const startEditing = () => {
    if (!role) return;
    setForm({
      name: role.name,
      description: role.description || '',
      status: role.status,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!id) return;
    const result = await update(id, form);
    if (result) setEditing(false);
  };

  const handleDelete = async () => {
    if (!id || !role) return;
    if (!confirm(`Delete role "${role.name}"?`)) return;
    const success = await remove(id);
    if (success) navigate('/administration/roles');
  };

  const handleAssignPermission = async (permissionId: string) => {
    if (!id) return;
    const success = await assign(id, { permission_id: permissionId, granted: true });
    if (success) refetchRolePerms();
  };

  const handleRemovePermission = async (permissionId: string) => {
    if (!id) return;
    if (!confirm('Remove this permission?')) return;
    const success = await removePerm(id, permissionId);
    if (success) refetchRolePerms();
  };

  const assignedPermissionIds = new Set(rolePermissions.map(p => p.id));
  const availablePermissions = allPermissions.filter(p => !assignedPermissionIds.has(p.id));

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Role Detail</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!role) return <ErrorMessage message="Role not found" />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <button
            onClick={() => navigate('/administration/roles')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-sidebar-active)',
              cursor: 'pointer',
              fontSize: 14,
              padding: 0,
              marginBottom: 8,
            }}
          >
            ← Back to Roles
          </button>
          <h1 style={{ fontSize: 24, margin: 0 }}>{role.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!editing ? (
            <button
              onClick={startEditing}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
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
                {updating ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
          {!role.is_system && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '8px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Role Details */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text-secondary)' }}>Role Information</h2>
        
        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Name</div>
              <div style={{ fontSize: 14 }}>{role.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Type</div>
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
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</div>
              <div style={{ fontSize: 14 }}>{role.description || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</div>
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
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>System Role</div>
              <div style={{ fontSize: 14 }}>{role.is_system ? 'Yes' : 'No'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Created</div>
              <div style={{ fontSize: 14 }}>{new Date(role.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Assigned Permissions */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text-secondary)' }}>Assigned Permissions</h2>
        
        {rolePermsLoading ? (
          <LoadingSpinner />
        ) : rolePermissions.length === 0 ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: 14 }}>No permissions assigned</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rolePermissions.map((perm) => (
              <div
                key={perm.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{perm.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                    {perm.resource}:{perm.action} ({perm.category})
                  </div>
                </div>
                <button
                  onClick={() => handleRemovePermission(perm.id)}
                  disabled={removing}
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
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Permissions */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text-secondary)' }}>Available Permissions</h2>
        
        {allPermsLoading ? (
          <LoadingSpinner />
        ) : availablePermissions.length === 0 ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: 14 }}>All permissions are assigned</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {availablePermissions.map((perm) => (
              <div
                key={perm.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{perm.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                    {perm.resource}:{perm.action} ({perm.category})
                  </div>
                </div>
                <button
                  onClick={() => handleAssignPermission(perm.id)}
                  disabled={assigning}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 'var(--radius)',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#22c55e',
                  }}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
