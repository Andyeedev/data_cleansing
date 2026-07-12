import { useState } from 'react';
import { useNavigation } from '../navigation/NavigationContext';
import { NavigationItem } from '../navigation/NavigationItem';
import { navigationConfig } from '../navigation/navigation.config';

export const Sidebar = () => {
  const { sidebarExpanded, mobileDrawerOpen, toggleMobileDrawer } = useNavigation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileDrawer}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          bg-white border-r border-neutral-30
          transition-all duration-300 ease-in-out
          ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarExpanded ? 'w-64' : 'w-16'}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center border-b border-neutral-30 px-4">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {sidebarExpanded && (
            <span className="ml-3 text-lg font-semibold text-neutral-100 whitespace-nowrap">
              MAP Nexus™
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {navigationConfig.sections.map((section) => (
            <div key={section.id} className="mb-4">
              {sidebarExpanded && section.label && (
                <div className="px-3 py-2 text-xs font-semibold text-neutral-60 uppercase tracking-wider">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.has(item.id)}
                  onToggleExpand={handleToggleExpand}
                  collapsed={!sidebarExpanded}
                />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
