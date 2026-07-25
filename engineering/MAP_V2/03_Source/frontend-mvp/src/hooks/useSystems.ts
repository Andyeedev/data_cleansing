import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';
import type { System, SystemDetail, TestConnectionResponse } from '../types/systems';

export function useSystemList() {
  const [data, setData] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<System[]>('/systems');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch systems');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  return { data, loading, error, refetch: fetchSystems };
}

export function useSystemDetail(systemId: string | null) {
  const [data, setData] = useState<SystemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;

    setLoading(true);
    setError(null);
    apiGet<SystemDetail>(`/systems/${systemId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch system'))
      .finally(() => setLoading(false));
  }, [systemId]);

  return { data, loading, error };
}

export function useTestConnection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async (systemId: string): Promise<TestConnectionResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<TestConnectionResponse>(`/systems/${systemId}/test`);
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
