import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { render } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';

import { MigrationPage } from './MigrationPage';
import { SystemsPage } from './SystemsPage';
import { DiscoveryPage } from './DiscoveryPage';
import { ValidationPage } from './ValidationPage';
import { GovernancePage } from './GovernancePage';
import { OperationsPage } from './OperationsPage';
import { AdministrationPage } from './AdministrationPage';
import { UsersPage } from './UsersPage';
import { RolesPage } from './RolesPage';
import { SettingsPage } from './SettingsPage';
import { TaskManagementPage } from './TaskManagementPage';
import { ApprovalsPage } from './ApprovalsPage';
import { CalendarPage } from './CalendarPage';
import { NotificationsPage } from './NotificationsPage';
import { WorkflowsPage } from './WorkflowsPage';

function renderUnauthenticated(ui: React.ReactElement, path: string) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('map_nexus_user');

  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="*" element={<ProtectedRoute requiredRoles={['admin']}>{ui}</ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function renderWithRole(ui: React.ReactElement, role: string, initialEntries: string[]) {
  return renderWithProviders(
    <ProtectedRoute requiredRoles={['admin']}>{ui}</ProtectedRoute>,
    { initialRole: role, initialEntries },
  );
}

function mockFetchOk(data: unknown = {}) {
  return {
    ok: true,
    json: async () => ({ success: true, data }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (typeof url === 'string') {
      if (url.includes('/workflows')) return mockFetchOk({ workflows: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/systems')) return mockFetchOk([]);
      if (url.includes('/execution/history')) return mockFetchOk({ items: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/execution/status')) return mockFetchOk({ batch_id: '', status: 'IDLE', total_controls: 0, completed_controls: 0, failed_controls: 0, progress: 0 });
      if (url.includes('/monitoring/logs')) return mockFetchOk({ logs: [], total: 0 });
      if (url.includes('/monitoring/alerts')) return mockFetchOk({ alerts: [], total: 0 });
      if (url.includes('/monitoring/queue')) return mockFetchOk({ total_items: 0, running: 0, pending: 0, items: [] });
      if (url.includes('/monitoring/health')) return mockFetchOk({ database: true, api: true, timestamp: null });
      if (url.includes('/monitoring')) return mockFetchOk({ total_executions: 0, active_executions: 0, completed_executions: 0, failed_executions: 0, avg_execution_time: 0 });
      if (url.includes('/users')) return mockFetchOk({ users: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/roles/permissions')) return mockFetchOk([]);
      if (url.includes('/roles')) return mockFetchOk({ roles: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/settings/flags')) return mockFetchOk([]);
      if (url.includes('/settings')) return mockFetchOk([]);
      if (url.includes('/tasks')) return mockFetchOk({ tasks: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/approvals/pending')) return mockFetchOk(0);
      if (url.includes('/approvals')) return mockFetchOk({ approvals: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/calendar/events/upcoming')) return mockFetchOk([]);
      if (url.includes('/calendar/events')) return mockFetchOk({ events: [], total: 0, page: 1, page_size: 20 });
      if (url.includes('/notifications/unread')) return mockFetchOk(0);
      if (url.includes('/notifications/preferences')) return mockFetchOk([]);
      if (url.includes('/notifications')) return mockFetchOk({ notifications: [], total: 0, page: 1, page_size: 20 });
    }
    return mockFetchOk({});
  });
});

const routes: { path: string; heading: string; Component: React.ComponentType }[] = [
  { path: '/migration', heading: 'Migration', Component: MigrationPage },
  { path: '/migration/connections', heading: 'Connection Management', Component: SystemsPage },
  { path: '/migration/discovery', heading: 'Discovery', Component: DiscoveryPage },
  { path: '/migration/validation', heading: 'Validation', Component: ValidationPage },
  { path: '/governance', heading: 'Governance', Component: GovernancePage },
  { path: '/operations', heading: 'Operations', Component: OperationsPage },
  { path: '/administration', heading: 'Administration', Component: AdministrationPage },
  { path: '/administration/users', heading: 'Users', Component: UsersPage },
  { path: '/administration/roles', heading: 'Roles', Component: RolesPage },
  { path: '/administration/settings', heading: 'Settings', Component: SettingsPage },
  { path: '/tasks', heading: 'Task Management', Component: TaskManagementPage },
  { path: '/approvals', heading: 'Approvals', Component: ApprovalsPage },
  { path: '/calendar', heading: 'Calendar', Component: CalendarPage },
  { path: '/notifications', heading: 'Notifications', Component: NotificationsPage },
  { path: '/workflows', heading: 'Workflow Management', Component: WorkflowsPage },
];

describe('PermissionGuard - Unauthenticated redirect', () => {
  routes.forEach(({ path, Component }) => {
    it(`redirects to login for ${path}`, async () => {
      renderUnauthenticated(<Component />, path);
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
    });
  });
});

describe('PermissionGuard - Viewer denied', () => {
  routes.forEach(({ path, heading, Component }) => {
    it(`shows "Access Denied" for viewer on ${path}`, () => {
      renderWithRole(<Component />, 'viewer', [path]);
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: heading })).not.toBeInTheDocument();
    });
  });
});

describe('PermissionGuard - Admin allowed', () => {
  routes.forEach(({ path, heading, Component }) => {
    it(`allows admin access to ${path}`, async () => {
      renderWithRole(<Component />, 'admin', [path]);
      await waitFor(() => {
        expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      });
    });
  });
});
