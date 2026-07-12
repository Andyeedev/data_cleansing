import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Migration Summary', order: 1, description: 'Overview of migration progress and status' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Migration Metrics', order: 2, description: 'Key migration performance indicators' },
  { id: 'tables', type: 'table', title: 'Migration Details', order: 3, description: 'Detailed migration data and records' },
  { id: 'timeline', type: 'audit-trail', title: 'Migration Timeline', order: 4, description: 'Chronological migration events' },
  { id: 'risks', type: 'risk', title: 'Risks & Issues', order: 5, description: 'Identified risks and mitigation strategies' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 6, description: 'Supporting data and configuration' },
];

export const MigrationTemplate: HtmlReportTemplate = {
  id: 'migration-report',
  name: 'Migration Report',
  type: 'migration',
  description: 'Comprehensive migration progress report with metrics, timeline, and risk analysis',
  sections,
  defaultData: {},
};

ReportRegistry.register(MigrationTemplate);

export const MigrationReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
