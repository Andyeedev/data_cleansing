import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Administration Summary', order: 1, description: 'Overview of platform administration status' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Administration Metrics', order: 2, description: 'Key platform administration indicators' },
  { id: 'tables', type: 'table', title: 'Administration Details', order: 3, description: 'Detailed administration data and records' },
  { id: 'recommendations', type: 'recommendation', title: 'Recommendations', order: 4, description: 'Administrative actions and improvements' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 5, description: 'Configuration and system information' },
];

export const AdministrationTemplate: HtmlReportTemplate = {
  id: 'administration-report',
  name: 'Administration Report',
  type: 'administration',
  description: 'Platform administration report with metrics, configuration, and recommendations',
  sections,
  defaultData: {},
};

ReportRegistry.register(AdministrationTemplate);

export const AdministrationReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
