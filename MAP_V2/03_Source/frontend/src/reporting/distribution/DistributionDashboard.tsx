import { useDistribution } from './hooks/useDistribution';

export const DistributionDashboard = () => {
  const { dashboardData, getStatusColor, getChannelLabel } = useDistribution();
  const { statistics, recentJobs, pendingJobs, failedJobs } = dashboardData;

  const kpis = [
    { label: 'Reports Delivered', value: statistics.reportsDelivered.toLocaleString(), color: '#10b981' },
    { label: 'Pending Deliveries', value: statistics.pendingDeliveries.toLocaleString(), color: '#f59e0b' },
    { label: 'Failed Deliveries', value: statistics.failedDeliveries.toLocaleString(), color: '#ef4444' },
    { label: 'Delivery Success Rate', value: `${statistics.deliverySuccessRate}%`, color: '#3b82f6' },
    { label: 'Queue Length', value: statistics.queueLength.toLocaleString(), color: '#8b5cf6' },
    { label: 'Active Profiles', value: statistics.activeProfiles.toLocaleString(), color: '#06b6d4' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>{kpi.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Recent Deliveries</h3>
          {recentJobs.map((job) => (
            <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{job.reportName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{getChannelLabel(job.channel)} • {job.recipient}</div>
              </div>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: getStatusColor(job.status) }}>{job.status}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Pending Queue</h3>
          {pendingJobs.map((job) => (
            <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{job.reportName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{getChannelLabel(job.channel)} • {job.recipient}</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : 'Now'}</span>
            </div>
          ))}
          {pendingJobs.length === 0 && <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', textAlign: 'center', padding: '2rem' }}>No pending deliveries</div>}
        </div>
      </div>

      {failedJobs.length > 0 && (
        <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b', margin: '0 0 1rem 0' }}>Failed Deliveries</h3>
          {failedJobs.map((job) => (
            <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #fecaca' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#991b1b' }}>{job.reportName}</div>
                <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>{job.errorMessage}</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#991b1b' }}>Retry {job.retryCount}/{job.maxRetries}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Channel Usage</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {Object.entries(statistics.channelUsage).filter(([, count]) => count > 0).map(([channel, count]) => (
            <div key={channel} style={{ padding: '0.5rem', background: 'var(--color-background, #f9fafb)', borderRadius: '0.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{getChannelLabel(channel as keyof typeof statistics.channelUsage)}</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)' }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
