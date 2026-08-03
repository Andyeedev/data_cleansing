import { useState, useCallback, useRef } from 'react';

const API_BASE = '/api/v1';

export interface ExecutionHistoryItem {
  batch_id: string;
  project_id: string | null;
  batch_status: string | null;
  total_controls: number | null;
  completed_controls: number | null;
  failed_controls: number | null;
  batch_start_time: string | null;
  batch_end_time: string | null;
}

interface ExecutionHistoryResponse {
  success: boolean;
  data: {
    items: ExecutionHistoryItem[];
    total: number;
    page: number;
    page_size: number;
  };
}

export function useExecutionHistory() {
  const [items, setItems] = useState<ExecutionHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  const fetchHistory = useCallback(async (pageNum: number = 1, tenantId?: string, newPageSize?: number, status?: string, search?: string, sortBy?: string, sortDir?: string) => {
    const effectivePageSize = newPageSize ?? pageSizeRef.current;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      
      let url = `${API_BASE}/execution/history?page=${pageNum}&page_size=${effectivePageSize}`;
      if (tenantId) {
        url += `&tenant_id=${tenantId}`;
      }
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (sortBy) {
        url += `&sort_by=${sortBy}`;
      }
      if (sortDir) {
        url += `&sort_dir=${sortDir}`;
      }
      
      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json: ExecutionHistoryResponse = await res.json();
      if (json.success && json.data) {
        setItems(json.data.items);
        setTotal(json.data.total);
        setPage(json.data.page);
        if (newPageSize !== undefined) {
          setPageSize(newPageSize);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, total, page, pageSize, loading, error, fetchHistory, setPage, setPageSize };
}
