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
      style={{
        display: 'flex',
        gap: 0,
        borderBottom: 'var(--border-width) solid var(--color-border)',
        marginBottom: 'var(--space-md)',
      }}
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
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: isActive ? 'var(--color-surface)' : 'transparent',
              border: 'var(--border-width) solid var(--color-border)',
              borderBottom: isActive ? 'var(--border-width) solid var(--color-surface)' : 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius) var(--radius) 0 0',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              fontSize: 'var(--font-size-base)',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
              marginBottom: -1,
              opacity: tab.disabled ? 0.5 : 1,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
