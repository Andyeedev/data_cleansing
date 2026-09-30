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
  // OC-REPORT-001 Report Studio.
  //
  // It lives in STATIC_NAV_ITEMS, not inside DEFAULT_NAV, because once the
  // server catalogue is fetched the rendered nav is `mergeNavItems(server,
  // STATIC_NAV_ITEMS)` - DEFAULT_NAV is only the pre-fetch fallback. The server
  // already owns a `reports` group, so a child added to DEFAULT_NAV's copy of
  // that group is discarded at merge time.
  //
  // Gated on the canonical `reports:read` permission, which /auth/me already
  // returns, so visibility derives from the existing RBAC store rather than a
  // nav-local role list. The `report_studio` entitlement stays enforced where it
  // always was, by /catalog, so a tenant without the add-on gets a named,
  // actionable denial rather than a broken page.
  {
    id: 'report-studio',
    label: 'Report Studio',
    path: '/reports/studio',
    requiredPermissions: ['reports:read'],
  },
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

/**
 * Merge server navigation over the static catalogue.
 *
 * The previous implementation appended the two lists:
 *
 *     [...serverItems, ...STATIC_NAV_ITEMS]
 *
 * Both lists define an item with `id: 'reports'`, so React received two
 * children with the same key and rendered only one of them - silently discarding
 * the other. In practice the server's group always won, which is why additions to
 * DEFAULT_NAV under an existing id never appeared in the sidebar.
 *
 * This merges BY ID instead: the server entry supplies the scalar fields, and
 * children are unioned (server first, then any static child not already
 * present). That keeps the server's extra entries such as Templates and
 * Distribution while still allowing a static addition like Report Studio to
 * appear, and it removes the duplicate-key defect for every other group too.
 */
export function mergeNavItems(
  serverItems: MetadataNavItem[],
  staticItems: MetadataNavItem[],
): MetadataNavItem[] {
  const byId = new Map<string, MetadataNavItem>();

  for (const item of staticItems) byId.set(item.id, item);

  for (const item of serverItems) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
      continue;
    }
    const children: MetadataNavItem[] = [...(item.children ?? [])];
    // Key on BOTH id and path: the two catalogues name the same page with
    // different ids (`operational-reports` vs `operational-pack`), and merging on
    // id alone would render that link twice.
    const seenIds = new Set(children.map((c) => c.id));
    const seenPaths = new Set(children.map((c) => c.path));
    for (const child of existing.children ?? []) {
      if (!seenIds.has(child.id) && !seenPaths.has(child.path)) {
        children.push(child);
        seenIds.add(child.id);
        seenPaths.add(child.path);
      }
    }
    byId.set(item.id, { ...existing, ...item, children });
  }

  return [...byId.values()];
}

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
          setRawNavItems(mergeNavItems(
            data.map(resolveServerNavItem), STATIC_NAV_ITEMS));
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
