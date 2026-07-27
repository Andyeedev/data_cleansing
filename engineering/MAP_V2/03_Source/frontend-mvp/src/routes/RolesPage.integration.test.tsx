import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RolesPage } from './RolesPage';
import { renderWithProviders } from '../test-utils';

const mockRoles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    type: 'system',
    is_system: true,
    is_default: false,
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Management access',
    type: 'custom',
    is_system: false,
    is_default: false,
    status: 'active',
    created_at: '2026-02-01T00:00:00Z',
  },
];

describe('RolesPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('fetches roles on mount', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          roles: mockRoles,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<RolesPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/roles'),
        expect.anything()
      );
    });
  });

  it('displays correct number of role rows', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          roles: mockRoles,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<RolesPage />, { initialRole: 'admin' });

    await waitFor(() => {
      const viewButtons = screen.getAllByText('View');
      expect(viewButtons).toHaveLength(2);
    });
  });

  it('status filter triggers refetch with status param', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          roles: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<RolesPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const statusSelect = screen.getByDisplayValue('All Status');
    fireEvent.change(statusSelect, { target: { value: 'active' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=active'),
        expect.anything()
      );
    });
  });

  it('pagination shows when total exceeds page size', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          roles: mockRoles,
          total: 25,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<RolesPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  it('next page button fetches next page', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          roles: mockRoles,
          total: 25,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<RolesPage />, { initialRole: 'admin' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.anything()
      );
    });
  });
});
