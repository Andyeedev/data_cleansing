import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/apiClient';
import type { ReportSuite } from '../types/reportSuite';

interface UseReportSuiteResult {
  data: ReportSuite | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReportSuite(tenantId?: string, batchId?: string): UseReportSuiteResult {
  const [data, setData] = useState<ReportSuite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (tenantId) params.set('tenant_id', tenantId);
      if (batchId) params.set('batch_id', batchId);
      const qs = params.toString();
      const result = await apiGet<ReportSuite>(`/reports/suite${qs ? `?${qs}` : ''}`);
      setData(result);
    } catch (err: any) {
      const code = err?.response?.status;
      setError(
        code === 401
          ? 'Unauthorized - please log in'
          : err instanceof Error
            ? err.message
            : 'Failed to load report suite'
      );
    } finally {
      setLoading(false);
    }
  }, [tenantId, batchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
