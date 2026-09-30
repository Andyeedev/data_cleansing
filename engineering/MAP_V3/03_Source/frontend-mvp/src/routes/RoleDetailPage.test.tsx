import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import { RoleDetailPage } from './RoleDetailPage';
import { renderWithProviders } from '../test-utils';

const mockRole = {
  id: 'r1',
  name: 'Custom Analyst',
  description: 'Tenant custom role',
  type: 'custom',
  status: 'active',
  is_system: false,
};

const mockAllPermissions = [
  { id: 'p1', name: 'users.list', resource: 'users', action: 'list', category: 'users' },
];

function mockApi() {
  (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: unknown) => {
    const u = typeof url === 'string' ? url : String((url as Request)?.url ?? url);
    if (u.includes('/roles/r1/permissions')) {
      return Promise.resolve({ ok: true, json: async () => ({ success: true, data: [] }) });
    }
    if (u.includes('/roles/permissions/list')) {
      return Promise.resolve({ ok: true, json: async () => ({ success: true, data: mockAllPermissions }) });
    }
    if (u.includes('/roles/r1')) {
      return Promise.resolve({ ok: true, json: async () => ({ success: true, data: mockRole }) });
    }
    return Promise.resolve({ ok: true, json: async () => ({ success: true, data: {} }) });
  });
}

function renderDetail(permissions: string[]) {
  return renderWithProviders(
    <Routes>
      <Route path="/administration/roles/:id" element={<RoleDetailPage />} />
    </Routes>,
    {
      initialRole: 'admin',
      initialPermissions: permissions,
      initialEntries: ['/administration/roles/r1'],
    },
  );
}

describe('RoleDetailPage action affordances (E2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('hides Edit/Delete and disables Assign without their grants', async () => {
    mockApi();
    renderDetail(['roles:list']);
    await waitFor(() => {
      expect(screen.getAllByText('Custom Analyst').length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    const assign = screen.getByText('Assign');
    expect(assign).toBeDisabled();
    expect(assign).toHaveAttribute('title', 'Requires roles:assign');
  });

  it('shows Edit/Delete and enables Assign with their grants', async () => {
    mockApi();
    renderDetail(['roles:list', 'roles:update', 'roles:delete', 'roles:assign']);
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeEnabled();
  });
});
