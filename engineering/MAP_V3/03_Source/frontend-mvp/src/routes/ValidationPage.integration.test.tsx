import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationPage } from './ValidationPage';
import { renderWithProviders } from '../test-utils';

const mockWorkflows = [
  { id: 'wf-1', name: 'Data Integrity Check', description: null, type: 'validation', status: 'active', steps: [], triggers: [], created_by: null, created_at: '2026-01-01', updated_at: '2026-01-01' },
];

describe('ValidationPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches workflows on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: mockWorkflows, total: 1, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/workflows');
    });
  });

  it('validation workflows display with status', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { workflows: mockWorkflows, total: 1, page: 1, page_size: 10 } }),
    });
    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByText('Data Integrity Check')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  it('start validation triggers execution API', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { workflows: [], total: 0, page: 1, page_size: 10 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Migration execution triggered',
          batch_id: 'batch-456',
          project_id: 'default',
          status_url: '/execution/status/batch-456',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          batch_id: 'batch-456',
          status: 'RUNNING',
          total_controls: 10,
          completed_controls: 3,
          failed_controls: 1,
          progress: '3/10',
        }),
      });

    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByText('Start Validation')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start Validation'));

    await waitFor(() => {
      expect(screen.getByText('Validation Running...')).toBeInTheDocument();
    });
  });

  it('shows progress bar after execution starts', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { workflows: [], total: 0, page: 1, page_size: 10 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Migration execution triggered',
          batch_id: 'batch-789',
          project_id: 'default',
          status_url: '/execution/status/batch-789',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          batch_id: 'batch-789',
          status: 'RUNNING',
          total_controls: 8,
          completed_controls: 4,
          failed_controls: 0,
          progress: '4/8',
        }),
      });

    renderWithProviders(<ValidationPage />);
    await waitFor(() => {
      expect(screen.getByText('Start Validation')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start Validation'));

    await waitFor(() => {
      expect(screen.getByText('Total Controls')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });
});
