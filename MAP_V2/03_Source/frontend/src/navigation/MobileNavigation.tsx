import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { NavigationGroup } from './NavigationGroup';
import { navigationConfig } from './navigation.config';

export const MobileNavigation = () => {
  const { mobileDrawerOpen, setMobileDrawerOpen } = useNavigation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-200 lg:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-neutral-100">MAP Nexus</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-neutral-20 rounded transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-neutral-60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto p-4 h-[calc(100%-4rem)]">
          {navigationConfig.sections.map((section) => (
            <NavigationGroup
              key={section.id}
              label={section.label}
              items={section.items}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
              onClick={handleClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};
