import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/apiClient';
import type { DiagnosticResult, DiagnosticSummary, TestHistoryEntry } from '../types/systems';

export function useDiagnosticSummary(tenantId?: string) {
  const [data, setData] = useState<DiagnosticSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<DiagnosticSummary>('/diagnostics/summary', tenantId ? { tenant_id: tenantId } : undefined);
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

export function useDiagnosticDetail(systemId: string | null, tenantId?: string) {
  const [data, setData] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;
    setLoading(true);
    setError(null);
    apiGet<DiagnosticResult>(`/diagnostics/${systemId}`, tenantId ? { tenant_id: tenantId } : undefined)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch diagnostics'))
      .finally(() => setLoading(false));
  }, [systemId, tenantId]);

  return { data, loading, error };
}

export function useRunDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = useCallback(async (systemId: string, tenantId?: string): Promise<DiagnosticResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<DiagnosticResult>(`/diagnostics/${systemId}/run${tenantId ? `?tenant_id=${encodeURIComponent(tenantId)}` : ''}`);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run diagnostics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { runDiagnostics, loading, error };
}

export function useTestHistory(systemId: string | null, tenantId?: string) {
  const [data, setData] = useState<TestHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;
    setLoading(true);
    setError(null);
    apiGet<TestHistoryEntry[]>(`/diagnostics/${systemId}/history`, tenantId ? { tenant_id: tenantId } : undefined)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch history'))
      .finally(() => setLoading(false));
  }, [systemId, tenantId]);

  return { data, loading, error };
}
