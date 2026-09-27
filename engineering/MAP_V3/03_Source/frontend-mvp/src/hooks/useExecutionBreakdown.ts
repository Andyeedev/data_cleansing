import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

export type BreakdownRange = 'today' | 'week' | 'all';

export interface BatchStatusBreakdown {
  breakdown: Record<string, number>;
  total: number;
  unscored: number;
  today_breakdown: Record<string, number>;
  time_range: string;
}

/**
 * Phase D — reads the existing batch status-breakdown endpoint
 * (GET /execution/history/status-breakdown?time_range=today|week|all).
 * No new business logic: honest coarse buckets only, no manufactured
 * daily series (the backend exposes no per-day breakdown).
 */
export function useBatchStatusBreakdown(timeRange: BreakdownRange = 'week', tenantId?: string) {
  const [data, setData] = useState<BatchStatusBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakdown = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<BatchStatusBreakdown>('/execution/history/status-breakdown', {
        time_range: timeRange,
        tenant_id: tenantId,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batch activity');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [timeRange, tenantId]);

  useEffect(() => {
    fetchBreakdown();
  }, [fetchBreakdown]);

  return { data, loading, error, refetch: fetchBreakdown };
}
