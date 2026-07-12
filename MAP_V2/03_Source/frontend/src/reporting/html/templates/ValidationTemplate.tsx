import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Validation Summary', order: 1, description: 'Overview of validation results and compliance status' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Validation Metrics', order: 2, description: 'Key validation performance indicators' },
  { id: 'tables', type: 'table', title: 'Validation Results', order: 3, description: 'Detailed validation results by rule and dataset' },
  { id: 'risks', type: 'risk', title: 'Validation Issues', order: 4, description: 'Failed validations and required corrections' },
  { id: 'evidence', type: 'evidence', title: 'Evidence', order: 5, description: 'Supporting evidence and screenshots' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 6, description: 'Validation rules and configuration' },
];

export const ValidationTemplate: HtmlReportTemplate = {
  id: 'validation-report',
  name: 'Validation Report',
  type: 'validation',
  description: 'Data validation report with compliance status, issues, and evidence',
  sections,
  defaultData: {},
};

ReportRegistry.register(ValidationTemplate);

export const ValidationReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
