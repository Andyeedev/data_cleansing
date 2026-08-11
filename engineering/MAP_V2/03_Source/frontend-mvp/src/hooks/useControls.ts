import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPut, apiDelete } from '../utils/apiClient';
import type { ControlItem, ControlsResponse } from '../types/controls';

export function useControls() {
  const [data, setData] = useState<ControlsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchControls = useCallback(async (search?: string, severity?: string, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (severity) params.set('severity', severity);
      if (status) params.set('status', status);
      const qs = params.toString();
      const result = await apiGet<ControlsResponse>(`/validation/controls/${qs ? `?${qs}` : ''}`);
      setData(result);
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to fetch controls'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateControl = useCallback(async (controlId: string, updates: dict): Promise<boolean> => {
    try {
      await apiPut(`/validation/controls/${controlId}/`, updates);
      return true;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to update control');
      return false;
    }
  }, []);

  const deleteControl = useCallback(async (controlId: string): Promise<boolean> => {
    try {
      await apiDelete(`/validation/controls/${controlId}/`);
      return true;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to delete control');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchControls();
  }, [fetchControls]);

  return { data, loading, error, refetch: fetchControls, updateControl, deleteControl };
}
