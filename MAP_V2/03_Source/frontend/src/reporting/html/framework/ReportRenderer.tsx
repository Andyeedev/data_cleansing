import React from 'react';
import type { HtmlReportConfig, HtmlReportSectionConfig, HtmlReportMetadata, HtmlReportNavigationItem } from '../shared/ReportTypes';
import { ReportFactory } from './ReportFactory';
import { ReportProvider } from './ReportContext';
import { ReportLayout } from './ReportLayout';

interface ReportRendererProps {
  config: HtmlReportConfig;
  metadata?: HtmlReportMetadata | null;
  sectionComponents: Record<string, React.ComponentType<{ section: HtmlReportSectionConfig; data?: Record<string, unknown> }>>;
  sectionData?: Record<string, Record<string, unknown>>;
  showNavigation?: boolean;
  className?: string;
}

const buildNavigation = (sections: HtmlReportSectionConfig[]): HtmlReportNavigationItem[] => {
  return sections
    .filter((s) => s.visible !== false)
    .map((s) => ({
      id: s.id,
      label: s.title,
      sectionId: s.id,
      icon: s.icon,
      children: s.children ? buildNavigation(s.children) : undefined,
    }));
};

export const ReportRenderer: React.FC<ReportRendererProps> = ({
  config,
  metadata: metadataProp,
  sectionComponents,
  sectionData = {},
  showNavigation = true,
  className = '',
}) => {
  const metadata = metadataProp ?? ReportFactory.createMetadata(config);
  const navigation = buildNavigation(config.sections);
  const visibleSections = ReportFactory.getVisibleSections(config.sections);
  const sortedSections = ReportFactory.sortSectionsByOrder(visibleSections);

  return (
    <ReportProvider config={config} metadata={metadata} navigation={navigation}>
      <ReportLayout showNavigation={showNavigation}>
        <div className={className}>
          {sortedSections.map((section) => {
            const SectionComponent = sectionComponents[section.type];
            if (!SectionComponent) {
              console.warn(`No component registered for section type: ${section.type}`);
              return null;
            }
            return (
              <SectionComponent
                key={section.id}
                section={section}
                data={sectionData[section.id]}
              />
            );
          })}
        </div>
      </ReportLayout>
    </ReportProvider>
  );
};

export { ReportFactory };
