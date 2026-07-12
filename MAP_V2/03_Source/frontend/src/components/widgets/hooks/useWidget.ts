import { useState, useCallback, useEffect, useRef } from 'react';
import type { WidgetConfig, WidgetState } from '../types/WidgetTypes';

interface UseWidgetOptions {
  config: WidgetConfig;
  fetchData?: () => Promise<unknown>;
  autoRefresh?: boolean;
}

interface UseWidgetReturn {
  state: WidgetState;
  data: unknown;
  error: string | null;
  refresh: () => Promise<void>;
  setState: (state: WidgetState) => void;
  setData: (data: unknown) => void;
  setError: (error: string | null) => void;
}

export const useWidget = ({
  config,
  fetchData,
  autoRefresh = true,
}: UseWidgetOptions): UseWidgetReturn => {
  const [state, setState] = useState<WidgetState>('idle');
  const [data, setData] = useState<unknown>(undefined);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!fetchData) {
      setState('idle');
      return;
    }

    setState('loading');
    setError(null);

    try {
      const result = await fetchData();
      setData(result);
      setState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      setState('error');
    }
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (fetchData) {
      refresh();
    }
  }, [fetchData, refresh]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !config.refreshInterval) return;

    intervalRef.current = setInterval(() => {
      refresh();
    }, config.refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, config.refreshInterval, refresh]);

  return {
    state,
    data,
    error,
    refresh,
    setState,
    setData,
    setError,
  };
};

// Helper hook for simple widget data fetching
export const useWidgetData = <T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
