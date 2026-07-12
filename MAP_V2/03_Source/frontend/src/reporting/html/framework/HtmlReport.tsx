import React from 'react';
import type { HtmlReportConfig, HtmlReportMetadata, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRenderer } from './ReportRenderer';

// Section components
import { CoverPage } from '../components/CoverPage';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { TableOfContents } from '../components/TableOfContents';
import { KPISection } from '../components/KPISection';
import { ChartSection } from '../components/ChartSection';
import { TableSection } from '../components/TableSection';
import { RiskSection } from '../components/RiskSection';
import { RecommendationSection } from '../components/RecommendationSection';
import { AppendixSection } from '../components/AppendixSection';
import { AuditTrailSection } from '../components/AuditTrailSection';
import { EvidenceSection } from '../components/EvidenceSection';

interface HtmlReportProps {
  config: HtmlReportConfig;
  metadata?: HtmlReportMetadata | null;
  sectionData?: Record<string, Record<string, unknown>>;
  showNavigation?: boolean;
  className?: string;
}

const defaultSectionComponents: Record<
  string,
  React.ComponentType<{ section: HtmlReportSectionConfig; data?: Record<string, unknown> }>
> = {
  cover: CoverPage,
  summary: ExecutiveSummary,
  toc: TableOfContents,
  kpi: KPISection,
  chart: ChartSection,
  table: TableSection,
  risk: RiskSection,
  recommendation: RecommendationSection,
  appendix: AppendixSection,
  'audit-trail': AuditTrailSection,
  evidence: EvidenceSection,
};

export const HtmlReport: React.FC<HtmlReportProps> = ({
  config,
  metadata,
  sectionData = {},
  showNavigation = true,
  className = '',
}) => {
  return (
    <ReportRenderer
      config={config}
      metadata={metadata}
      sectionComponents={defaultSectionComponents}
      sectionData={sectionData}
      showNavigation={showNavigation}
      className={className}
    />
  );
};

export { ReportRenderer };
export { ReportFactory } from './ReportFactory';
export { ReportRegistry } from './ReportRegistry';
export { ReportProvider, useReport } from './ReportContext';
