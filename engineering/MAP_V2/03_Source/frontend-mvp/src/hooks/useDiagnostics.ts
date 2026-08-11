import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/apiClient';
import type { DiagnosticResult, DiagnosticSummary, TestHistoryEntry } from '../types/systems';

export function useDiagnosticSummary() {
  const [data, setData] = useState<DiagnosticSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<DiagnosticSummary>('/diagnostics/summary');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDiagnosticDetail(systemId: string | null) {
  const [data, setData] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;
    setLoading(true);
    setError(null);
    apiGet<DiagnosticResult>(`/diagnostics/${systemId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch diagnostics'))
      .finally(() => setLoading(false));
  }, [systemId]);

  return { data, loading, error };
}

export function useRunDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = useCallback(async (systemId: string): Promise<DiagnosticResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<DiagnosticResult>(`/diagnostics/${systemId}/run`);
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

export function useTestHistory(systemId: string | null) {
  const [data, setData] = useState<TestHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!systemId) return;
    setLoading(true);
    setError(null);
    apiGet<TestHistoryEntry[]>(`/diagnostics/${systemId}/history`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch history'))
      .finally(() => setLoading(false));
  }, [systemId]);

  return { data, loading, error };
}
