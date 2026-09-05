import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMigrationProjects } from '../hooks/useMigration';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { TenantFilter } from '../components/shared/TenantFilter';
import { KpiBox, ReportCard, StatusPill } from '../components/reports/reportWidgets';

export function MigrationProjectsPage() {
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { projects, loading, error, refetch } = useMigrationProjects(undefined, selectedTenant || undefined);

  if (loading) {
    return <LoadingOverlay message="Loading projects..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Migration Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your migration projects</p>
          </div>
        </div>
        <ReportCard title="Error">
          <ErrorState message={error} onRetry={refetch} />
        </ReportCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Migration Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} projects</p>
        </div>
        <div className="flex items-center gap-3">
          <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
          <button
            onClick={refetch}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Create your first migration project to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ReportCard key={project.project_id} title={project.project_name} subtitle={`Created ${new Date(project.created_at).toLocaleDateString()}`}>
              <div className="flex justify-between items-center mb-4">
                <StatusPill status={project.status} />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <KpiBox label="Batches" value={project.total_batches} tone="info" />
                <KpiBox label="Completed" value={project.completed_batches} tone="success" />
                <KpiBox label="Datasets" value={project.dataset_count} tone="info" />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <KpiBox label="Controls" value={project.total_controls} tone="info" />
                <KpiBox label="Completed" value={project.completed_controls} tone="success" />
                <KpiBox label="Failed" value={project.failed_batches} tone={project.failed_batches > 0 ? 'error' : 'neutral'} />
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/migration/projects/${project.project_id}`)}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  View Details
                </button>
              </div>
            </ReportCard>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
