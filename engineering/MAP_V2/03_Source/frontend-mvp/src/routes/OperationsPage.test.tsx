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
      if (url.includes('/api/v1/execution/history')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { items: [], total: 0, page: 1, page_size: 20 } }),
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
});
