import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavigationItem as NavigationItemType } from './navigation.types';
import type { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  item: NavigationItemType;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  collapsed?: boolean;
  onClick?: () => void;
}

export const NavigationItem = ({
  item,
  isExpanded,
  onToggleExpand,
  collapsed = false,
  onClick,
}: NavigationItemProps) => {
  const Icon = typeof item.icon === 'string' ? null : (item.icon as LucideIcon);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => onToggleExpand(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
            collapsed ? 'justify-center' : ''
          } text-neutral-80 hover:bg-neutral-20`}
          title={collapsed ? item.label : undefined}
          aria-expanded={isExpanded}
          aria-haspopup="true"
        >
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </>
          )}
        </button>
        {isExpanded && !collapsed && (
          <ul className="ml-4 mt-1 space-y-1">
            {item.children?.map((child) => (
              <li key={child.id}>
                <NavigationItem
                  item={child}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  collapsed={collapsed}
                  onClick={onClick}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
            collapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'bg-primary-50 text-primary-500 font-medium'
              : 'text-neutral-80 hover:bg-neutral-20'
          }`
        }
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {!collapsed && <span>{item.label}</span>}
        {item.badge && !collapsed && (
          <span
            className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
              item.badge.variant === 'error'
                ? 'bg-error-50 text-error-700'
                : item.badge.variant === 'warning'
                ? 'bg-warning-50 text-warning-700'
                : item.badge.variant === 'success'
                ? 'bg-success-50 text-success-700'
                : 'bg-primary-50 text-primary-700'
            }`}
          >
            {item.badge.count || item.badge.text}
          </span>
        )}
      </NavLink>
    </li>
  );
};
