import { useState, useCallback } from 'react';

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
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/execution/history?page=${pageNum}&page_size=${pageSize}`
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json: ExecutionHistoryResponse = await res.json();
      if (json.success && json.data) {
        setItems(json.data.items);
        setTotal(json.data.total);
        setPage(json.data.page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  return { items, total, page, pageSize, loading, error, fetchHistory, setPage };
}
