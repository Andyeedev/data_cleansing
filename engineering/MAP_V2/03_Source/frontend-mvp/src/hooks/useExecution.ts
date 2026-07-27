import { useState, useCallback, useRef, useEffect } from 'react';
import type { ExecutionRunResponse, ExecutionBatchStatus } from '../types/execution';

const API_BASE = '/api/v1';

export function useRunExecution() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (projectId: string): Promise<ExecutionRunResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const res = await fetch(`${API_BASE}/execution/run?project_id=${encodeURIComponent(projectId)}`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start execution');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}

export function usePollBatchStatus() {
  const [status, setStatus] = useState<ExecutionBatchStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async (batchId: string): Promise<ExecutionBatchStatus | null> => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      
      const res = await fetch(`${API_BASE}/execution/status/${batchId}`, { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const batchStatus: ExecutionBatchStatus = {
        batch_id: data.batch_id,
        status: data.status,
        total_controls: data.total_controls,
        completed_controls: data.completed_controls,
        failed_controls: data.failed_controls,
        progress: data.progress,
      };
      setStatus(batchStatus);
      return batchStatus;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
      return null;
    }
  }, []);

  const startPolling = useCallback((batchId: string, intervalMs = 2000) => {
    stopPolling();
    setLoading(true);
    setError(null);

    const poll = async () => {
      const result = await fetchStatus(batchId);
      if (result && (result.status === 'COMPLETED' || result.status === 'FAILED' || result.status === 'NOT_FOUND')) {
        stopPolling();
        setLoading(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, intervalMs);
  }, [fetchStatus, stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { status, loading, error, startPolling, stopPolling };
}
