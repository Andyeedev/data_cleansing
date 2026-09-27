import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';

interface EntitlementsResponse {
  tenant_id: string;
  entitlements: string[];
}

/**
 * Phase D — reads the effective entitlement set for one tenant via the
 * read-only GET /tenants/{tenant_id}/entitlements endpoint (canonical
 * backend truth; never reconstructed client-side).
 * A null tenant (All-Tenants mode) skips the fetch: entitlements are
 * per-tenant and must never be silently aggregated.
 */
export function useEntitlements(tenantId: string | null) {
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = useCallback(async () => {
    if (!tenantId) {
      setEntitlements([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiGet<EntitlementsResponse>(`/tenants/${tenantId}/entitlements`);
      setEntitlements(result?.entitlements ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entitlements');
      setEntitlements([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  return { entitlements, isLoading, error, refetch: fetchEntitlements };
}
