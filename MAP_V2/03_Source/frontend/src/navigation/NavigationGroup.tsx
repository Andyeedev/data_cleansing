import { NavigationItem } from './NavigationItem';
import type { NavigationItem as NavigationItemType } from './navigation.types';

interface NavigationGroupProps {
  label?: string;
  items: NavigationItemType[];
  expandedItems: string[];
  onToggleExpand: (id: string) => void;
  collapsed?: boolean;
  onClick?: () => void;
}

export const NavigationGroup = ({
  label,
  items,
  expandedItems,
  onToggleExpand,
  collapsed = false,
  onClick,
}: NavigationGroupProps) => {
  return (
    <div className="mb-4">
      {label && !collapsed && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-60 uppercase tracking-wider">
          {label}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isExpanded={expandedItems.includes(item.id)}
            onToggleExpand={onToggleExpand}
            collapsed={collapsed}
            onClick={onClick}
          />
        ))}
      </ul>
    </div>
  );
};
