import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DynamicNavigation } from '../Navigation/DynamicNavigation';
import { adminSectionForPath, visibleAdminSections } from '../../admin/capabilities';

/**
 * Phase B — Administration console shell (spec §4).
 *
 * Persistent rail (the single ADMIN_SECTIONS catalogue filtered by the
 * effective envelope) + detail pane (`<Outlet />`) + breadcrumb
 * `Administration → <Section> → <Detail>`. Section pages render unchanged
 * inside the detail pane (section rewrites belong to Stage E).
 *
 * Rail hiding is UX only: every section route keeps its own ProtectedRoute
 * guard and the backend remains authoritative (spec §13).
 */
export function AdminConsole() {
  const { userRoles, user } = useAuth();
  const location = useLocation();
  const envelope = { roles: userRoles, permissions: user?.permissions ?? [] };

  const visibleSections = visibleAdminSections(envelope);
  const activeSection = adminSectionForPath(location.pathname);

  const railItems = visibleSections.map((section) => ({ ...section }));

  return (
    <div>
      <nav aria-label="Administration breadcrumb" style={{ padding: '8px 0', fontSize: 13 }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 4 }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link to="/administration" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              Administration
            </Link>
          </li>
          {activeSection && activeSection.path !== '/administration' && (
            <li style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>/</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{activeSection.label}</span>
            </li>
          )}
        </ol>
      </nav>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}>
        <nav aria-label="Administration sections" style={{ minWidth: 220 }}>
          <DynamicNavigation items={railItems} currentPath={location.pathname} />
        </nav>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
