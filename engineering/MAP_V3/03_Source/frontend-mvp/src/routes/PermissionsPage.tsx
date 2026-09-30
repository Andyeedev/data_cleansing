import { useState, useEffect } from 'react';
import { apiGet } from '../utils/apiClient';
import { useRoleList } from '../hooks/useRoles';
import {
  usePermissionList,
  useAssignPermission,
  useRemovePermission,
} from '../hooks/usePermissions';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { ErrorState, LoadingSkeleton, EmptyState } from '../components/shared';

interface RoleGrant {
  id: string;
  name: string;
  resource: string;
  action: string;
  category?: string | null;
  granted?: boolean | null;
}

/**
 * Phase E (E3) — Permissions rewritten on the canonical platform store.
 *
 * Shows per-role resource:action grants backed by GET /roles,
 * GET /roles/{id}/permissions, GET /roles/permissions/list,
 * POST /roles/{id}/permissions and DELETE /roles/{id}/permissions/{pid}.
 * The legacy report-pack matrix writer and reset UI are removed; the
 * core.role_permissions table stays read-only for existing report
 * consumers (no removal, no new tables).
 * Route guard is Super-Admin-only, so no in-page role gate is needed.
 */
export function PermissionsPage() {
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useRoleList({
    page: 1,
    page_size: 100,
  });
  const { data: catalog, loading: catalogLoading, error: catalogError } = usePermissionList();
  const { assign, loading: assigning } = useAssignPermission();
  const { remove, loading: removing } = useRemovePermission();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [grants, setGrants] = useState<RoleGrant[]>([]);
  const [grantsLoading, setGrantsLoading] = useState(false);
  const [grantsError, setGrantsError] = useState<string | null>(null);
  const [resourceFilter, setResourceFilter] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const roles = rolesData?.roles ?? [];

  useEffect(() => {
    if (!selectedRoleId && roles.length > 0) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleId) return;
    let cancelled = false;
    setGrantsLoading(true);
    setGrantsError(null);
    apiGet<RoleGrant[]>(`/roles/${selectedRoleId}/permissions`)
      .then((res) => {
        if (!cancelled) setGrants(res || []);
      })
      .catch((err) => {
        if (!cancelled) setGrantsError(err instanceof Error ? err.message : 'Failed to load grants');
      })
      .finally(() => {
        if (!cancelled) setGrantsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRoleId]);

  const reloadGrants = async () => {
    if (!selectedRoleId) return;
    setGrantsLoading(true);
    try {
      const res = await apiGet<RoleGrant[]>(`/roles/${selectedRoleId}/permissions`);
      setGrants(res || []);
    } catch (err) {
      setGrantsError(err instanceof Error ? err.message : 'Failed to load grants');
    } finally {
      setGrantsLoading(false);
    }
  };

  const assignedIds = new Set(grants.filter((g) => g.granted !== false).map((g) => g.id));
  const available = (catalog || []).filter((p) => !assignedIds.has(p.id));
  const resources = Array.from(new Set((catalog || []).map((p) => p.resource))).sort();
  const visibleAvailable = resourceFilter ? available.filter((p) => p.resource === resourceFilter) : available;
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handleAssign = async (permissionId: string) => {
    if (!selectedRoleId) return;
    setActionError(null);
    const ok = await assign(selectedRoleId, { permission_id: permissionId, granted: true });
    if (ok) await reloadGrants();
    else setActionError('Failed to assign permission');
  };

  const handleRemove = async (permissionId: string) => {
    if (!selectedRoleId) return;
    setActionError(null);
    const ok = await remove(selectedRoleId, permissionId);
    if (ok) await reloadGrants();
    else setActionError('Failed to remove permission');
  };

  const loading = rolesLoading || catalogLoading;
  const error = rolesError || catalogError;

  return (
    <PageContainer>
      <PageHeader
        title="Permissions"
        description="Canonical platform grants per role. Changes apply immediately through the role-permission APIs."
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6 text-sm text-blue-800">
        Grants shown here are the authoritative platform permissions. The legacy report-pack
        matrix writer has been retired; existing report consumers keep read-only compatibility.
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} variant="table" />
      ) : error ? (
        <ErrorState message={error} />
      ) : roles.length === 0 ? (
        <EmptyState title="No roles found" description="Create a role before managing grants." />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                aria-label="Select role"
                className="mt-1 block w-64 rounded border border-gray-300 px-2 py-1.5 text-sm"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                    {role.is_system ? ' (system)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Filter resource</label>
              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                aria-label="Filter by resource"
                className="mt-1 block w-48 rounded border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="">All resources</option>
                {resources.map((resource) => (
                  <option key={resource} value={resource}>
                    {resource}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {actionError && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{actionError}</div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">
                Assigned grants{selectedRole ? ` — ${selectedRole.name}` : ''}
              </h2>
            </div>
            {grantsLoading ? (
              <LoadingSkeleton rows={3} variant="list" />
            ) : grantsError ? (
              <div className="p-4"><ErrorState message={grantsError} onRetry={reloadGrants} /></div>
            ) : grants.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No grants assigned to this role.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {grants.map((grant) => (
                  <li key={grant.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{grant.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {grant.resource}:{grant.action}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(grant.id)}
                      disabled={removing}
                      aria-label={`Remove ${grant.name}`}
                      className="px-2.5 py-0.5 text-xs font-medium rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Available permissions</h2>
            </div>
            {visibleAvailable.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">All permissions are assigned{resourceFilter ? ' for this resource' : ''}.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {visibleAvailable.map((perm) => (
                  <li key={perm.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{perm.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {perm.resource}:{perm.action}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAssign(perm.id)}
                      disabled={assigning}
                      aria-label={`Assign ${perm.name}`}
                      className="px-2.5 py-0.5 text-xs font-medium rounded border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default PermissionsPage;
