import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlRecommendationData } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';

interface RecommendationSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

const priorityStyles: Record<string, string> = {
  high: 'border-l-error-500 bg-error-50',
  medium: 'border-l-warning-500 bg-warning-50',
  low: 'border-l-success-500 bg-success-50',
};

const priorityBadge: Record<string, string> = {
  high: 'bg-error-500 text-neutral-100',
  medium: 'bg-warning-500 text-neutral-100',
  low: 'bg-success-500 text-neutral-100',
};

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({ section, data }) => {
  const recommendations = (data?.recommendations as HtmlRecommendationData[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={Lightbulb}
    >
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`border-l-4 rounded-lg p-4 ${priorityStyles[rec.priority] ?? priorityStyles.medium}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-neutral-100">{rec.title}</h4>
              <span
                className={`px-2 py-1 rounded text-xs font-medium uppercase ${priorityBadge[rec.priority] ?? priorityBadge.medium}`}
              >
                {rec.priority}
              </span>
            </div>
            <p className="text-sm text-neutral-70">{rec.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-50">
              {rec.category && <span>Category: {rec.category}</span>}
              {rec.owner && <span>Owner: {rec.owner}</span>}
            </div>
          </div>
        ))}
      </div>
    </ReportSection>
  );
};
