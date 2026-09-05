import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type { Role, RoleListResponse, RoleCreateRequest, RoleUpdateRequest, Permission } from '../types/role';

export function useRoleList(params?: { page?: number; page_size?: number; status?: string }) {
  const [data, setData] = useState<RoleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RoleListResponse>('/roles', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.status]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { data, loading, error, refetch: fetchRoles };
}

export function useRole(roleId: string | null) {
  const [data, setData] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleId) return;

    setLoading(true);
    setError(null);
    apiGet<Role>(`/roles/${roleId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch role'))
      .finally(() => setLoading(false));
  }, [roleId]);

  return { data, loading, error };
}

export function useRolePermissions(roleId: string | null) {
  const [data, setData] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!roleId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<Permission[]>(`/roles/${roleId}/permissions`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch role permissions');
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { data, loading, error, refetch: fetchPermissions };
}

export function useCreateRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: RoleCreateRequest): Promise<Role | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<Role>('/roles', payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (roleId: string, payload: RoleUpdateRequest): Promise<Role | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<Role>(`/roles/${roleId}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (roleId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/roles/${roleId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
