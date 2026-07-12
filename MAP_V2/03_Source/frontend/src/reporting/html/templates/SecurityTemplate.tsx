import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Security Summary', order: 1, description: 'Overview of security posture and compliance' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Security Metrics', order: 2, description: 'Key security indicators and threat levels' },
  { id: 'tables', type: 'table', title: 'Security Events', order: 3, description: 'Detailed security event log' },
  { id: 'audit-trail', type: 'audit-trail', title: 'Audit Trail', order: 4, description: 'Security-related audit events' },
  { id: 'risks', type: 'risk', title: 'Security Risks', order: 5, description: 'Identified security vulnerabilities and risks' },
  { id: 'recommendations', type: 'recommendation', title: 'Security Recommendations', order: 6, description: 'Actions to improve security posture' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 7, description: 'Security policies and compliance frameworks' },
];

export const SecurityTemplate: HtmlReportTemplate = {
  id: 'security-report',
  name: 'Security Report',
  type: 'security',
  description: 'Security assessment report with threat analysis, audit trail, and recommendations',
  sections,
  defaultData: {},
};

ReportRegistry.register(SecurityTemplate);

export const SecurityReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
