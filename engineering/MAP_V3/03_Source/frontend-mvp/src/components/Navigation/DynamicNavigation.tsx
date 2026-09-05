import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { MetadataNavItem } from '../../types/metadata';

interface DynamicNavigationProps {
  items: MetadataNavItem[];
  currentPath: string;
  depth?: number;
}

export function DynamicNavigation({ items, currentPath, depth = 0 }: DynamicNavigationProps) {
  return (
    <ul role={depth === 0 ? 'tree' : 'group'} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          currentPath={currentPath}
          depth={depth}
        />
      ))}
    </ul>
  );
}

function NavigationItem({
  item,
  currentPath,
  depth,
}: {
  item: MetadataNavItem;
  currentPath: string;
  depth: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentPath === item.path;
  const isChildActive = hasChildren && item.children!.some(
    (child) => currentPath.startsWith(child.path),
  );
  const [expanded, setExpanded] = useState(isChildActive);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const INDENT = 16;
  const paddingLeft = 16 + depth * INDENT;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setExpanded((prev) => !prev);
    }
  }, [hasChildren]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (hasChildren) {
        setExpanded((prev) => !prev);
      }
    }
  }, [hasChildren]);

  return (
    <li role="treeitem" aria-expanded={hasChildren ? expanded : undefined} aria-selected={isActive}>
      <Link
        ref={linkRef}
        to={item.path}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'page' : undefined}
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `var(--space-sm) ${paddingLeft}px`,
          color: isActive
            ? 'var(--color-sidebar-active)'
            : 'var(--color-sidebar-text)',
          background: isActive ? 'rgba(74, 144, 217, 0.1)' : 'transparent',
          borderRadius: 'var(--radius)',
          textDecoration: 'none',
          fontSize: depth === 0 ? 'var(--font-size-base)' : 'var(--font-size-sm)',
          fontWeight: depth === 0 ? 600 : 400,
        }}
      >
        <span style={{ flex: 1 }}>{item.label}</span>
        {hasChildren && (
          <span
            aria-hidden="true"
            style={{ fontSize: 'var(--font-size-xs)', marginLeft: 'var(--space-xs)' }}
          >
            {expanded ? '▾' : '▸'}
          </span>
        )}
      </Link>
      {hasChildren && expanded && (
        <DynamicNavigation
          items={item.children!}
          currentPath={currentPath}
          depth={depth + 1}
        />
      )}
    </li>
  );
}
