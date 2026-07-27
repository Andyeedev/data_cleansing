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

describe('MigrationPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders execution tab by default without fetching history', async () => {
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute('aria-selected', 'false');
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches execution history when history tab is clicked', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { items: mockHistory, total: 2, page: 1, page_size: 20 },
      }),
    });

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
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { items: mockHistory, total: 2, page: 1, page_size: 20 },
      }),
    });

    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /history/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /history/i }));

    await waitFor(() => {
      expect(screen.getByText('Execution History (2 total)')).toBeInTheDocument();
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
      expect(screen.getByText('RUNNING')).toBeInTheDocument();
    });
  });

  it('execution tab shows start button and project input', async () => {
    renderWithProviders(<MigrationPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start migration/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/project id/i)).toBeInTheDocument();
    });
  });

  it('shows permission error for viewer role', async () => {
    renderWithProviders(<MigrationPage />, { initialRole: 'viewer' });

    await waitFor(() => {
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
    });
  });

  it('tab switching works correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { items: mockHistory, total: 2, page: 1, page_size: 20 },
      }),
    });

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
