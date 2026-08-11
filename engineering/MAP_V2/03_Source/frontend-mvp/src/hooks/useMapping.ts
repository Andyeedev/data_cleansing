import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/apiClient';
import type { MappingSummary, MappingRow, MappingSchemaEntry } from '../types/mapping';

export function useMappingSummary(tenantId?: string) {
  const [data, setData] = useState<MappingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '?all_tenants=true';
      const result = await apiGet<MappingSummary>(`/mappings/summary${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useMappingColumns(tenantId?: string) {
  const [data, setData] = useState<MappingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '?all_tenants=true';
      const result = await apiGet<MappingRow[]>(`/mappings/columns${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useMappingSchema(tenantId?: string) {
  const [data, setData] = useState<MappingSchemaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '?all_tenants=true';
      const result = await apiGet<MappingSchemaEntry[]>(`/mappings/schema${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schema');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useAutoMap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoMap = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost('/mappings/auto-map', {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auto-map failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { autoMap, loading, error };
}

export function useSaveMappings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (columns: Partial<MappingRow>[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost('/mappings/columns', columns);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { save, loading, error };
}

export function useValidateMapping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (): Promise<{ valid: boolean; issues: unknown[]; total_columns: number; type_mismatches: number } | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost('/mappings/validate', {});
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { validate, loading, error };
}

// =========================
// REF 2: Columns with pending table pairs
// =========================
export function useMappingColumnsWithPending(tenantId?: string) {
  const [data, setData] = useState<MappingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : '?all_tenants=true';
      const result = await apiGet<MappingRow[]>(`/mappings/columns/all${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// =========================
// REF 1: Clear pair / Clear all
// =========================
export function useClearPairMapping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearPair = useCallback(async (mappingId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost('/mappings/clear-pair', { mapping_id: mappingId });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Clear pair failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clearPair, loading, error };
}

export function useClearAllMappings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAll = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost('/mappings/clear-all', {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Clear all failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clearAll, loading, error };
}
