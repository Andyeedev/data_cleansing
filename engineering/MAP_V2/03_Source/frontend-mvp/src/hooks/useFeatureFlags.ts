import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPut } from '../utils/apiClient';
import type { FeatureFlag, FeatureFlagUpdateRequest } from '../types/settings';

export function useFeatureFlagList() {
  const [data, setData] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<FeatureFlag[]>('/settings/flags/list');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feature flags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  return { data, loading, error, refetch: fetchFlags };
}

export function useUpdateFeatureFlag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (key: string, payload: FeatureFlagUpdateRequest): Promise<FeatureFlag | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<FeatureFlag>(`/settings/flags/${key}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature flag');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
