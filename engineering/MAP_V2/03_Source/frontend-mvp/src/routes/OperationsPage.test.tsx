import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OperationsPage } from './OperationsPage';
import { renderWithProviders } from '../test-utils';

describe('OperationsPage', () => {
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
      if (url.includes('status=FAILED')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              items: [{
                batch_id: 'failed-batch-1',
                project_id: 'proj-1',
                batch_status: 'FAILED',
                total_controls: 50,
                completed_controls: 48,
                failed_controls: 2,
                batch_start_time: '2026-08-01T10:00:00Z',
                batch_end_time: '2026-08-01T11:00:00Z',
              }],
              total: 1,
              page: 1,
              page_size: 20,
            },
          }),
        });
      }
      if (url.includes('/api/v1/execution/history')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
        });
      }
      if (url.includes('/api/v1/execution/failed-batch-1/audit')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              batch_id: 'failed-batch-1',
              control_executions: [{
                id: 'exec-1',
                batch_id: 'failed-batch-1',
                control_id: 'ctrl-1',
                rule_id: 'rule-1',
                entity_name: 'table.users',
                execution_status: 'FAIL',
                delta_value: 5,
                execution_time_seconds: 0.123,
                severity_level: 'ERROR',
                created_at: '2026-08-01T10:30:00Z',
              }],
              exceptions: [],
              governance: null,
            },
          }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<OperationsPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title and description', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    expect(screen.getByText(/Monitoring, alerts/)).toBeInTheDocument();
  });

  it('renders all tabs', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /monitoring/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /alerts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /schedules/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /retry/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /health/i })).toBeInTheDocument();
    });
  });

  it('renders monitoring tab by default', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument();
      expect(screen.getByText('Active Queue')).toBeInTheDocument();
      expect(screen.getByText('Recent Executions')).toBeInTheDocument();
    });
  });

  it('renders alerts tab content', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /alerts/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText(/No active alerts/i)).toBeInTheDocument();
    });
  });

  it('renders health tab content', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /health/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('System Health Details')).toBeInTheDocument();
    });
  });

  it('renders failures tab', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /failures/i })).toBeInTheDocument();
    });
  });

  it('renders failed batch in failures tab', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /failures/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText(/proj-1/)).toBeInTheDocument();
    });
    expect(screen.getByText(/2 failed/)).toBeInTheDocument();
  });

  it('expands failed batch to show control executions', async () => {
    renderWithProviders(<OperationsPage />);
    await waitFor(() => {
      screen.getByRole('tab', { name: /failures/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText(/proj-1/)).toBeInTheDocument();
    });
    const batchRow = screen.getByText(/proj-1/).closest('div');
    if (batchRow) batchRow.click();
    await waitFor(() => {
      expect(screen.getAllByText('FAIL')[0]).toBeInTheDocument();
    });
    expect(screen.getByText('ctrl-1')).toBeInTheDocument();
    expect(screen.getByText('table.users')).toBeInTheDocument();
  });
});
