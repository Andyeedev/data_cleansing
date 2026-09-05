/*
Tenant hook for the Validation module.
*/
import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

export interface Tenant {
  tenant_id: string;
  tenant_name: string;
}

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<Tenant[]>('/rules/tenants');
      setTenants(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load tenants');
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refetch: fetchTenants };
}
