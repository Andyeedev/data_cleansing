import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type { System, SystemDetail, TestConnectionResponse, SystemCreateRequest, UpdateSystemRequest } from '../types/systems';

export function useSystemList(tenantId?: string) {
  const [data, setData] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      const result = await apiGet<System[]>(`/systems${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch systems');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  return { data, loading, error, refetch: fetchSystems };
}

export function useSystemDetail(systemId: string | null, tenantId?: string) {
  const [data, setData] = useState<SystemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;

    setLoading(true);
    setError(null);
    const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
    apiGet<SystemDetail>(`/systems/${systemId}${qs}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch system'))
      .finally(() => setLoading(false));
  }, [systemId, tenantId]);

  return { data, loading, error };
}

export function useTestConnection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async (systemId: string, tenantId?: string): Promise<TestConnectionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      const result = await apiGet<TestConnectionResponse>(`/systems/${systemId}/test${qs}`);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { testConnection, loading, error };
}

export function useCreateSystem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: SystemCreateRequest): Promise<System | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<{ message: string; system_id: string }>('/systems', payload);
      return { system_id: result.system_id, ...payload, credential_id: null } as System;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create system');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateSystem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (systemId: string, payload: UpdateSystemRequest, tenantId?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      await apiPut(`/systems/${systemId}${qs}`, payload);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update system');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteSystem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (systemId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/systems/${systemId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete system');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
