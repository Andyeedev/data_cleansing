import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '../utils/apiClient';
import type { Permission, PermissionAssignRequest } from '../types/role';

export function usePermissionList() {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<Permission[]>('/roles/permissions/list');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { data, loading, error, refetch: fetchPermissions };
}

export function useAssignPermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assign = useCallback(async (roleId: string, payload: PermissionAssignRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost(`/roles/${roleId}/permissions`, payload);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assign, loading, error };
}

export function useRemovePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (roleId: string, permissionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/roles/${roleId}/permissions/${permissionId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
