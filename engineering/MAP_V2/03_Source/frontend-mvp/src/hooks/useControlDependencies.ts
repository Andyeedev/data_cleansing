import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '../utils/apiClient';
import type { ControlDependencyResponse } from '../types/controls';

export function useControlDependencies(projectId?: string | null) {
  const [data, setData] = useState<ControlDependencyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDependencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (projectId) params.project_id = projectId;
      const result = await apiGet<ControlDependencyResponse>('/control-dependencies', params);
      setData(result);
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Failed to fetch dependencies');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const addDependency = useCallback(
    async (controlId: string, dependsOn: string, projId?: string | null): Promise<boolean> => {
      try {
        await apiPost('/control-dependencies', {
          control_id: controlId,
          depends_on: dependsOn,
          project_id: projId || projectId || null,
        });
        await fetchDependencies();
        return true;
      } catch (err: any) {
        setError(err?.detail || 'Failed to add dependency');
        return false;
      }
    },
    [projectId, fetchDependencies]
  );

  const deleteDependency = useCallback(
    async (controlId: string, dependsOn: string, projId?: string | null): Promise<boolean> => {
      try {
        const params = new URLSearchParams({
          control_id: controlId,
          depends_on: dependsOn,
        });
        if (projId || projectId) params.set('project_id', projId || projectId || '');
        await apiDelete(`/control-dependencies?${params.toString()}`);
        await fetchDependencies();
        return true;
      } catch (err: any) {
        setError(err?.detail || 'Failed to delete dependency');
        return false;
      }
    },
    [projectId, fetchDependencies]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchDependencies,
    addDependency,
    deleteDependency,
  };
}
