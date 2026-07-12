import { useDistribution } from './hooks/useDistribution';
import type { DeliveryChannel } from './types/DistributionTypes';

const channelIcons: Record<DeliveryChannel, string> = {
  email: '📧', teams: '💬', sharepoint: '📁', onedrive: '☁️', blob: '🗄️', datalake: '🏞️', download: '⬇️', portal: '🌐', api: '🔌', webhook: '🔗', ftp: '📡', sftp: '🔐', servicebus: '🚌', eventgrid: '📊',
};

export const DistributionChannels = () => {
  const { statistics, getChannelLabel } = useDistribution();
  const channels: DeliveryChannel[] = ['email', 'teams', 'sharepoint', 'onedrive', 'blob', 'datalake', 'download', 'portal', 'api', 'webhook', 'ftp', 'sftp', 'servicebus', 'eventgrid'];

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Delivery Channels</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {channels.map((channel) => (
          <div key={channel} style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{channelIcons[channel]}</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)' }}>{getChannelLabel(channel)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>Active</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>Usage</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{statistics.channelUsage[channel]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
