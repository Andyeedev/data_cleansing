import { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { DynamicNavigation } from '../Navigation/DynamicNavigation';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { filterByPermissions } from '../../utils/filterByPermissions';
import type { MetadataNavItem } from '../../types/metadata';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_NAV: MetadataNavItem[] = [
  { id: 'home', label: 'Home', path: '/', children: [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  ]},
  { id: 'migration', label: 'Migration', path: '/migration', children: [
    { id: 'projects', label: 'Projects', path: '/migration/projects' },
    { id: 'connections', label: 'Connections', path: '/migration/connections' },
    { id: 'discovery', label: 'Discovery', path: '/migration/discovery' },
    { id: 'mappings', label: 'Mappings', path: '/migration/mappings' },
    { id: 'column-mappings', label: 'Column Mappings', path: '/migration/column-mappings' },
    { id: 'execution', label: 'Execution', path: '/migration/execution' },
    { id: 'history', label: 'History', path: '/migration/history' },
  ]},
  { id: 'validation', label: 'Validation', path: '/validation', children: [
    { id: 'rules', label: 'Rules', path: '/validation/rules' },
    { id: 'results', label: 'Results', path: '/validation/results' },
    { id: 'queue', label: 'Queue', path: '/validation/queue' },
    { id: 'controls', label: 'Controls', path: '/validation/controls' },
  ]},
  { id: 'governance', label: 'Governance', path: '/governance', children: [
    { id: 'approvals', label: 'Approvals', path: '/governance/approvals', requiredRoles: ['admin', 'compliance-officer', 'manager'] },
    { id: 'risk', label: 'Risk', path: '/governance/risk' },
    { id: 'audit', label: 'Audit', path: '/governance/audit' },
  ]},
  { id: 'reports', label: 'Reports', path: '/reports', children: [
    { id: 'executive', label: 'Executive', path: '/reports/executive', requiredRoles: ['admin', 'manager'] },
  ]},
  { id: 'operations', label: 'Operations', path: '/operations' },
  { id: 'tasks', label: 'Task Management', path: '/tasks' },
  { id: 'administration', label: 'Administration', path: '/administration', requiredRoles: ['admin'] },
];

const NAV_API_URL = '/api/v1/navigation';

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

  useEffect(() => {
    if (overrideNavItems) return;

    fetch(NAV_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setRawNavItems(json.data);
        }
      })
      .catch(() => {
        // API unavailable — keep DEFAULT_NAV
      })
      .finally(() => setLoading(false));
  }, [overrideNavItems]);

  const navItems = filterByPermissions(rawNavItems, userRoles);

  return (
    <Layout
      sidebar={<DynamicNavigation items={navItems} currentPath={location.pathname} />}
      breadcrumb={<Breadcrumb navItems={navItems} />}
      loading={loading}
    >
      <Outlet />
    </Layout>
  );
}
