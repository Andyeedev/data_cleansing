import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import type { PortalDefinition } from '../types/PortalDefinition';

interface PortalBreadcrumbProps {
  portal: PortalDefinition;
}

export const PortalBreadcrumb = ({ portal }: PortalBreadcrumbProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: Home },
    { label: portal.name, path: portal.route },
    ...pathSegments.slice(portal.route.split('/').filter(Boolean).length).map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + portal.route.split('/').filter(Boolean).length + 1).join('/');
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, path };
    }),
  ];

  return (
    <nav className="flex items-center gap-2 mb-4 text-sm" aria-label="Portal Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-neutral-60" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-neutral-100 font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="text-neutral-60 hover:text-primary-500 transition-colors flex items-center gap-1"
            >
              {index === 0 && breadcrumb.icon && <breadcrumb.icon className="w-4 h-4" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
