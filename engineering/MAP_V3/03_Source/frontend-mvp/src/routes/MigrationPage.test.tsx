import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MigrationPage } from './MigrationPage';
import { renderWithProviders } from '../test-utils';

function createMockFetch(historyData?: unknown) {
  return vi.fn(async (url: URL | RequestInfo) => {
    const urlStr = String(url);
    if (urlStr.includes('tenants')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as unknown as Response;
    }
    if (urlStr.includes('status-breakdown')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { breakdown: { COMPLETED: 0, RUNNING: 0, FAILED: 0 }, total: 0, unscored: 0 } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/execution/history')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: historyData ?? { items: [], total: 0, page: 1, page_size: 20 } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/execution/risk-scores')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/execution') || urlStr.includes('/migration/run')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: {} }),
      } as unknown as Response;
    }
    if (urlStr.includes('/auth/me')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { id: '1', email: 'admin@test.com', name: 'admin', roles: ['admin'], permissions: ['read', 'write', 'delete', 'admin'] } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/migration/projects/overview')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { total_projects: 0, total_batches: 0, total_controls: 0, completed_controls: 0, total_datasets: 0, active_projects: 0, active_batches: 0, health_score: 100, recent_activity: [], top_projects: [] } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/migration/projects')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { items: [], total: 0 } }),
      } as unknown as Response;
    }
    if (urlStr.includes('/dashboard/')) {
      return {
        ok: true,
        json: async () => ({ success: true, data: { items: [], total: 0 } }),
      } as unknown as Response;
    }
    return {
      ok: true,
      json: async () => ({ success: true, data: historyData ?? { items: [], total: 0, page: 1, page_size: 20 } }),
    } as unknown as Response;
  });
}

describe('MigrationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows permission error for non-admin users', () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);
    expect(screen.getByText('Migration')).toBeInTheDocument();
    expect(screen.getByText(/Execute migration runs/)).toBeInTheDocument();
  });

  it('renders execution and history tabs', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Execution' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
    });
  });

  it('renders start migration button in execution tab', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Migration/i })).toBeInTheDocument();
    });
  });

  it('renders stop all button', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Stop All/i })).toBeInTheDocument();
    });
  });

  it('opens confirmation modal when start migration clicked', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Migration/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Start Migration/i }));
    await waitFor(() => {
      expect(screen.getByText('Start Migration')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter project ID/i)).toBeInTheDocument();
      expect(screen.getByText('Full Validation (Recommended)')).toBeInTheDocument();
      expect(screen.getByText('Quick Health Check')).toBeInTheDocument();
    });
  });

  it('shows empty state when no execution history', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />);

    await waitFor(() => {
      screen.getByRole('tab', { name: 'History' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('No executions yet')).toBeInTheDocument();
    });
  });

  it('renders execution history after loading', async () => {
    const mockHistory = {
      items: [
        {
          batch_id: 'batch-12345678-1234-1234-1234-123456789abc',
          project_id: 'proj-1',
          batch_status: 'COMPLETED',
          total_controls: 10,
          completed_controls: 10,
          failed_controls: 0,
          batch_start_time: '2026-01-01T00:00:00Z',
          batch_end_time: '2026-01-01T00:05:00Z',
        },
      ],
      total: 1,
      page: 1,
      page_size: 20,
    };

    global.fetch = createMockFetch(mockHistory);
    renderWithProviders(<MigrationPage />);

    await waitFor(() => {
      screen.getByRole('tab', { name: 'History' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('Execution History (1 total)')).toBeInTheDocument();
      expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0);
    });
  });

  it('renders error state on API failure', async () => {
    global.fetch = vi.fn(async () => {
      throw new Error('HTTP 500');
    }) as unknown as typeof fetch;
    renderWithProviders(<MigrationPage />);

    await waitFor(() => {
      screen.getByRole('tab', { name: 'History' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });
});
