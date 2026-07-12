import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Governance Summary', order: 1, description: 'Overview of governance compliance and policy adherence' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Governance Metrics', order: 2, description: 'Key governance performance indicators' },
  { id: 'tables', type: 'table', title: 'Policy Compliance', order: 3, description: 'Detailed compliance status by policy' },
  { id: 'audit-trail', type: 'audit-trail', title: 'Audit Trail', order: 4, description: 'Governance audit events and changes' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 5, description: 'Policy documents and governance framework' },
];

export const GovernanceTemplate: HtmlReportTemplate = {
  id: 'governance-report',
  name: 'Governance Report',
  type: 'governance',
  description: 'Governance compliance report with policy adherence and audit trail',
  sections,
  defaultData: {},
};

ReportRegistry.register(GovernanceTemplate);

export const GovernanceReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
