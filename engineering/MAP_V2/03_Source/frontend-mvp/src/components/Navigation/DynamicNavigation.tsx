import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MetadataNavItem } from '../../types/metadata';

interface DynamicNavigationProps {
  items: MetadataNavItem[];
  currentPath: string;
  depth?: number;
}

export function DynamicNavigation({ items, currentPath, depth = 0 }: DynamicNavigationProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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

  const INDENT = 16;
  const paddingLeft = 16 + depth * INDENT;

  function handleClick(e: React.MouseEvent) {
    if (hasChildren) {
      e.preventDefault();
      setExpanded((prev) => !prev);
    }
  }

  return (
    <li>
      <Link
        to={item.path}
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `8px ${paddingLeft}px`,
          color: isActive
            ? 'var(--color-sidebar-active)'
            : 'var(--color-sidebar-text)',
          background: isActive ? 'rgba(74, 144, 217, 0.1)' : 'transparent',
          borderRadius: 'var(--radius)',
          textDecoration: 'none',
          fontSize: depth === 0 ? '14px' : '13px',
          fontWeight: depth === 0 ? 600 : 400,
        }}
      >
        <span style={{ flex: 1 }}>{item.label}</span>
        {hasChildren && (
          <span style={{ fontSize: '12px', marginLeft: 4 }}>
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
