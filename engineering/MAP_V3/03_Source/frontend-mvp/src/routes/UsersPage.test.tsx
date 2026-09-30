import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersPage } from './UsersPage';
import { renderWithProviders } from '../test-utils';

const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    display_name: 'Admin User',
    phone: '+1234567890',
    status: 'active',
    department: 'Engineering',
    last_login_at: '2026-07-20T10:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Doe',
    display_name: null,
    phone: null,
    status: 'inactive',
    department: null,
    last_login_at: null,
    created_at: '2026-02-01T00:00:00Z',
  },
];

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('shows permission error for non-admin users', () => {
    renderWithProviders(<UsersPage />, { initialRole: 'viewer' });
    expect(screen.getByText(/You do not have permission/)).toBeInTheDocument();
  });

  it('renders loading state initially', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders users list after loading', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          users: mockUsers,
          total: 2,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('renders empty state when no users', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          users: [],
          total: 0,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  it('renders error state on API failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('HTTP 500'));

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays active status badge correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          users: [mockUsers[0]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  it('displays inactive status badge correctly', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          users: [mockUsers[1]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByText('inactive')).toBeInTheDocument();
    });
  });

  it('shows "Never" for users who have not logged in', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          users: [mockUsers[1]],
          total: 1,
          page: 1,
          page_size: 20,
        },
      }),
    });

    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });

    await waitFor(() => {
      expect(screen.getByText('Never')).toBeInTheDocument();
    });
  });
});

describe('UsersPage action affordances (E1)', () => {
  const listOk = {
    ok: true,
    json: async () => ({
      success: true,
      data: { users: mockUsers, total: 2, page: 1, page_size: 20 },
    }),
  };
  const subscriptionOk = (current: number, max: number) => ({
    ok: true,
    json: async () => ({
      success: true,
      data: {
        subscription: {
          plan_tier: 'professional',
          plan_name: 'Professional',
          status: 'active',
          trial_end_date: null,
          billing_cycle: 'annual',
          end_date: null,
          limits: {
            projects: { current: 1, max: 3 },
            users: { current, max },
            connections: { current: 1, max: 5 },
          },
        },
      },
    }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockApi(subUsers = { current: 2, max: 5 }) {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: unknown) => {
      const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
      if (u.includes('/auth/me')) return Promise.resolve(subscriptionOk(subUsers.current, subUsers.max));
      return Promise.resolve(listOk);
    });
  }

  it('hides Add and Delete without their grants', async () => {
    mockApi();
    renderWithProviders(<UsersPage />, { initialRole: 'admin', initialPermissions: ['users:list'] });
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
    expect(screen.queryByText('Add User')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete Admin User')).not.toBeInTheDocument();
  });

  it('shows Add and Delete with their grants', async () => {
    mockApi();
    renderWithProviders(
      <UsersPage />,
      { initialRole: 'admin', initialPermissions: ['users:list', 'users:create', 'users:delete'] },
    );
    await waitFor(() => {
      expect(screen.getByText('Add User')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Delete Admin User')).toBeInTheDocument();
  });

  it('disables Add User at the seat limit with an explanatory note', async () => {
    mockApi({ current: 5, max: 5 });
    renderWithProviders(
      <UsersPage />,
      { initialRole: 'admin', initialPermissions: ['users:list', 'users:create', 'users:delete'] },
    );
    await waitFor(() => {
      expect(screen.getByText('Add User')).toBeInTheDocument();
    });
    expect(screen.getByText('Add User')).toBeDisabled();
    expect(screen.getByText(/seat limit reached/)).toBeInTheDocument();
  });
});
