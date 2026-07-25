import { useState, useEffect, useCallback } from 'react';
import { useExecutionHistory } from '../hooks/useExecutionHistory';
import { useHealth } from '../hooks/useHealth';
import { useMonitoring } from '../hooks/useMonitoring';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

type Tab = 'monitoring' | 'alerts' | 'schedules' | 'retry' | 'health';

interface QueueItem {
  batch_id: string;
  project_id: string | null;
  status: string;
  queued_at: string | null;
}

export function OperationsPage() {
  const { userRoles } = useAuth();
  const { items: executions, loading: executionsLoading, error: executionsError, fetchHistory } = useExecutionHistory();
  const { health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();
  const { metrics, queue, alerts, loading: monitoringLoading, error: monitoringError, refetch: refetchMonitoring } = useMonitoring();

  const [activeTab, setActiveTab] = useState<Tab>('monitoring');

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return '#22c55e';
      case 'RUNNING': return '#3b82f6';
      case 'FAILED': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      case 'CANCELLED': return '#6b7280';
      default: return 'var(--color-text-secondary)';
    }
  };

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
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Operations</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Operations</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Monitoring, alerts, schedules, retry, and system health.
      </p>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
        {(['monitoring', 'alerts', 'schedules', 'retry', 'health'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab ? 'var(--color-sidebar-active)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--color-text)',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-sidebar-active)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Health Status */}
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>System Health</h3>
            {healthLoading && <LoadingSpinner />}
            {healthError && <ErrorMessage message={healthError} />}
            {health && (
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: health.database ? '#22c55e' : '#ef4444',
                  }} />
                  <span style={{ fontSize: 14 }}>Database</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: health.api ? '#22c55e' : '#ef4444',
                  }} />
                  <span style={{ fontSize: 14 }}>API</span>
                </div>
              </div>
            )}
          </div>

          {/* Active Queue */}
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Active Queue</h3>
            {monitoringLoading && <LoadingSpinner />}
            {queue && queue.items.length === 0 && (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                No active items in queue
              </div>
            )}
            {queue?.items.map((item: QueueItem) => (
              <div key={item.batch_id} style={{
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontFamily: 'monospace' }}>
                    {item.batch_id.slice(0, 8)}...
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {item.project_id}
                  </div>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  background: `${getStatusColor(item.status)}15`,
                  color: getStatusColor(item.status),
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Recent Executions */}
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            gridColumn: 'span 2',
          }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Recent Executions</h3>
            {executionsLoading && <LoadingSpinner />}
            {!executionsLoading && executions.length === 0 && (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                No recent executions
              </div>
            )}
            {executions.slice(0, 5).map((item) => (
              <div key={item.batch_id} style={{
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontFamily: 'monospace' }}>
                    {item.batch_id.slice(0, 8)}...
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {item.project_id} • {item.total_controls ?? 0} controls
                  </div>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  background: `${getStatusColor(item.batch_status || '')}15`,
                  color: getStatusColor(item.batch_status || ''),
                }}>
                  {item.batch_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 20,
        }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Operational Alerts</h3>
          {monitoringLoading && <LoadingSpinner />}
          {alerts && alerts.alerts.length === 0 && (
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
              No active alerts
            </div>
          )}
          {alerts?.alerts.map((alert: { id: string; severity: string; message: string; timestamp: string | null }) => (
            <div key={alert.id} style={{
              padding: '12px 16px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              marginBottom: 8,
              background: 'var(--color-surface)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{alert.message}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  background: alert.severity === 'critical' ? '#ef444420' : alert.severity === 'warning' ? '#f59e0b20' : '#3b82f620',
                  color: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#3b82f6',
                }}>
                  {alert.severity}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Unknown time'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          No scheduled tasks
        </div>
      )}

      {/* Retry Tab */}
      {activeTab === 'retry' && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 48,
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          No items in retry queue
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 20,
        }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>System Health Details</h3>
          {healthLoading && <LoadingSpinner />}
          {healthError && <ErrorMessage message={healthError} />}
          {health && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>Database Connection</span>
                <span style={{ color: health.database ? '#22c55e' : '#ef4444' }}>
                  {health.database ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>API Service</span>
                <span style={{ color: health.api ? '#22c55e' : '#ef4444' }}>
                  {health.api ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
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