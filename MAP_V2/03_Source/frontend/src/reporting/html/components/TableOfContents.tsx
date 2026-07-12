import React from 'react';
import { List } from 'lucide-react';
import type { HtmlReportSectionConfig } from '../shared/ReportTypes';
import { useReport } from '../framework/ReportContext';
import { ReportSection } from '../framework/ReportSection';

interface TableOfContentsProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ section }) => {
  const { config, setActiveSection } = useReport();

  if (!config) return null;

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={List}
    >
      <nav aria-label="Table of contents">
        <ul className="space-y-2">
          {config.sections
            .filter((s) => s.visible !== false)
            .map((s, index) => (
              <li key={s.id}>
                <button
                  onClick={() => handleNavigate(s.id)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-neutral-10 transition-colors group"
                >
                  <span className="text-sm font-medium text-neutral-40 w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-neutral-80 group-hover:text-primary-600 transition-colors">
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </ReportSection>
  );
};
