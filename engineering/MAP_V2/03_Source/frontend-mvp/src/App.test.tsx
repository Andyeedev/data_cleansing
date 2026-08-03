import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppRoutes } from './AppRoutes';
import { renderWithProviders } from './test-utils';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    });
  });

  it('redirects / to /dashboard', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });
  });

  it('renders the dashboard on /dashboard', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/dashboard'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });
  });

  it('renders the migration page on /migration', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/migration'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Migration' })).toBeInTheDocument();
    });
  });

  it('renders the validation page on /validation', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/validation'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Validation' })).toBeInTheDocument();
    });
  });

  it('renders the governance page on /governance', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/governance'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Governance' })).toBeInTheDocument();
    });
  });

  it('renders the reports page on /reports', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/reports'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument();
    });
  });

  it('renders the operations page on /operations', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/operations'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Operations' })).toBeInTheDocument();
    });
  });

  it('renders the tasks page on /tasks', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/tasks'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Task Management' })).toBeInTheDocument();
    });
  });

  it('renders the administration page on /administration', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/administration'] });
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Administration' })).toBeInTheDocument();
    });
  });

  it('renders 404 for unknown routes', async () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/unknown'] });
    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });
});
