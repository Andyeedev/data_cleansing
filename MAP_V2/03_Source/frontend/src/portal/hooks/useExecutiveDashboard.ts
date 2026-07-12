import { useState, useCallback, useEffect } from 'react';
import type { ExecutiveKPIData, ExecutiveActivityItem, ExecutiveReportItem, ExecutiveNotificationItem } from '../types/ExecutiveDashboard';
import type { ExecutiveMetrics } from '../types/ExecutiveMetrics';
import { defaultExecutiveMetrics } from '../types/ExecutiveMetrics';

const buildKPIs = (m: ExecutiveMetrics): ExecutiveKPIData[] => [
  {
    id: 'kpi-health',
    label: 'Migration Health',
    value: `${m.migrationHealth}%`,
    delta: { value: 2.1, direction: 'up', percentage: true },
    trend: [90, 92, 93, 94, 95, 95, 96],
    variant: 'positive',
  },
  {
    id: 'kpi-controls',
    label: 'Control Success Rate',
    value: `${m.controlsPassed}%`,
    delta: { value: 0.3, direction: 'up', percentage: true },
    trend: [98.5, 99.0, 99.2, 99.3, 99.4, 99.5, 99.6],
    variant: 'positive',
  },
  {
    id: 'kpi-projects',
    label: 'Projects',
    value: m.projects,
    delta: { value: 2, direction: 'up', percentage: false },
    trend: [8, 9, 10, 10, 11, 11, 12],
    variant: 'positive',
  },
  {
    id: 'kpi-datasets',
    label: 'Datasets',
    value: m.datasets.toLocaleString(),
    delta: { value: 47, direction: 'up', percentage: false },
    trend: [700, 720, 750, 780, 800, 830, 847],
    variant: 'positive',
  },
  {
    id: 'kpi-rules',
    label: 'Rules Executed',
    value: m.rulesExecuted.toLocaleString(),
    delta: { value: 142, direction: 'up', percentage: false },
    trend: [1400, 1500, 1600, 1680, 1750, 1800, 1842],
    variant: 'positive',
  },
  {
    id: 'kpi-controls-exec',
    label: 'Controls Executed',
    value: m.controlsExecuted.toLocaleString(),
    delta: { value: 98, direction: 'up', percentage: false },
    trend: [1500, 1600, 1680, 1720, 1780, 1820, 1842],
    variant: 'positive',
  },
  {
    id: 'kpi-failures',
    label: 'Failures',
    value: m.failures,
    delta: { value: 1, direction: 'down', percentage: false },
    trend: [8, 6, 5, 4, 3, 3, 2],
    variant: 'negative',
  },
  {
    id: 'kpi-warnings',
    label: 'Warnings',
    value: m.warnings,
    delta: { value: 3, direction: 'down', percentage: false },
    trend: [25, 22, 20, 18, 16, 15, 14],
    variant: 'warning',
  },
  {
    id: 'kpi-exceptions',
    label: 'Exceptions',
    value: m.exceptions,
    delta: { value: 1, direction: 'down', percentage: false },
    trend: [8, 7, 6, 5, 4, 4, 3],
    variant: 'warning',
  },
  {
    id: 'kpi-audit',
    label: 'Audit Findings',
    value: m.auditFindings,
    delta: { value: 2, direction: 'down', percentage: false },
    trend: [15, 13, 12, 10, 9, 8, 7],
    variant: 'info',
  },
];

const buildActivities = (): ExecutiveActivityItem[] => [
  { id: 'a1', type: 'validation', title: 'Validation Complete', description: 'Customer dataset validation passed all 156 rules', timestamp: '2 min ago', status: 'success' },
  { id: 'a2', type: 'report', title: 'Report Generated', description: 'Weekly Migration Health Report ready for review', timestamp: '15 min ago', status: 'info' },
  { id: 'a3', type: 'execution', title: 'Migration Executed', description: 'Batch 47 of Customer Data migration completed', timestamp: '1 hour ago', status: 'success' },
  { id: 'a4', type: 'exception', title: 'Warning Detected', description: '3 new warnings in Transaction Data validation', timestamp: '2 hours ago', status: 'warning' },
  { id: 'a5', type: 'notification', title: 'System Update', description: 'Validation engine updated to v2.4.1', timestamp: '4 hours ago', status: 'info' },
];

const buildReports = (): ExecutiveReportItem[] => [
  { id: 'r1', name: 'Executive Dashboard', description: 'High-level programme overview', category: 'Executive' },
  { id: 'r2', name: 'Operational Dashboard', description: 'Detailed operational metrics', category: 'Operational' },
  { id: 'r3', name: 'Audit Pack', description: 'Complete audit trail and findings', category: 'Governance' },
  { id: 'r4', name: 'Migration Health', description: 'Migration health score and trends', category: 'Executive' },
  { id: 'r5', name: 'Compliance Summary', description: 'Regulatory compliance status', category: 'Governance' },
  { id: 'r6', name: 'Risk Report', description: 'Risk assessment and mitigation status', category: 'Risk' },
];

const buildNotifications = (): ExecutiveNotificationItem[] => [
  { id: 'n1', type: 'critical', title: 'Critical Risk Identified', message: 'New critical risk in Data Quality domain requires immediate attention', timestamp: '10 min ago', read: false },
  { id: 'n2', type: 'approval', title: 'Approval Required', message: 'Migration batch 48 pending executive approval', timestamp: '1 hour ago', read: false },
  { id: 'n3', type: 'review', title: 'Review Requested', message: 'Weekly compliance report ready for review', timestamp: '3 hours ago', read: true },
  { id: 'n4', type: 'system', title: 'System Maintenance', message: 'Scheduled maintenance window: Saturday 02:00-04:00 UTC', timestamp: '1 day ago', read: true },
];

export const useExecutiveDashboard = () => {
  const [metrics] = useState<ExecutiveMetrics>(defaultExecutiveMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kpis = buildKPIs(metrics);
  const activities = buildActivities();
  const reports = buildReports();
  const notifications = buildNotifications();

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
    kpis,
    activities,
    reports,
    notifications,
    isLoading,
    error,
    refresh,
  };
};
