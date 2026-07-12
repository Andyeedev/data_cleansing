import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Executive Summary', order: 1, description: 'High-level overview of key findings and recommendations' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Key Performance Indicators', order: 2, description: 'Critical metrics and performance indicators' },
  { id: 'charts', type: 'chart', title: 'Visualisations', order: 3, description: 'Charts and graphs supporting the analysis' },
  { id: 'recommendations', type: 'recommendation', title: 'Recommendations', order: 4, description: 'Strategic recommendations and action items' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 5, description: 'Supporting data and additional information' },
];

export const ExecutiveTemplate: HtmlReportTemplate = {
  id: 'executive-report',
  name: 'Executive Report',
  type: 'executive',
  description: 'High-level executive summary report with KPIs, insights, and strategic recommendations',
  sections,
  defaultData: {},
};

ReportRegistry.register(ExecutiveTemplate);

export const ExecutiveReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
