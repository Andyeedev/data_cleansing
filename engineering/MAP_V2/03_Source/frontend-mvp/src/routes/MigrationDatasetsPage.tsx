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
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <TenantFilter selectedTenant={selectedTenant} onChange={setSelectedTenant} />
            <button style={refreshButtonStyle} onClick={refetch}>
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
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Table Name</th>
                <th style={thStyle}>Schema</th>
                <th style={thStyle}>Discovered</th>
                <th style={thStyle}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => (
                <tr key={dataset.dataset_id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={datasetNameStyle}>{dataset.table_name}</div>
                    <div style={datasetIdStyle}>{dataset.dataset_id}</div>
                  </td>
                  <td style={tdStyle}>{dataset.schema_name}</td>
                  <td style={tdStyle}>
                    {new Date(dataset.discovered_at).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
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

const refreshButtonStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  background: 'var(--color-bg-secondary)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  cursor: 'pointer',
  fontSize: 'var(--font-size-sm)',
  transition: 'opacity 0.2s',
};

const tableContainerStyle: React.CSSProperties = {
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  overflow: 'hidden',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  textAlign: 'left',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-xs)',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--color-border)',
};

const tdStyle: React.CSSProperties = {
  padding: 'var(--space-sm) var(--space-md)',
  fontSize: 'var(--font-size-sm)',
};

const datasetNameStyle: React.CSSProperties = {
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text)',
};

const datasetIdStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
  fontFamily: 'monospace',
};
