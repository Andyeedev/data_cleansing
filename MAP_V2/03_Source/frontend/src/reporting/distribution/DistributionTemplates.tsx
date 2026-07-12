import { useDistribution } from './hooks/useDistribution';

export const DistributionTemplates = () => {
  const { templates, getChannelLabel, getFormatLabel } = useDistribution();

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Templates</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {templates.map((template) => (
          <div key={template.id} style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)' }}>{template.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{template.description}</div>
              </div>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: template.enabled ? '#10b981' : '#6b7280' }}>{template.enabled ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Format</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{getFormatLabel(template.format)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Usage</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary, #2563eb)' }}>{template.usageCount}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Channels</div>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {template.channels.map((channel) => (
                  <span key={channel} style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', background: 'var(--color-background, #f3f4f6)', color: 'var(--color-text-primary, #1f2937)' }}>{getChannelLabel(channel)}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
