import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';
import type { DiscoverySummary, SchemaNode, DiscoveryTableRow } from '../types/discovery';

export function useDiscoverySummary(tenantId?: string) {
  const [data, setData] = useState<DiscoverySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      const result = await apiGet<DiscoverySummary>(`/discovery/summary${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDiscoveryTree(tenantId?: string) {
  const [data, setData] = useState<SchemaNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      const result = await apiGet<SchemaNode[]>(`/discovery/tree${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tree');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDiscoveryTables(tenantId?: string) {
  const [data, setData] = useState<DiscoveryTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '';
      const result = await apiGet<DiscoveryTableRow[]>(`/discovery/tables${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
