import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useValidationDashboard } from '../hooks/useValidation';
import { useValidationFilter } from '../context/ValidationFilterContext';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';

export function ValidationDashboardPage() {
  const { userRoles } = useAuth();
  const navigate = useNavigate();
  const { tenantId } = useValidationFilter();
  const [isLive, setIsLive] = useState(true);
  const { data, loading, error, refetch } = useValidationDashboard(tenantId || undefined);

  const complianceGaugeColor =
    (data?.summary.compliance_rate ?? 0) >= 80
      ? 'var(--color-success)'
      : (data?.summary.compliance_rate ?? 0) >= 50
        ? 'var(--color-warning)'
        : 'var(--color-danger)';

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Validation Overview</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Validation Overview"
        description="Real-time validation health and risk monitoring"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <CascadeDropdowns showProject={false} showBatch={false} />
            <button
              onClick={() => setIsLive(!isLive)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: isLive ? 'var(--color-success)' : 'var(--color-bg-secondary)',
                color: isLive ? '#fff' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? '#fff' : 'var(--color-text-secondary)' }} />
              {isLive ? 'Live' : 'Paused'}
            </button>
            <button
              onClick={refetch}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Refresh
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total Batches" value={data.summary.total_batches} color="var(--color-text)" />
            <MetricCard title="Compliance Rate" value={`${data.summary.compliance_rate}%`} color={complianceGaugeColor} />
            <MetricCard title="High Risk" value={data.summary.high_risk} color="var(--color-danger)" />
            <MetricCard title="Unscored" value={data.summary.unscored_count} color="var(--color-warning)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Compliance Score</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `conic-gradient(${complianceGaugeColor} 0% ${data.summary.compliance_rate}%, var(--color-bg) ${data.summary.compliance_rate}% 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'var(--color-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <span style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                      {data.summary.compliance_rate}%
                    </span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Score</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Total Batches</span>
                    <span>{data.summary.total_batches}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Passed</span>
                    <span style={{ color: 'var(--color-success)' }}>{data.summary.passed}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Failed</span>
                    <span style={{ color: 'var(--color-danger)' }}>{data.summary.failed}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 'var(--space-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Risk Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>HIGH</span>
                    <span style={{ color: 'var(--color-danger)' }}>{data.risk_distribution.high}</span>
                  </div>
                  <ProgressBar value={data.risk_distribution.high} max={Math.max(data.summary.total_batches, 1)} color="var(--color-danger)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>MEDIUM</span>
                    <span style={{ color: 'var(--color-warning)' }}>{data.risk_distribution.medium}</span>
                  </div>
                  <ProgressBar value={data.risk_distribution.medium} max={Math.max(data.summary.total_batches, 1)} color="var(--color-warning)" height={12} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                    <span>LOW</span>
                    <span style={{ color: 'var(--color-success)' }}>{data.risk_distribution.low}</span>
                  </div>
                  <ProgressBar value={data.risk_distribution.low} max={Math.max(data.summary.total_batches, 1)} color="var(--color-success)" height={12} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Active Runs</h4>
            {data.active_runs.length === 0 ? (
              <EmptyState title="No active runs" description="No validation runs are currently running." />
            ) : (
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Batch ID</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Started</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.active_runs.map((run) => (
                      <tr
                        key={run.batch_id}
                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                        onClick={() => navigate(`/validation/results/${run.batch_id}`)}
                      >
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{run.batch_id.slice(0, 8)}...</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge status={run.status} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          {new Date(run.started_at).toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/validation/results/${run.batch_id}`);
                            }}
                            style={{
                              padding: '4px 12px',
                              fontSize: 'var(--font-size-xs)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              background: 'var(--color-surface)',
                              cursor: 'pointer',
                              color: 'var(--color-text)',
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Unscored Batches</h4>
            {data.summary.unscored_count > 0 ? (
              <div style={{
                padding: 'var(--space-md)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <p style={{ fontSize: 'var(--font-size-sm)' }}>
                  {data.summary.unscored_count} batch(es) have not been scored yet.
                </p>
              </div>
            ) : (
              <EmptyState title="All batches scored" description="No unscored batches remaining." />
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Recent Batches</h4>
            {data.recent_batches.length === 0 ? (
              <EmptyState title="No batches" description="No recent batches found." />
            ) : (
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Batch ID</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Controls</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Failed</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Started</th>
                      <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_batches.map((batch) => (
                      <tr
                        key={batch.batch_id}
                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                        onClick={() => navigate(`/validation/results/${batch.batch_id}`)}
                      >
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{batch.batch_id.slice(0, 8)}...</td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          <StatusBadge status={batch.batch_status} size="sm" />
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                          {batch.completed_controls}/{batch.total_controls}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', color: batch.failed_controls > 0 ? 'var(--color-danger)' : undefined }}>
                          {batch.failed_controls}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          {new Date(batch.batch_start_time).toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/validation/results/${batch.batch_id}`);
                            }}
                            style={{
                              padding: '4px 12px',
                              fontSize: 'var(--font-size-xs)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              background: 'var(--color-surface)',
                              cursor: 'pointer',
                              color: 'var(--color-text)',
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--font-size-h4)', marginBottom: 'var(--space-md)' }}>Recent Alerts</h4>
            {data.alerts.length === 0 ? (
              <EmptyState title="No alerts" description="No recent alerts." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {data.alerts.map((alert, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      borderLeft: `4px solid ${alert.type === 'error' ? 'var(--color-danger)' : alert.type === 'warning' ? 'var(--color-warning)' : 'var(--color-success)'}`,
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{alert.type.toUpperCase()}</span>
                    <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <p style={{ margin: 'var(--space-xs) 0 0', fontSize: 'var(--font-size-sm)' }}>{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
