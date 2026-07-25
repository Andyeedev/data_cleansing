import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut } from '../utils/apiClient';
import type { Approval, ApprovalListResponse, ApprovalCreateRequest, ApprovalDecisionRequest } from '../types/approvals';

export function useApprovalList(params?: { page?: number; page_size?: number; status?: string; assigned_to?: string }) {
  const [data, setData] = useState<ApprovalListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<ApprovalListResponse>('/approvals', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.status, params?.assigned_to]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return { data, loading, error, refetch: fetchApprovals };
}

export function useApprovalDetail(approvalId: string | null) {
  const [data, setData] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!approvalId) return;

    setLoading(true);
    setError(null);
    apiGet<Approval>(`/approvals/${approvalId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch approval'))
      .finally(() => setLoading(false));
  }, [approvalId]);

  return { data, loading, error };
}

export function usePendingApprovalCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<number>('/approvals/pending/count');
      setCount(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending count');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
}

export function useCreateApproval() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: ApprovalCreateRequest): Promise<Approval | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<Approval>('/approvals', payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create approval');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useApproveRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (approvalId: string, payload?: ApprovalDecisionRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPut(`/approvals/${approvalId}/approve`, payload || {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}

export function useRejectRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(async (approvalId: string, payload?: ApprovalDecisionRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiPut(`/approvals/${approvalId}/reject`, payload || {});
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}
