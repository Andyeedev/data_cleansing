import { useState, useEffect } from 'react';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { useHealth } from '../hooks/useHealth';
import { useMonitoring } from '../hooks/useMonitoring';
import { useAuth } from '../context/AuthContext';
import { TabBar } from '../components/shared/TabBar';
import { StatusBadge } from '../components/shared/StatusBadge';

import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';

type Tab = 'monitoring' | 'alerts' | 'schedules' | 'retry' | 'health';

interface QueueItem {
  batch_id: string;
  project_id: string | null;
  status: string;
  queued_at: string | null;
}

const tabs = [
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'schedules', label: 'Schedules' },
  { key: 'retry', label: 'Retry' },
  { key: 'health', label: 'Health' },
];

export function OperationsPage() {
  const { userRoles } = useAuth();
  const { items: executions, loading: executionsLoading, error: executionsError, fetchHistory } = useExecutionHistory();
  const { health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();
  const { metrics: _metrics, queue, alerts, loading: monitoringLoading, error: monitoringError, refetch: refetchMonitoring } = useMonitoring();

  const [activeTab, setActiveTab] = useState<Tab>('monitoring');

  useEffect(() => {
    if (activeTab === 'monitoring') {
      refetchHealth();
      refetchMonitoring();
      fetchHistory();
    } else if (activeTab === 'health') {
      refetchHealth();
    }
  }, [activeTab, refetchHealth, refetchMonitoring, fetchHistory]);

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Operations</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-sm)' }}>Operations</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Monitoring, alerts, schedules, retry, and system health.
      </p>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(key) => setActiveTab(key as Tab)} />

      {(healthError || monitoringError || executionsError) && (
        <ErrorState message={healthError || monitoringError || executionsError || ''} />
      )}

      {activeTab === 'monitoring' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>System Health</h3>
            {healthLoading && <LoadingSkeleton rows={2} variant="list" />}
            {health && (
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: health.database ? 'var(--color-success)' : 'var(--color-danger)' }} />
                  <span>Database</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: health.api ? 'var(--color-success)' : 'var(--color-danger)' }} />
                  <span>API</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Active Queue</h3>
            {monitoringLoading && <LoadingSkeleton rows={3} variant="list" />}
            {queue && queue.items.length === 0 && <EmptyState title="No active items" description="Queue is empty." />}
            {queue?.items.map((item: QueueItem) => (
              <div key={item.batch_id} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'monospace' }}>{item.batch_id.slice(0, 8)}...</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{item.project_id}</div>
                </div>
                <StatusBadge status={item.status} size="sm" />
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Recent Executions</h3>
            {executionsLoading && <LoadingSkeleton rows={5} variant="list" />}
            {!executionsLoading && executions.length === 0 && <EmptyState title="No recent executions" description="No execution history found." />}
            {executions.slice(0, 5).map((item) => (
              <div key={item.batch_id} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'monospace' }}>{item.batch_id.slice(0, 8)}...</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{item.project_id} • {item.total_controls ?? 0} controls</div>
                </div>
                <StatusBadge status={item.batch_status || ''} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>Operational Alerts</h3>
          {monitoringLoading && <LoadingSkeleton rows={3} variant="list" />}
          {alerts && alerts.alerts.length === 0 && <EmptyState title="No active alerts" description="All systems operating normally." />}
          {alerts?.alerts.map((alert: { id: string; severity: string; message: string; timestamp: string | null }) => (
            <div key={alert.id} style={{ padding: 'var(--space-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-sm)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{alert.message}</span>
                <StatusBadge status={alert.severity} size="sm" />
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Unknown time'}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedules' && (
        <EmptyState title="No scheduled tasks" description="No scheduled tasks configured." />
      )}

      {activeTab === 'retry' && (
        <EmptyState title="No items in retry queue" description="Retry queue is empty." />
      )}

      {activeTab === 'health' && (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: 'var(--space-sm)' }}>System Health Details</h3>
          {healthLoading && <LoadingSkeleton rows={4} variant="list" />}
          {healthError && <ErrorState message={healthError} />}
          {health && (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Database Connection</span>
                <StatusBadge status={health.database ? 'HEALTHY' : 'UNHEALTHY'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>API Service</span>
                <StatusBadge status={health.api ? 'HEALTHY' : 'UNHEALTHY'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0' }}>
                <span>Last Check</span>
                <span>{health.timestamp ? new Date(health.timestamp).toLocaleString() : 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
