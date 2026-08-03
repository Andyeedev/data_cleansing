import { useState } from 'react';
import { useMigrationProjects } from '../hooks/useMigration';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { StatusBadge } from '../components/shared/StatusBadge';
import { TenantFilter } from '../components/shared/TenantFilter';

export function MigrationProjectsPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { projects, loading, error, refetch } = useMigrationProjects(undefined, selectedTenant || undefined);

  if (loading) {
    return <LoadingOverlay message="Loading projects..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Migration Projects" description="Manage your migration projects" />
        <ErrorState message={error} onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Migration Projects"
        description="Manage your migration projects"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button style={createButtonStyle}>
              + New Project
            </button>
          </div>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first migration project to get started."
        />
      ) : (
        <div style={gridStyle}>
          {projects.map((project) => (
            <div key={project.project_id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{project.project_name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Batches</span>
                  <span style={statValueStyle}>{project.total_batches}</span>
                </div>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Completed</span>
                  <span style={{ ...statValueStyle, color: 'var(--color-success)' }}>
                    {project.completed_batches}
                  </span>
                </div>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Datasets</span>
                  <span style={statValueStyle}>{project.dataset_count}</span>
                </div>
              </div>
              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Controls</span>
                  <span style={statValueStyle}>{project.total_controls}</span>
                </div>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Completed</span>
                  <span style={{ ...statValueStyle, color: 'var(--color-success)' }}>
                    {project.completed_controls}
                  </span>
                </div>
                <div style={statItemStyle}>
                  <span style={statLabelStyle}>Failed</span>
                  <span style={{ ...statValueStyle, color: project.failed_batches > 0 ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
                    {project.failed_batches}
                  </span>
                </div>
              </div>
              <div style={footerStyle}>
                <span style={dateStyle}>
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </span>
                <button style={viewButtonStyle}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

const createButtonStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-primary)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontWeight: 'var(--font-weight-medium)',
  fontSize: 'var(--font-size-sm)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
  gap: 'var(--space-lg)',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  padding: 'var(--space-lg)',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 'var(--space-sm)',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text)',
  margin: 0,
};

const statsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 'var(--space-sm)',
  marginBottom: 'var(--space-md)',
  padding: 'var(--space-sm)',
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius)',
};

const statItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const statValueStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 'var(--space-sm)',
  borderTop: '1px solid var(--color-border)',
};

const dateStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const viewButtonStyle: React.CSSProperties = {
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-medium)',
};
