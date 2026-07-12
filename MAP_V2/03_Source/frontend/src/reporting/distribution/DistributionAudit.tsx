import { useDistribution } from './hooks/useDistribution';

export const DistributionAudit = () => {
  const { auditEntries } = useDistribution();

  const typeColors: Record<string, string> = {
    delivery: '#10b981',
    recipient: '#3b82f6',
    download: '#8b5cf6',
    security: '#f59e0b',
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Audit Trail</h2>
      <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        {auditEntries.map((entry) => (
          <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: typeColors[entry.type] || '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
              {entry.type.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{entry.action}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{new Date(entry.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>{entry.details}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginTop: '0.25rem' }}>By: {entry.user}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
