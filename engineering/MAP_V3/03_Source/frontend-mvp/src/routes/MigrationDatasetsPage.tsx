import { useState } from 'react';
import { useMigrationDatasets } from '../hooks/useMigration';
import { PageContainer } from '../components/PageContainer/PageContainer';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { LoadingOverlay } from '../components/LoadingOverlay/LoadingOverlay';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { TenantFilter } from '../components/shared/TenantFilter';

export function MigrationDatasetsPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const { datasets, loading, error, refetch } = useMigrationDatasets(undefined, selectedTenant || undefined);

  if (loading) {
    return <LoadingOverlay message="Loading datasets..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Migration Datasets" description="Manage discovered datasets" />
        <ErrorState message={error} onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Migration Datasets"
        description="Manage discovered datasets for migration"
        actions={
          <div className="flex gap-2 items-center">
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button className="px-3 py-1.5 bg-bg-secondary text-text border border-border rounded cursor-pointer text-sm hover:bg-bg-tertiary" onClick={refetch}>
              Refresh
            </button>
          </div>
        }
      />

      {datasets.length === 0 ? (
        <EmptyState
          title="No datasets discovered"
          description="Run discovery to find datasets from your source systems."
        />
      ) : (
        <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-secondary text-xs border-b border-border bg-bg">Table Name</th>
                <th className="px-3 py-2 text-left font-semibold text-secondary text-xs border-b border-border bg-bg">Schema</th>
                <th className="px-3 py-2 text-left font-semibold text-secondary text-xs border-b border-border bg-bg">Discovered</th>
                <th className="px-3 py-2 text-left font-semibold text-secondary text-xs border-b border-border bg-bg">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => (
                <tr key={dataset.dataset_id} className="border-b border-border">
                  <td className="px-3 py-2">
                    <div className="font-medium text-text">{dataset.table_name}</div>
                    <div className="text-xs text-secondary font-mono">{dataset.dataset_id}</div>
                  </td>
                  <td className="px-3 py-2">{dataset.schema_name}</td>
                  <td className="px-3 py-2">
                    {new Date(dataset.discovered_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {dataset.last_seen ? new Date(dataset.last_seen).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}