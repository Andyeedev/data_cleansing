export const DistributionWorkspace = () => {
  const workspaces = [
    { id: '1', name: 'Executive Reports', reports: ['Executive Summary', 'Financial Overview', 'Strategic Dashboard'], createdAt: '2026-06-01', updatedAt: '2026-07-01' },
    { id: '2', name: 'Migration Reports', reports: ['Migration Status', 'Data Quality', 'Progress Tracker'], createdAt: '2026-06-15', updatedAt: '2026-07-01' },
    { id: '3', name: 'Governance Reports', reports: ['Compliance Report', 'Audit Trail', 'Risk Assessment'], createdAt: '2026-06-20', updatedAt: '2026-07-01' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Workspace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {workspaces.map((workspace) => (
          <div key={workspace.id} style={{ padding: '1rem', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', marginBottom: '0.5rem' }}>{workspace.name}</div>
            <div style={{ marginBottom: '0.75rem' }}>
              {workspace.reports.map((report) => (
                <div key={report} style={{ padding: '0.25rem 0', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>• {report}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>
              <span>Created: {workspace.createdAt}</span>
              <span>Updated: {workspace.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
