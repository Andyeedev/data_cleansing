import { useState, useCallback, useEffect } from 'react';
import type { OperationsMetrics } from '../types/OperationsMetrics';
import type { OperationsQueueItem, OperationsAlert, OperationsActivityItem, OperationsSystemHealth } from '../types/OperationsQueue';
import { defaultOperationsMetrics } from '../types/OperationsMetrics';

const buildQueue = (): OperationsQueueItem[] => [
  { id: 'q1', name: 'Customer Migration Batch 18', type: 'execution', status: 'running', priority: 'high', dataset: 'Customer Data', project: 'Core Migration', createdAt: '10 min ago', startedAt: '8 min ago' },
  { id: 'q2', name: 'Transaction Validation Run', type: 'execution', status: 'running', priority: 'high', dataset: 'Transaction Data', createdAt: '15 min ago', startedAt: '12 min ago' },
  { id: 'q3', name: 'Account Data Sync', type: 'execution', status: 'queued', priority: 'medium', dataset: 'Account Data', createdAt: '5 min ago' },
  { id: 'q4', name: 'Product Catalog Migration', type: 'execution', status: 'queued', priority: 'medium', dataset: 'Product Data', createdAt: '20 min ago' },
  { id: 'q5', name: 'Retry: Customer Batch 17', type: 'retry', status: 'queued', priority: 'high', dataset: 'Customer Data', error: 'Validation timeout', createdAt: '30 min ago' },
  { id: 'q6', name: 'Retry: Transaction Batch 12', type: 'retry', status: 'queued', priority: 'medium', dataset: 'Transaction Data', error: 'Connection reset', createdAt: '45 min ago' },
  { id: 'q7', name: 'Scheduled: Nightly Audit', type: 'scheduled', status: 'waiting', priority: 'low', createdAt: '1 hour ago' },
  { id: 'q8', name: 'Priority: Regulatory Report', type: 'priority', status: 'queued', priority: 'high', dataset: 'Compliance Data', createdAt: '2 min ago' },
];

const buildAlerts = (): OperationsAlert[] => [
  { id: 'a1', type: 'critical', title: 'Validation Timeout', message: 'Customer Migration Batch 17 exceeded timeout threshold', timestamp: '30 min ago', severity: 'high', acknowledged: false, source: 'Validation Engine' },
  { id: 'a2', type: 'warning', title: 'Retry Queue Growing', message: '5 items in retry queue, up from 2 yesterday', timestamp: '1 hour ago', severity: 'medium', acknowledged: false, source: 'Queue Monitor' },
  { id: 'a3', type: 'validation', title: 'Validation Errors', message: '2 new validation errors in Transaction Data', timestamp: '2 hours ago', severity: 'medium', acknowledged: true, source: 'Validation Engine' },
  { id: 'a4', type: 'info', title: 'Scheduled Maintenance', message: 'Database maintenance window tonight 02:00-04:00 UTC', timestamp: '4 hours ago', severity: 'low', acknowledged: true, source: 'System' },
];

const buildActivity = (): OperationsActivityItem[] => [
  { id: 'act1', type: 'execution', title: 'Execution Completed', description: 'Customer Migration Batch 16 completed successfully', timestamp: '5 min ago', status: 'success' },
  { id: 'act2', type: 'dataset', title: 'Dataset Loaded', description: 'Transaction Data v2.3 loaded (1.2 GB)', timestamp: '15 min ago', status: 'success' },
  { id: 'act3', type: 'rule', title: 'Rule Updated', description: 'Validation rule VR-042 updated for new field mapping', timestamp: '1 hour ago', status: 'info' },
  { id: 'act4', type: 'execution', title: 'Execution Failed', description: 'Customer Migration Batch 17 failed - timeout', timestamp: '30 min ago', status: 'error' },
  { id: 'act5', type: 'report', title: 'Report Generated', description: 'Daily Operations Summary report ready', timestamp: '2 hours ago', status: 'info' },
];

const buildSystemHealth = (m: OperationsMetrics): OperationsSystemHealth[] => [
  { component: 'API Gateway', status: m.apiStatus, latency: '12ms', uptime: '99.99%', lastChecked: 'Just now' },
  { component: 'Database', status: m.databaseStatus, latency: '8ms', uptime: '99.98%', lastChecked: 'Just now' },
  { component: 'Queue Service', status: m.queueStatus, latency: '3ms', uptime: '99.97%', lastChecked: 'Just now' },
  { component: 'AI Engine', status: m.aiStatus, latency: '45ms', uptime: '99.95%', lastChecked: 'Just now' },
  { component: 'Validation Engine', status: 'healthy', latency: '15ms', uptime: '99.99%', lastChecked: 'Just now' },
  { component: 'Workflow Engine', status: 'healthy', latency: '10ms', uptime: '99.98%', lastChecked: 'Just now' },
];

export const useOperationsDashboard = () => {
  const [metrics] = useState<OperationsMetrics>(defaultOperationsMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queue = buildQueue();
  const alerts = buildAlerts();
  const activities = buildActivity();
  const systemHealth = buildSystemHealth(metrics);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    metrics,
    queue,
    alerts,
    activities,
    systemHealth,
    isLoading,
    error,
    refresh,
  };
};
