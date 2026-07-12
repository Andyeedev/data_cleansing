import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  version: number;
  steps: unknown[];
  triggers: unknown[];
  variables: Record<string, unknown>;
  tenant_id: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

interface WorkflowListResponse {
  workflows: Workflow[];
  total: number;
  page: number;
  page_size: number;
}

interface UseWorkflowsOptions {
  type?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export function useWorkflows(options: UseWorkflowsOptions = {}) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.type) params.append('type', options.type);
      if (options.status) params.append('status', options.status);
      if (options.page) params.append('page', String(options.page));
      if (options.page_size) params.append('page_size', String(options.page_size));
      
      const query = params.toString();
      const data = await api.get<WorkflowListResponse>(`/workflows/${query ? `?${query}` : ''}`);
      setWorkflows(data.workflows);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  }, [options.type, options.status, options.page, options.page_size]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  return { workflows, total, loading, error, refetch: fetchWorkflows };
}

export function useWorkflow(workflowId: string | null) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workflowId) {
      setLoading(false);
      return;
    }
    
    const fetchWorkflow = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Workflow>(`/workflows/${workflowId}`);
        setWorkflow(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workflow');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkflow();
  }, [workflowId]);

  return { workflow, loading, error };
}
