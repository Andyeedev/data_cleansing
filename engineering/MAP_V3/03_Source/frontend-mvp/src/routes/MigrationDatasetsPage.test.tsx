import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MigrationDatasetsPage } from './MigrationDatasetsPage';

vi.mock('../hooks/useMigration', () => ({
  useMigrationDatasets: () => ({
    datasets: [
      {
        dataset_id: 'dataset-1',
        project_id: 'project-1',
        project_name: 'Test Project',
        system_id: 'sys-1',
        system_name: 'SourceDB',
        table_name: 'customers',
        schema_name: 'public',
        discovered_at: '2024-01-01T00:00:00Z',
        last_seen: '2024-01-02T00:00:00Z',
      },
    ],
    total: 1,
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMigrationTenants: () => ({
    tenants: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('MigrationDatasetsPage', () => {
  it('renders datasets table', async () => {
    render(
      <BrowserRouter>
        <MigrationDatasetsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Migration Datasets')).toBeInTheDocument();
      expect(screen.getByText('customers')).toBeInTheDocument();
    });
  });
});
