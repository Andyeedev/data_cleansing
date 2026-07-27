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

  it('renders the migration page on /migration', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/migration'] });
    expect(screen.getByRole('heading', { name: 'Migration' })).toBeInTheDocument();
  });

  it('renders the validation page on /validation', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/validation'] });
    expect(screen.getByRole('heading', { name: 'Validation' })).toBeInTheDocument();
  });

  it('renders the governance page on /governance', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/governance'] });
    expect(screen.getByRole('heading', { name: 'Governance' })).toBeInTheDocument();
  });

  it('renders the reports page on /reports', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/reports'] });
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument();
  });

  it('renders the operations page on /operations', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/operations'] });
    expect(screen.getByRole('heading', { name: 'Operations' })).toBeInTheDocument();
  });

  it('renders the tasks page on /tasks', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/tasks'] });
    expect(screen.getByRole('heading', { name: 'Task Management' })).toBeInTheDocument();
  });

  it('renders the administration page on /administration', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/administration'] });
    expect(screen.getByRole('heading', { name: 'Administration' })).toBeInTheDocument();
  });

  it('renders 404 for unknown routes', () => {
    renderWithProviders(<AppRoutes />, { initialEntries: ['/unknown'] });
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
  });
});
