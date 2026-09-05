import { useLocation, Link } from 'react-router-dom';
import type { MetadataNavItem } from '../../types/metadata';

interface BreadcrumbProps {
  navItems: MetadataNavItem[];
}

export function Breadcrumb({ navItems }: BreadcrumbProps) {
  const location = useLocation();
  const crumbs = findCrumbs(navItems, location.pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" style={{ padding: '8px 0', fontSize: 13 }}>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: 4 }}>
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: 'var(--color-text-secondary)' }}>/</span>}
            {i < crumbs.length - 1 ? (
              <Link
                to={crumb.path}
                style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function findCrumbs(
  items: MetadataNavItem[],
  pathname: string,
): { label: string; path: string }[] {
  for (const item of items) {
    if (item.path === pathname) {
      return [{ label: item.label, path: item.path }];
    }
    if (item.children) {
      const childCrumbs = findCrumbs(item.children, pathname);
      if (childCrumbs.length > 0) {
        return [{ label: item.label, path: item.path }, ...childCrumbs];
      }
    }
  }
  return [];
}
