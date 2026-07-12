import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlRiskData } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';

interface RiskSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

const ratingStyles: Record<string, string> = {
  critical: 'bg-error-50 border-error-500 text-error-700',
  high: 'bg-warning-50 border-warning-500 text-warning-700',
  medium: 'bg-information-50 border-information-500 text-information-700',
  low: 'bg-success-50 border-success-500 text-success-700',
};

const ratingBadge: Record<string, string> = {
  critical: 'bg-error-500 text-neutral-100',
  high: 'bg-warning-500 text-neutral-100',
  medium: 'bg-information-500 text-neutral-100',
  low: 'bg-success-500 text-neutral-100',
};

export const RiskSection: React.FC<RiskSectionProps> = ({ section, data }) => {
  const risks = (data?.risks as HtmlRiskData[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={AlertTriangle}
    >
      <div className="space-y-4">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className={`border-l-4 rounded-lg p-4 ${ratingStyles[risk.rating] ?? ratingStyles.medium}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{risk.title}</h4>
              <span
                className={`px-2 py-1 rounded text-xs font-medium uppercase ${ratingBadge[risk.rating] ?? ratingBadge.medium}`}
              >
                {risk.rating}
              </span>
            </div>
            <p className="text-sm mb-2">{risk.description}</p>
            {risk.mitigation && (
              <p className="text-sm mt-2">
                <span className="font-medium">Mitigation:</span> {risk.mitigation}
              </p>
            )}
            {risk.owner && (
              <p className="text-xs mt-1 opacity-75">Owner: {risk.owner}</p>
            )}
          </div>
        ))}
      </div>
    </ReportSection>
  );
};
