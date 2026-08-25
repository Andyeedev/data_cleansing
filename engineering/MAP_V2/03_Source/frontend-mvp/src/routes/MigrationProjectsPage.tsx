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
          <div className="flex gap-3 items-center">
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button className="px-3 py-1.5 bg-primary text-white rounded cursor-pointer text-sm font-medium hover:bg-primary/90">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.project_id} className="bg-bg-secondary rounded-lg border border-border p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-text">{project.project_name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-bg rounded">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Batches</span>
                  <span className="text-lg font-bold text-text">{project.total_batches}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Completed</span>
                  <span className="text-lg font-bold text-success">{project.completed_batches}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Datasets</span>
                  <span className="text-lg font-bold text-text">{project.dataset_count}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-bg rounded">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Controls</span>
                  <span className="text-lg font-bold text-text">{project.total_controls}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Completed</span>
                  <span className="text-lg font-bold text-success">{project.completed_controls}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-secondary">Failed</span>
                  <span className={`text-lg font-bold ${project.failed_batches > 0 ? 'text-danger' : 'text-text-secondary'}`}>
                    {project.failed_batches}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-xs text-secondary">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </span>
                <button className="px-2 py-1 bg-transparent text-primary border border-primary rounded cursor-pointer text-xs font-medium hover:bg-primary/10">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}