import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet, apiPost } from '../utils/apiClient';
import type {
  ValidationDashboard,
  ValidationReport,
  GovernanceDecision,
  RiskScore,
  ComplianceCheck,
  ExecutionHistoryItem
} from '../types/validation';

export interface StatusBreakdown {
  breakdown: Record<string, number>;
  total: number;
  unscored: number;
  today_breakdown: {
    completed: number;
    scheduled: number;
  };
}

export function useValidationDashboard(tenantId?: string) {
  const [data, setData] = useState<ValidationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<ValidationDashboard>('/execution/dashboard');
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useValidationReport(batchId: string | null) {
  const [data, setData] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<ValidationReport>(`/execution/${batchId}/report`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useGovernanceDecision(batchId: string | null) {
  const [data, setData] = useState<GovernanceDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<GovernanceDecision>(`/execution/${batchId}/governance`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch governance');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useRiskScore(batchId: string | null) {
  const [data, setData] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<RiskScore>(`/execution/${batchId}/risk-score`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk score');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useComplianceChecks(batchId: string | null) {
  const [data, setData] = useState<ComplianceCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<ComplianceCheck>(`/execution/${batchId}/compliance`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useExecutionHistory(
  page: number = 1,
  pageSize: number = 20,
  tenantId?: string,
  status?: string,
  search?: string,
  sortBy?: string,
  sortDir?: string
) {
  const [data, setData] = useState<{ items: ExecutionHistoryItem[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('page_size', String(pageSize));
      if (tenantId) params.set('tenant_id', tenantId);
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      if (sortBy) params.set('sort_by', sortBy);
      if (sortDir) params.set('sort_dir', sortDir);
      const qs = params.toString();
      const result = await apiGet<{ items: ExecutionHistoryItem[]; total: number }>(`/execution/history?${qs}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, tenantId, status, search, sortBy, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

export function useExecutionControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(async (batchId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost(`/execution/${batchId}/cancel`, {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(async (batchId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPost(`/execution/${batchId}/retry`, {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, retry, loading, error };
}

export function useAutoRefresh(dashboardHook: () => ReturnType<typeof useValidationDashboard>, intervalMs: number = 10000) {
  const { data, loading, error, refetch } = dashboardHook();
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRefresh = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      refetch();
    }, intervalMs);
    setIsLive(true);
  }, [refetch, intervalMs]);

  const stopRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLive(false);
  }, []);

  const toggleRefresh = useCallback(() => {
    if (isLive) {
      stopRefresh();
    } else {
      startRefresh();
    }
  }, [isLive, startRefresh, stopRefresh]);

  useEffect(() => {
    startRefresh();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startRefresh]);

  return { data, loading, error, refetch, isLive, toggleRefresh };
}

export function useStatusBreakdown(tenantId?: string) {
  const [data, setData] = useState<StatusBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = tenantId ? `?tenant_id=${tenantId}` : '';
      const result = await apiGet<StatusBreakdown>(`/execution/history/status-breakdown${params}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status breakdown');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
