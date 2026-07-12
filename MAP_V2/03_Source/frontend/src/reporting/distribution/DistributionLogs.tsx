import { useDistribution } from './hooks/useDistribution';

export const DistributionLogs = () => {
  const { logs } = useDistribution();

  const levelColors: Record<string, string> = {
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Logs</h2>
      <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Level</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Message</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Source</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: levelColors[log.level] || '#6b7280' }}>{log.level}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{log.message}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>{log.source}</td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
