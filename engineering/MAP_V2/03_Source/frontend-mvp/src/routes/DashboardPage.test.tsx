import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';
import { renderWithProviders } from '../test-utils';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders page title and description', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { total_systems: 0, total_batches: 0, total_controls: 0, active_batches: 0 } }),
    });
    renderWithProviders(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.getByText(/Migration overview and status/)).toBeInTheDocument();
  });

  it('shows executive overview for admin users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { total_systems: 5, total_batches: 10, total_controls: 50, active_batches: 2 } }),
    });
    renderWithProviders(<DashboardPage />, { initialRole: 'admin' });
    await waitFor(() => {
      expect(screen.getByText('Executive Overview')).toBeInTheDocument();
      expect(screen.getByText('Total Systems')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('shows executive overview for manager users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { total_systems: 3, total_batches: 5, total_controls: 20, active_batches: 1 } }),
    });
    renderWithProviders(<DashboardPage />, { initialRole: 'manager' });
    await waitFor(() => {
      expect(screen.getByText('Executive Overview')).toBeInTheDocument();
    });
  });

  it('hides executive overview for viewer users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { total_systems: 0, total_batches: 0, total_controls: 0, active_batches: 0 } }),
    });
    renderWithProviders(<DashboardPage />, { initialRole: 'viewer' });
    await waitFor(() => {
      expect(screen.queryByText('Executive Overview')).not.toBeInTheDocument();
    });
  });

  it('shows KPI section', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { kpis: [{ label: 'Success Rate', value: '95%' }] } }),
    });
    renderWithProviders(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
    });
  });

  it('shows quick actions section', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    });
    renderWithProviders(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });
});
