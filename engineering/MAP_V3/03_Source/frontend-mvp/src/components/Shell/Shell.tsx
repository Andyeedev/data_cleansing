import { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { DynamicNavigation } from '../Navigation/DynamicNavigation';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { filterByPermissions } from '../../utils/filterByPermissions';
import { adminSectionsAsNavItems } from '../../admin/adminSections';
import { resolveServerNavItem } from '../../admin/capabilities';
import { apiGet } from '../../utils/apiClient';
import type { MetadataNavItem } from '../../types/metadata';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STATIC_NAV_ITEMS: MetadataNavItem[] = [
  { id: 'about', label: 'About MAP', path: '/about' },
];

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
    { id: 'validation-centre', label: 'Validation Centre', path: '/validation-centre' },
    { id: 'rules', label: 'Rules', path: '/validation/rules' },
    { id: 'rule-discovery', label: 'Rule Discovery', path: '/validation/rule-discovery' },
    { id: 'results', label: 'Results', path: '/validation/results' },
    { id: 'queue', label: 'Queue', path: '/validation/queue' },
  ]},
  { id: 'governance', label: 'Governance', path: '/governance', children: [
    { id: 'approvals', label: 'Approvals', path: '/governance/approvals', requiredRoles: ['admin', 'compliance-officer', 'manager'] },
    { id: 'risk', label: 'Risk', path: '/governance/risk' },
    { id: 'audit', label: 'Audit', path: '/governance/audit' },
  ]},
  { id: 'reports', label: 'Reports', path: '/reports', children: [
    { id: 'executive', label: 'Executive Pack', path: '/reports/suite/executive', requiredRoles: ['admin', 'manager'] },
    { id: 'operational-pack', label: 'Operational Pack', path: '/reports/suite/operational' },
    { id: 'migration-pack', label: 'Migration Pack', path: '/reports/suite/migration_pack' },
    { id: 'validation-pack', label: 'Validation Pack', path: '/reports/suite/validation_pack' },
    { id: 'governance-pack', label: 'Governance Pack', path: '/reports/suite/governance_pack' },
    { id: 'audit-pack', label: 'Audit Pack', path: '/reports/suite/audit_pack' },
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
  // Phase B: the administration subtree renders from the single
  // ADMIN_SECTIONS catalogue (authoritative model = spec §4.1 + enforced
  // gates), never from a duplicated inline list.
  { id: 'administration', label: 'Administration', path: '/administration', children: adminSectionsAsNavItems() },
];

interface ShellProps {
  navItems?: MetadataNavItem[];
  userRoles?: string[];
}

export function Shell({ navItems: overrideNavItems, userRoles: propRoles }: ShellProps) {
  const { userRoles: ctxRoles, user } = useAuth();
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
          // Phase B: server items pass through capability resolution so the
          // administration subtree converges on the single catalogue instead
          // of the mock's `["admin"]` alias gates. Non-admin items are
          // untouched (out of Phase B scope).
          setRawNavItems([...data.map(resolveServerNavItem), ...STATIC_NAV_ITEMS]);
        }
      })
      .catch(() => {
        setNavError('Navigation unavailable');
      })
      .finally(() => setLoading(false));
  }, [overrideNavItems]);

  const navItems = filterByPermissions(rawNavItems, userRoles, user?.permissions ?? []);

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
