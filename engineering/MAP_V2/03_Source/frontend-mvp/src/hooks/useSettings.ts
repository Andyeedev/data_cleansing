import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPut } from '../utils/apiClient';
import type { Setting, SettingUpdateRequest, SettingsByCategory } from '../types/settings';

export function useSettingList(category?: string) {
  const [data, setData] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<Setting[]>('/settings', category ? { category } : undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { data, loading, error, refetch: fetchSettings };
}

export function useCategorySettings(category: string | null) {
  const [data, setData] = useState<SettingsByCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError(null);
    apiGet<SettingsByCategory>(`/settings/${category}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch category settings'))
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}

export function useUpdateSetting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (category: string, key: string, payload: SettingUpdateRequest): Promise<Setting | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<Setting>(`/settings/${category}/${key}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
