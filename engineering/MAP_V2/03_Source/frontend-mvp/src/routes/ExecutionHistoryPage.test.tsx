import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionHistoryPage } from './ExecutionHistoryPage';
import { renderWithProviders } from '../test-utils';

describe('ExecutionHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<ExecutionHistoryPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<ExecutionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Execution History')).toBeInTheDocument();
    });
  });

  it('displays empty state when no history available', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
    });
    renderWithProviders(<ExecutionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('No Execution History')).toBeInTheDocument();
    });
  });

  it('shows execution history table when data is present', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          items: [
            { batch_id: 'B1', batch_status: 'completed', total_controls: 10, completed_controls: 10, failed_controls: 0, batch_start_time: '2026-01-01', batch_end_time: '2026-01-02', project_id: 'P1' },
            { batch_id: 'B2', batch_status: 'in_progress', total_controls: 20, completed_controls: 15, failed_controls: 2, batch_start_time: '2026-01-03', batch_end_time: null, project_id: 'P2' },
          ],
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });
    renderWithProviders(<ExecutionHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('Batch ID')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('B1')).toBeInTheDocument();
      expect(screen.getByText('B2')).toBeInTheDocument();
    });
  });
});
