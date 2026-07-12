import { useState } from 'react';

export type DeliveryChannel = 'dashboard' | 'notification' | 'email' | 'export';

export interface InsightDeliveryProps {
  insightTitle?: string;
}

export const InsightDelivery: React.FC<InsightDeliveryProps> = ({
  insightTitle
}) => {
  const [selectedChannel, setSelectedChannel] = useState<DeliveryChannel>('dashboard');
  const [delivered, setDelivered] = useState(false);

  const channels: { id: DeliveryChannel; label: string; icon: string; description: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Show on dashboard' },
    { id: 'notification', label: 'Notification', icon: '🔔', description: 'Push notification' },
    { id: 'email', label: 'Email', icon: '📧', description: 'Send via email' },
    { id: 'export', label: 'Export', icon: '📤', description: 'Download as file' }
  ];

  const handleDeliver = () => {
    setDelivered(true);
    setTimeout(() => setDelivered(false), 2000);
  };

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
        Deliver Insight{insightTitle ? `: ${insightTitle}` : ''}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setSelectedChannel(ch.id)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: selectedChannel === ch.id ? '#3b82f6' : '#ffffff',
              color: selectedChannel === ch.id ? 'white' : '#374151',
              border: `1px solid ${selectedChannel === ch.id ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '2px' }}>{ch.icon}</div>
            {ch.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleDeliver}
        disabled={delivered}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: delivered ? '#22c55e' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500
        }}
      >
        {delivered ? '✓ Delivered' : 'Deliver Now'}
      </button>
    </div>
  );
};

export default InsightDelivery;
