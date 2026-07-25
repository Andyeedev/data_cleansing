import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';
import { renderWithProviders } from '../test-utils';

const mockPortfolio = {
  total_systems: 5,
  total_batches: 10,
  total_controls: 50,
  active_batches: 2,
};

const mockKPIs = {
  kpis: [
    { label: 'Total Batches', value: '10' },
    { label: 'Active Batches', value: '2' },
    { label: 'Systems Managed', value: '5' },
  ],
};

describe('DashboardPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches portfolio data on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/dashboard/portfolio')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockPortfolio }),
        });
      }
      if (url.includes('/api/v1/dashboard/kpis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockKPIs }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithProviders(<DashboardPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/dashboard/portfolio')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/dashboard/kpis')
      );
    });
  });

  it('displays portfolio data for admin users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/dashboard/portfolio')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockPortfolio }),
        });
      }
      if (url.includes('/api/v1/dashboard/kpis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockKPIs }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithProviders(<DashboardPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Executive Overview')).toBeInTheDocument();
      expect(screen.getAllByText('Total Systems').length).toBeGreaterThan(0);
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Total Batches').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10').length).toBeGreaterThan(0);
    });
  });

  it('displays KPIs from API', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/dashboard/portfolio')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockPortfolio }),
        });
      }
      if (url.includes('/api/v1/dashboard/kpis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockKPIs }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithProviders(<DashboardPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
      expect(screen.getAllByText('Total Batches').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Active Batches').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    });
  });

  it('hides executive overview for viewer users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/dashboard/portfolio')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockPortfolio }),
        });
      }
      if (url.includes('/api/v1/dashboard/kpis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockKPIs }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithProviders(<DashboardPage />, { initialRole: 'viewer' });

    await waitFor(() => {
      expect(screen.queryByText('Executive Overview')).not.toBeInTheDocument();
      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    });
  });

  it('quick actions link to correct routes', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/v1/dashboard/portfolio')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockPortfolio }),
        });
      }
      if (url.includes('/api/v1/dashboard/kpis')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: mockKPIs }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderWithProviders(<DashboardPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Manage Systems')).toHaveAttribute('href', '/systems');
      expect(screen.getByText('Start Migration')).toHaveAttribute('href', '/migration');
      expect(screen.getByText('View Operations')).toHaveAttribute('href', '/operations');
    });
  });
});
