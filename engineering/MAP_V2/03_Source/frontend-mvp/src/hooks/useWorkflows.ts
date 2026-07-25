import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type { Workflow, WorkflowListResponse, WorkflowCreateRequest, WorkflowUpdateRequest, WorkflowExecuteRequest, WorkflowInstanceListResponse } from '../types/workflows';

export function useWorkflowList(params?: { page?: number; page_size?: number; type?: string; status?: string }) {
  const [data, setData] = useState<WorkflowListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<WorkflowListResponse>('/workflows', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.type, params?.status]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { data, loading, error, refetch: fetchWorkflows };
}

export function useWorkflowDetail(workflowId: string | null) {
  const [data, setData] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workflowId) return;

    setLoading(true);
    setError(null);
    apiGet<Workflow>(`/workflows/${workflowId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch workflow'))
      .finally(() => setLoading(false));
  }, [workflowId]);

  return { data, loading, error };
}

export function useCreateWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: WorkflowCreateRequest): Promise<Workflow | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<Workflow>('/workflows', payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (workflowId: string, payload: WorkflowUpdateRequest): Promise<Workflow | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<Workflow>(`/workflows/${workflowId}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workflow');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (workflowId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/workflows/${workflowId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useExecuteWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (workflowId: string, payload: WorkflowExecuteRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost(`/workflows/${workflowId}/execute`, payload);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

export function useWorkflowInstances(workflowId: string | null) {
  const [data, setData] = useState<WorkflowInstanceListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = useCallback(async () => {
    if (!workflowId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<WorkflowInstanceListResponse>(`/workflows/${workflowId}/instances`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instances');
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  return { data, loading, error, refetch: fetchInstances };
}
