import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MigrationProjectsPage } from './MigrationProjectsPage';

vi.mock('../hooks/useMigration', () => ({
  useMigrationProjects: () => ({
    projects: [
      {
        project_id: 'project-1',
        project_name: 'Test Project',
        project_type: 'MIGRATION',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        total_batches: 10,
        completed_batches: 5,
        failed_batches: 1,
        total_controls: 100,
        completed_controls: 50,
        dataset_count: 3,
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

describe('MigrationProjectsPage', () => {
  it('renders projects list', async () => {
    render(
      <BrowserRouter>
        <MigrationProjectsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Migration Projects')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });
});
