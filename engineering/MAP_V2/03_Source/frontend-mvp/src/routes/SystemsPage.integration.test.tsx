import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemsPage } from './SystemsPage';
import { renderWithProviders } from '../test-utils';

const mockSystems = [
  {
    system_id: '1',
    system_name: 'Source DB',
    system_role: 'SOURCE',
    database_type: 'POSTGRES',
    credential_id: 'cred-1',
  },
  {
    system_id: '2',
    system_name: 'Target DB',
    system_role: 'TARGET',
    database_type: 'SQLSERVER',
    credential_id: 'cred-2',
  },
];

describe('SystemsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches systems on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0]).toContain('/api/v1/systems');
    });
  });

  it('role filter updates displayed systems', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const roleFilter = screen.getByDisplayValue('All Roles');
    fireEvent.change(roleFilter, { target: { value: 'SOURCE' } });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
      expect(screen.queryByText('Target DB')).not.toBeInTheDocument();
    });
  });

  it('database type filter updates displayed systems', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystems,
      }),
    });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const dbTypeFilter = screen.getByDisplayValue('All Database Types');
    fireEvent.change(dbTypeFilter, { target: { value: 'POSTGRES' } });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
      expect(screen.queryByText('Target DB')).not.toBeInTheDocument();
    });
  });

  it('test connection button triggers API call', async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSystems,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { status: 'success', message: 'Source DB connected' },
        }),
      });

    renderWithProviders(<SystemsPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Source DB')).toBeInTheDocument();
    });

    const testButtons = screen.getAllByText('Test');
    fireEvent.click(testButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });
});
