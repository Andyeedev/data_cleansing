import React from 'react';
import { useReport } from './ReportContext';
import type { HtmlReportNavigationItem } from '../shared/ReportTypes';

interface ReportNavigationProps {
  className?: string;
}

const NavigationItem: React.FC<{
  item: HtmlReportNavigationItem;
  activeSection: string | null;
  onNavigate: (sectionId: string) => void;
}> = ({ item, activeSection, onNavigate }) => {
  const isActive = activeSection === item.sectionId;

  return (
    <li>
      <button
        onClick={() => onNavigate(item.sectionId)}
        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-neutral-70 hover:bg-neutral-10 hover:text-neutral-100'
        }`}
        aria-current={isActive ? 'location' : undefined}
      >
        {item.label}
      </button>
      {item.children && item.children.length > 0 && (
        <ul className="ml-4 mt-1">
          {item.children.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const ReportNavigation: React.FC<ReportNavigationProps> = ({ className = '' }) => {
  const { navigation, activeSection, setActiveSection } = useReport();

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (navigation.length === 0) return null;

  return (
    <nav
      className={`bg-neutral-5 border border-neutral-20 rounded-lg p-4 print:hidden ${className}`}
      aria-label="Report navigation"
    >
      <h3 className="text-sm font-semibold text-neutral-80 mb-3 uppercase tracking-wide">
        Contents
      </h3>
      <ul className="space-y-1">
        {navigation.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
        ))}
      </ul>
    </nav>
  );
};
