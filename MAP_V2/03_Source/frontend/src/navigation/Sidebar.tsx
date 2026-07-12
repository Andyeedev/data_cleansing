import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { NavigationGroup } from './NavigationGroup';
import { navigationConfig } from './navigation.config';

export const Sidebar = () => {
  const { sidebarExpanded, toggleSidebar } = useNavigation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-neutral-30 transition-all duration-200 ${
        sidebarExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {sidebarExpanded && (
            <span className="font-semibold text-neutral-100 whitespace-nowrap">
              MAP Nexus
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-neutral-20 rounded transition-colors"
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? (
            <PanelLeftClose className="w-5 h-5 text-neutral-60" />
          ) : (
            <PanelLeftOpen className="w-5 h-5 text-neutral-60" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {navigationConfig.sections.map((section) => (
          <NavigationGroup
            key={section.id}
            label={section.label}
            items={section.items}
            expandedItems={expandedItems}
            onToggleExpand={handleToggleExpand}
            collapsed={!sidebarExpanded}
          />
        ))}
      </nav>
    </aside>
  );
};
