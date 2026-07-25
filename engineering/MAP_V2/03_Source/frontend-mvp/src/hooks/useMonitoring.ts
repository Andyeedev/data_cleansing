import { useState, useCallback, useEffect } from 'react';

const API_BASE = '/api/v1';

export interface PerformanceMetrics {
  total_executions: number;
  active_executions: number;
  completed_executions: number;
  failed_executions: number;
  avg_execution_time: number | null;
}

export interface QueueStatus {
  total_items: number;
  running: number;
  pending: number;
  items: Array<{
    batch_id: string;
    project_id: string | null;
    status: string;
    queued_at: string | null;
  }>;
}

export interface Alert {
  id: string;
  severity: string;
  message: string;
  timestamp: string | null;
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
}

export interface OperationalLog {
  timestamp: string;
  level: string;
  message: string;
  details: Record<string, unknown> | null;
}

export interface LogsResponse {
  logs: OperationalLog[];
  total: number;
}

export function useMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [logs, setLogs] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/monitoring/metrics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.data) setMetrics(data.data);
    } catch (err) {
      // Silent fail for metrics
    }
  }, []);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/monitoring/queue`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.data) setQueue(data.data);
    } catch (err) {
      // Silent fail for queue
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/monitoring/alerts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.data) setAlerts(data.data);
    } catch (err) {
      // Silent fail for alerts
    }
  }, []);

  const fetchLogs = useCallback(async (limit = 50) => {
    try {
      const res = await fetch(`${API_BASE}/monitoring/logs?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.data) setLogs(data.data);
    } catch (err) {
      // Silent fail for logs
    }
  }, []);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchMetrics(), fetchQueue(), fetchAlerts(), fetchLogs()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  }, [fetchMetrics, fetchQueue, fetchAlerts, fetchLogs]);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return {
    metrics,
    queue,
    alerts,
    logs,
    loading,
    error,
    refetch: refetchAll,
  };
}