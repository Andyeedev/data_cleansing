import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { PermissionsPage } from './PermissionsPage';

const mockRoles = [
  { id: 'r1', name: 'Tenant Admin', description: null, type: 'system', status: 'active', is_system: true },
  { id: 'r2', name: 'Custom Role', description: null, type: 'custom', status: 'active', is_system: false },
];

const mockGrants = [
  { id: 'p1', name: 'users.list', resource: 'users', action: 'list', category: 'users', granted: true },
];

const mockCatalog = [
  { id: 'p1', name: 'users.list', resource: 'users', action: 'list', category: 'users' },
  { id: 'p2', name: 'roles.assign', resource: 'roles', action: 'assign', category: 'roles' },
];

function seedSuperAdmin() {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({
      id: '1',
      email: 'admin@test.com',
      name: 'admin',
      roles: ['Super Admin'],
      permissions: ['roles:read', 'roles:assign'],
    }),
  );
}

function installFetch() {
  global.fetch = vi.fn().mockImplementation((url: unknown, options?: RequestInit) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    const method = options?.method ?? 'GET';
    if (u.includes('/roles/permissions/list')) {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: mockCatalog }) });
    }
    if (u.includes('/roles/r1/permissions') && method === 'GET') {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: mockGrants }) });
    }
    if (u.includes('/roles/r2/permissions') && method === 'GET') {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: [] }) });
    }
    if (u.includes('/roles') && method === 'POST') {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
    }
    if (u.includes('/roles/') && method === 'DELETE') {
      return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
    }
    if (u.includes('/roles') && !u.includes('/permissions')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { roles: mockRoles, total: 2, page: 1, page_size: 100 } }),
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({ success: true, data: {} }) });
  });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/administration/permissions']}>
      <AuthProvider>
        <PermissionsPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('PermissionsPage canonical grants (E3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    seedSuperAdmin();
    installFetch();
  });

  it('lists roles and the selected role grants with Remove actions', async () => {
    renderPage();
    // Wait for the grants fetch to settle before asserting list contents.
    await waitFor(() => {
      expect(screen.getByLabelText('Remove users.list')).toBeInTheDocument();
    });
    expect(screen.getByText('Assigned grants — Tenant Admin')).toBeInTheDocument();
    expect(screen.getByText('users.list')).toBeInTheDocument();
  });

  it('shows unassigned catalog permissions with Assign actions', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Remove users.list')).toBeInTheDocument();
    });
    expect(screen.getByText('Available permissions')).toBeInTheDocument();
    // users.list is already granted, so only roles.assign is available.
    expect(screen.getByText('roles.assign')).toBeInTheDocument();
    expect(screen.getByLabelText('Assign roles.assign')).toBeInTheDocument();
    expect(screen.queryByLabelText('Assign users.list')).not.toBeInTheDocument();
  });

  it('assigns then refetches grants through the canonical API', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Remove users.list')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Assign roles.assign')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Assign roles.assign'));
    await waitFor(() => {
      const calls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[unknown, RequestInit?]>;
      const posts = calls.filter(([url, options]) => {
        const u = typeof url === 'string' ? url : '';
        return u.includes('/roles/r1/permissions') && options?.method === 'POST';
      });
      expect(posts.length).toBeGreaterThan(0);
    });
  });

  it('contains no legacy pack-matrix writer UI', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Remove users.list')).toBeInTheDocument();
    });
    expect(screen.getByText('Assigned grants — Tenant Admin')).toBeInTheDocument();
    expect(screen.queryByText('Reset to Defaults')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
    expect(screen.queryByText(/report pack/i)).not.toBeInTheDocument();
  });
});
