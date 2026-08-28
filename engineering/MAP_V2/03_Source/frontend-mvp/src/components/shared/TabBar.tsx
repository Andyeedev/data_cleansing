import { useRef } from 'react';

interface Tab {
  key: string;
  label: string;
  disabled?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  urlBased?: boolean;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, _index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.key === activeTab);

    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabledTabs.length - 1;
        break;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      onTabChange(enabledTabs[nextIndex].key);
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Tabs"
      className="flex gap-0 border-b border-gray-200 mb-4"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.key}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={
              `px-3 py-2 text-sm border border-b-0 -mb-px cursor-pointer transition-colors ` +
              (isActive
                ? 'bg-white border-gray-200 font-semibold text-gray-900 rounded-t-lg'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700 rounded-t-lg') +
              (tab.disabled ? ' opacity-50 cursor-not-allowed' : '')
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
