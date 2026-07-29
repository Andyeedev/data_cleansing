import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MigrationPage } from './MigrationPage';
import { renderWithProviders } from '../test-utils';

describe('MigrationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<MigrationPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<MigrationPage />);
    expect(screen.getByText('Migration')).toBeInTheDocument();
    expect(screen.getByText(/Execute migration runs/)).toBeInTheDocument();
  });

  it('renders execution and history tabs', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Execution' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
    });
  });

  it('renders start migration button in execution tab', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start Migration' })).toBeInTheDocument();
    });
  });

  it('renders project ID input field', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<MigrationPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter project ID/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no execution history', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
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

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockHistory }),
    });
    renderWithProviders(<MigrationPage />);

    await waitFor(() => {
      screen.getByRole('tab', { name: 'History' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText('Execution History (1 total)')).toBeInTheDocument();
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));
    renderWithProviders(<MigrationPage />);

    await waitFor(() => {
      screen.getByRole('tab', { name: 'History' }).click();
    });

    await waitFor(() => {
      expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });
  });
});
