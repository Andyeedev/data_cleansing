import { useState } from 'react';

interface DeliveryChannel {
  id: string;
  name: string;
  type: 'dashboard' | 'notification' | 'email' | 'export';
  enabled: boolean;
  lastUsed?: string;
}

interface DeliveryLog {
  id: string;
  recommendation: string;
  channel: string;
  deliveredAt: string;
  status: 'delivered' | 'pending' | 'failed';
}

const DEMO_CHANNELS: DeliveryChannel[] = [
  { id: 'ch-001', name: 'Dashboard Widget', type: 'dashboard', enabled: true, lastUsed: '2026-07-10T10:30:00Z' },
  { id: 'ch-002', name: 'In-App Notifications', type: 'notification', enabled: true, lastUsed: '2026-07-10T09:15:00Z' },
  { id: 'ch-003', name: 'Email Digest', type: 'email', enabled: true, lastUsed: '2026-07-09T18:00:00Z' },
  { id: 'ch-004', name: 'CSV Export', type: 'export', enabled: false },
];

const DEMO_LOGS: DeliveryLog[] = [
  { id: 'log-001', recommendation: 'Rotate production API keys', channel: 'Email Digest', deliveredAt: '2026-07-09T18:00:00Z', status: 'delivered' },
  { id: 'log-002', recommendation: 'Enable parallel validation', channel: 'Dashboard Widget', deliveredAt: '2026-07-10T10:30:00Z', status: 'delivered' },
  { id: 'log-003', recommendation: 'Update data retention policy', channel: 'In-App Notifications', deliveredAt: '2026-07-10T09:15:00Z', status: 'delivered' },
  { id: 'log-004', recommendation: 'Implement batch validation', channel: 'Email Digest', deliveredAt: '2026-07-10T12:00:00Z', status: 'pending' },
];

const TYPE_ICONS: Record<string, string> = {
  dashboard: '📊',
  notification: '🔔',
  email: '📧',
  export: '📥',
};

export function RecommendationDelivery() {
  const [channels, setChannels] = useState<DeliveryChannel[]>(DEMO_CHANNELS);
  const [logs] = useState<DeliveryLog[]>(DEMO_LOGS);

  const toggleChannel = (id: string) => {
    setChannels(prev => prev.map(ch =>
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Recommendation Delivery</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {channels.map(channel => (
          <div key={channel.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            opacity: channel.enabled ? 1 : 0.6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{TYPE_ICONS[channel.type]}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{channel.name}</span>
              </div>
              <button
                onClick={() => toggleChannel(channel.id)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: channel.enabled ? '#10b981' : '#e2e8f0',
                  color: channel.enabled ? '#fff' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                {channel.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {channel.lastUsed ? `Last used: ${new Date(channel.lastUsed).toLocaleDateString()}` : 'Never used'}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>Delivery Log</h3>
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Recommendation</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Channel</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Delivered At</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1e293b' }}>{log.recommendation}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{log.channel}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{new Date(log.deliveredAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#fff',
                      background: log.status === 'delivered' ? '#10b981' : log.status === 'pending' ? '#f59e0b' : '#dc2626',
                    }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecommendationDelivery;
