import React from 'react';
import type { HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportRegistry } from '../framework/ReportRegistry';

const sections: HtmlReportSectionConfig[] = [
  { id: 'cover', type: 'cover', title: 'Cover Page', order: 0 },
  { id: 'summary', type: 'summary', title: 'Risk Summary', order: 1, description: 'Overview of risk posture and exposure' },
  { id: 'kpi-metrics', type: 'kpi', title: 'Risk Metrics', order: 2, description: 'Key risk indicators and scores' },
  { id: 'charts', type: 'chart', title: 'Risk Visualisations', order: 3, description: 'Risk distribution and trend charts' },
  { id: 'risks', type: 'risk', title: 'Risk Register', order: 4, description: 'Detailed risk register with mitigations' },
  { id: 'recommendations', type: 'recommendation', title: 'Risk Mitigations', order: 5, description: 'Recommended actions to reduce risk exposure' },
  { id: 'appendix', type: 'appendix', title: 'Appendix', order: 6, description: 'Risk methodology and scoring criteria' },
];

export const RiskTemplate: HtmlReportTemplate = {
  id: 'risk-report',
  name: 'Risk Report',
  type: 'risk',
  description: 'Risk assessment report with register, analysis, and mitigation strategies',
  sections,
  defaultData: {},
};

ReportRegistry.register(RiskTemplate);

export const RiskReport: React.FC = () => {
  return <>{/* Template registered - use HtmlReport component with this template */}</>;
};
