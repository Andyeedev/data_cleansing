import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportsPage } from './ReportsPage';
import { renderWithProviders } from '../test-utils';

describe('ReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<ReportsPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders page title', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0 } }),
    });
    renderWithProviders(<ReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
  });

  it('displays batch selector', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0 } }),
    });
    renderWithProviders(<ReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Select Execution Batch')).toBeInTheDocument();
      expect(screen.getByText('-- Select a batch --')).toBeInTheDocument();
    });
  });

  it('shows empty prompt when no batch selected', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0 } }),
    });
    renderWithProviders(<ReportsPage />);
    await waitFor(() => {
      expect(screen.getByText('Select a Batch')).toBeInTheDocument();
    });
  });
});
