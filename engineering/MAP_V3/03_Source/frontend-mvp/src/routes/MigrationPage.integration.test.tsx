import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MigrationPage } from './MigrationPage';
import { renderWithProviders } from '../test-utils';

const mockHistory = [
  {
    batch_id: 'batch-001',
    project_id: 'proj-001',
    batch_status: 'COMPLETED',
    total_controls: 100,
    completed_controls: 100,
    failed_controls: 0,
    batch_start_time: '2026-07-20T10:00:00Z',
    batch_end_time: '2026-07-20T10:05:00Z',
  },
  {
    batch_id: 'batch-002',
    project_id: 'proj-002',
    batch_status: 'RUNNING',
    total_controls: 50,
    completed_controls: 25,
    failed_controls: 0,
    batch_start_time: '2026-07-20T11:00:00Z',
    batch_end_time: null,
  },
];

function createMockFetch(historyData?: unknown) {
  return vi.fn(async (url: URL | RequestInfo) => {
    const urlStr = String(url);
    if (urlStr.includes('tenants')) {
      return { ok: true, json: async () => ({ success: true, data: [] }) } as unknown as Response;
    }
    if (urlStr.includes('status-breakdown')) {
      return { ok: true, json: async () => ({ success: true, data: { breakdown: { COMPLETED: 0, RUNNING: 0, FAILED: 0 }, total: 0, unscored: 0 } }) } as unknown as Response;
    }
    if (urlStr.includes('/execution/history')) {
      return { ok: true, json: async () => ({ success: true, data: historyData ?? { items: [], total: 0, page: 1, page_size: 20 } }) } as unknown as Response;
    }
    if (urlStr.includes('/execution/risk-scores')) {
      return { ok: true, json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }) } as unknown as Response;
    }
    if (urlStr.includes('/execution')) {
      return { ok: true, json: async () => ({ success: true, data: {} }) } as unknown as Response;
    }
    if (urlStr.includes('/auth/me')) {
      return { ok: true, json: async () => ({ success: true, data: { id: '1', email: 'admin@test.com', name: 'admin', roles: ['admin'], permissions: ['read', 'write', 'delete', 'admin'] } }) } as unknown as Response;
    }
    if (urlStr.includes('/migration/projects/overview')) {
      return { ok: true, json: async () => ({ success: true, data: { total_projects: 0, total_batches: 0, total_controls: 0, completed_controls: 0, total_datasets: 0, active_projects: 0, active_batches: 0, health_score: 100, recent_activity: [], top_projects: [] } }) } as unknown as Response;
    }
    if (urlStr.includes('/migration/projects')) {
      return { ok: true, json: async () => ({ success: true, data: { items: [], total: 0 } }) } as unknown as Response;
    }
    if (urlStr.includes('/dashboard/')) {
      return { ok: true, json: async () => ({ success: true, data: { items: [], total: 0 } }) } as unknown as Response;
    }
    return { ok: true, json: async () => ({ success: true, data: historyData ?? { items: [], total: 0, page: 1, page_size: 20 } }) } as unknown as Response;
  });
}

describe('MigrationPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders execution tab by default with start button and dashboard cards', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByRole('button', { name: /start migration/i })).toBeInTheDocument();
      expect(screen.getByText('Execution Overview')).toBeInTheDocument();
    });
  });

  it('fetches execution history when history tab is clicked', async () => {
    global.fetch = createMockFetch({ items: mockHistory, total: 2, page: 1, page_size: 20 });
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /history/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /history/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/execution/history'),
        expect.any(Object)
      );
    });
  });

  it('displays execution history entries after switching to History tab', async () => {
    global.fetch = createMockFetch({ items: mockHistory, total: 2, page: 1, page_size: 20 });
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /history/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /history/i }));

    await waitFor(() => {
      expect(screen.getByText('Execution History (2 total)')).toBeInTheDocument();
    });
    expect(screen.getAllByText('COMPLETED').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RUNNING').length).toBeGreaterThan(0);
  });

  it('execution tab shows start button and overview cards', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start migration/i })).toBeInTheDocument();
      expect(screen.getByText('Execution Overview')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Completed Today')).toBeInTheDocument();
      expect(screen.getByText('Failed Today')).toBeInTheDocument();
      expect(screen.getByText('Scheduled Today')).toBeInTheDocument();
    });
  });

  it('shows permission error for viewer role', async () => {
    global.fetch = createMockFetch();
    renderWithProviders(<MigrationPage />, { initialRole: 'viewer' });

    await waitFor(() => {
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
    });
  });

  it('tab switching works correctly', async () => {
    global.fetch = createMockFetch({ items: mockHistory, total: 2, page: 1, page_size: 20 });
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute('aria-selected', 'true');
    });

    fireEvent.click(screen.getByRole('tab', { name: /history/i }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute('aria-selected', 'false');
    });
  });
});
