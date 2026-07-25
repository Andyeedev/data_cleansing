import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OperationsPage } from './OperationsPage';
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
];

describe('OperationsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/monitoring/health')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { database: true, api: true, timestamp: null } }),
        });
      }
      if (url.includes('/api/v1/monitoring/queue')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { total_items: 0, running: 0, pending: 0, items: [] } }),
        });
      }
      if (url.includes('/api/v1/monitoring/metrics')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { total_executions: 0, active_executions: 0, completed_executions: 0, failed_executions: 0, avg_execution_time: null } }),
        });
      }
      if (url.includes('/api/v1/monitoring/alerts')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { alerts: [], total: 0 } }),
        });
      }
      if (url.includes('/api/v1/execution/history')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: { items: mockHistory, total: 1, page: 1, page_size: 10 },
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  it('fetches health and execution history on mount', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
    const healthCall = fetchCalls.find((call: string[]) => call[0]?.includes?.('/api/v1/monitoring/health'));
    expect(healthCall).toBeTruthy();
  });

  it('displays health status indicator', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument();
    });
  });

  it('displays execution history in monitoring tab', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Recent Executions')).toBeInTheDocument();
      expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });
  });

  it('tab switching loads correct content', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /monitoring/i })).toHaveAttribute('aria-selected', 'true');
    });

    fireEvent.click(screen.getByRole('tab', { name: /alerts/i }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /alerts/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/No active alerts/i)).toBeInTheDocument();
    });
  });

  it('shows permission error for viewer role', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'viewer' });

    await waitFor(() => {
      expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
    });
  });

  it('all 5 tabs are accessible', async () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /monitoring/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /alerts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /schedules/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /retry/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /health/i })).toBeInTheDocument();
    });
  });
});
