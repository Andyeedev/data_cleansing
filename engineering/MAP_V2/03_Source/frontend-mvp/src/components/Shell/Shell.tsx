import { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { DynamicNavigation } from '../Navigation/DynamicNavigation';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { filterByPermissions } from '../../utils/filterByPermissions';
import { apiGet } from '../../utils/apiClient';
import type { MetadataNavItem } from '../../types/metadata';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_NAV: MetadataNavItem[] = [
  { id: 'home', label: 'Home', path: '/', children: [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  ]},
  { id: 'migration', label: 'Migration', path: '/migration', children: [
    { id: 'projects', label: 'Projects', path: '/migration/projects' },
    { id: 'datasets', label: 'Datasets', path: '/migration/datasets' },
    { id: 'schedules', label: 'Schedules', path: '/migration/schedules' },
    { id: 'connections', label: 'Connections', path: '/migration/connections' },
    { id: 'discovery', label: 'Discovery', path: '/migration/discovery' },
    { id: 'discovery-tree', label: 'Discovery Tree', path: '/migration/discovery/tree' },
    { id: 'mappings', label: 'Mappings', path: '/migration/mappings/spreadsheet' },
    { id: 'column-mappings', label: 'Column Mappings', path: '/migration/mappings/spreadsheet' },
    { id: 'execution', label: 'Execution', path: '/migration/execution' },
  ]},
  { id: 'validation', label: 'Validation', path: '/validation', children: [
    { id: 'rules', label: 'Rules', path: '/validation/rules' },
    { id: 'rule-discovery', label: 'Rule Discovery', path: '/validation/rule-discovery' },
    { id: 'controls', label: 'Controls', path: '/validation/controls' },
    { id: 'dependencies', label: 'Dependencies', path: '/validation/dependencies', requiredRoles: ['admin'] },
    { id: 'results', label: 'Results', path: '/validation/results' },
    { id: 'queue', label: 'Queue', path: '/validation/queue' },
    { id: 'validation-dashboard', label: 'Validation Dashboard', path: '/validation/dashboard' },
  ]},
  { id: 'governance', label: 'Governance', path: '/governance', children: [
    { id: 'approvals', label: 'Approvals', path: '/governance/approvals', requiredRoles: ['admin', 'compliance-officer', 'manager'] },
    { id: 'risk', label: 'Risk', path: '/governance/risk' },
    { id: 'audit', label: 'Audit', path: '/governance/audit' },
  ]},
  { id: 'reports', label: 'Reports', path: '/reports', children: [
    { id: 'executive', label: 'Executive', path: '/reports/executive', requiredRoles: ['admin', 'manager'] },
  ]},
  { id: 'operations', label: 'Operations', path: '/operations', children: [
    { id: 'execution', label: 'Execution', path: '/operations/execution' },
    { id: 'monitoring', label: 'Monitoring', path: '/operations/monitoring' },
    { id: 'alerts', label: 'Alerts', path: '/operations/alerts' },
    { id: 'schedules', label: 'Schedules', path: '/operations/schedules' },
    { id: 'retry', label: 'Retry', path: '/operations/retry' },
    { id: 'health', label: 'Health', path: '/operations/health' },
  ]},
  { id: 'tasks', label: 'Task Management', path: '/tasks' },
  { id: 'administration', label: 'Administration', path: '/administration', requiredRoles: ['admin'] },
];

interface ShellProps {
  navItems?: MetadataNavItem[];
  userRoles?: string[];
}

export function Shell({ navItems: overrideNavItems, userRoles: propRoles }: ShellProps) {
  const { userRoles: ctxRoles } = useAuth();
  const userRoles = propRoles ?? ctxRoles;
  const location = useLocation();
  const [rawNavItems, setRawNavItems] = useState<MetadataNavItem[]>(
    overrideNavItems ?? DEFAULT_NAV,
  );
  const [loading, setLoading] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);

  useEffect(() => {
    if (overrideNavItems) return;

    apiGet<MetadataNavItem[]>('/navigation')
      .then((data) => {
        if (Array.isArray(data)) {
          setRawNavItems(data);
        }
      })
      .catch(() => {
        setNavError('Navigation unavailable');
      })
      .finally(() => setLoading(false));
  }, [overrideNavItems]);

  const navItems = filterByPermissions(rawNavItems, userRoles);

  return (
    <Layout
      sidebar={
        <nav aria-label="Main navigation" role="navigation">
          {navError && (
            <div role="alert" style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>
              {navError}
            </div>
          )}
          <DynamicNavigation items={navItems} currentPath={location.pathname} />
        </nav>
      }
      breadcrumb={<Breadcrumb navItems={navItems} />}
      loading={loading}
    >
      <Outlet />
    </Layout>
  );
}
