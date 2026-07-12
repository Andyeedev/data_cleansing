import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from './NavigationContext';

export const Breadcrumb = () => {
  const { breadcrumbs } = useNavigation();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm py-3">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-neutral-40" />
            )}
            {index === 0 && <Home className="w-4 h-4 text-neutral-60" />}
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-neutral-60 hover:text-primary-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-100 font-medium">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
};
