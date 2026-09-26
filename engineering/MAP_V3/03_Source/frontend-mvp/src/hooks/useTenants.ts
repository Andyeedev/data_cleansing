/*
Tenant directory hook — reads the real tenant source (GET /api/v1/tenants).
Phase B: re-pointed from the wrong `/rules/tenants` source (which returned
only `{tenant_id, tenant_name}`) to the full tenant shape incl. status/plan.
*/
import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

export interface Tenant {
  tenant_id: string;
  tenant_name: string;
  status: string;
  plan_id: string | null;
  billing_email: string | null;
  max_users: number;
  max_projects: number;
  max_connections: number;
  created_at: string;
}

interface TenantListResponse {
  tenants: Tenant[];
  total: number;
  page: number;
  page_size: number;
}

export function useTenants(page = 1, pageSize = 50) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<TenantListResponse>('/tenants', { page, page_size: pageSize });
      setTenants(data?.tenants || []);
      setTotal(data?.total ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tenants');
      setTenants([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, total, loading, error, refetch: fetchTenants };
}
