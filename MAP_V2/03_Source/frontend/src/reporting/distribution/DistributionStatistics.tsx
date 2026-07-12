import { useDistribution } from './hooks/useDistribution';

export const DistributionStatistics = () => {
  const { statistics, getChannelLabel, getFormatLabel } = useDistribution();

  const kpis = [
    { label: 'Reports Delivered', value: statistics.reportsDelivered.toLocaleString() },
    { label: 'Delivery Success Rate', value: `${statistics.deliverySuccessRate}%` },
    { label: 'Average Delivery Time', value: `${statistics.averageDeliveryTime}s` },
    { label: 'Average Download Time', value: `${statistics.averageDownloadTime}s` },
    { label: 'Average Package Size', value: `${statistics.averagePackageSize} MB` },
    { label: 'Most Used Format', value: getFormatLabel(statistics.mostUsedExportFormat) },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Statistics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>{kpi.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary, #2563eb)' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Top Distribution Channels</h3>
          {statistics.topDistributionChannels.map((item) => (
            <div key={item.channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{getChannelLabel(item.channel)}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{item.count}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Top Delivery Profiles</h3>
          {statistics.topDeliveryProfiles.map((item) => (
            <div key={item.profile} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{item.profile}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Downloads by Format</h3>
          {Object.entries(statistics.downloadsByFormat).filter(([, count]) => count > 0).map(([format, count]) => (
            <div key={format} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{getFormatLabel(format as keyof typeof statistics.downloadsByFormat)}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{count}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Most Distributed Reports</h3>
          {statistics.mostDistributedReports.map((item) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{item.name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
