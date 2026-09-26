import { screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { AdminConsole } from './AdminConsole';

function seedUser(roles: string[], permissions: string[]) {
  localStorage.setItem('access_token', 'mock-jwt-token-for-tests');
  localStorage.setItem(
    'map_nexus_user',
    JSON.stringify({ id: '1', email: 'admin@test.com', name: 'admin', roles, permissions }),
  );
}

const SUPER_PERMS = [
  'users:list', 'roles:list', 'invitations:read', 'settings:read',
  'users:read', 'roles:read', 'invitations:create', 'reports:read',
];

const TENANT_PERMS = ['users:list', 'roles:list', 'invitations:read', 'settings:read'];

function renderConsole(roles: string[], permissions: string[], path: string) {
  seedUser(roles, permissions);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route element={<AdminConsole />}>
            <Route path="/administration/roles" element={<div>Roles detail pane</div>} />
            <Route path="/administration/tenants" element={<div>Tenants detail pane</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AdminConsole shell', () => {
  it('Super Admin rail shows the full surface with breadcrumb and detail', () => {
    renderConsole(['Super Admin'], SUPER_PERMS, '/administration/roles');
    expect(screen.getByText('Administration')).toBeInTheDocument();
    const rail = screen.getByLabelText('Administration sections');
    for (const label of [
      'Overview',
      'Users',
      'Roles & Permissions',
      'Invitations',
      'Registrations',
      'Tenants',
      'Subscriptions',
      'Settings',
      'Feature Flags',
      'Security',
      'Notifications',
      'Maintenance',
    ]) {
      expect(within(rail).getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText('Roles detail pane')).toBeInTheDocument();
  });

  it('Tenant Admin rail hides the platform/global boundary', () => {
    renderConsole(['Tenant Admin'], TENANT_PERMS, '/administration/roles');
    const rail = screen.getByLabelText('Administration sections');
    expect(within(rail).getByText('Users')).toBeInTheDocument();
    expect(within(rail).getByText('Invitations')).toBeInTheDocument();
    for (const hidden of [
      'Tenants',
      'Registrations',
      'Subscriptions',
      'Feature Flags',
      'Security',
      'Notifications',
      'Maintenance',
    ]) {
      expect(within(rail).queryByText(hidden)).not.toBeInTheDocument();
    }
    expect(screen.getByText('Roles detail pane')).toBeInTheDocument();
  });

  it('shows the active section in the breadcrumb', () => {
    renderConsole(['Super Admin'], SUPER_PERMS, '/administration/tenants');
    expect(screen.getByText('Tenants detail pane')).toBeInTheDocument();
    const crumbs = screen.getByLabelText('Administration breadcrumb');
    expect(crumbs).toHaveTextContent('Administration');
    expect(crumbs).toHaveTextContent('Tenants');
  });
});
