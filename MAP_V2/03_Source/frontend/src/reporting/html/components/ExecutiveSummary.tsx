import React from 'react';
import { FileText } from 'lucide-react';
import type { HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';

interface ExecutiveSummaryProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ section, data }) => {
  const findings = (data?.findings as string[]) ?? [];
  const keyPoints = (data?.keyPoints as string[]) ?? [];
  const summary = (data?.summary as string) ?? '';

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={FileText}
    >
      <div className="bg-primary-50 rounded-lg p-6 border border-primary-20">
        {summary && <p className="text-neutral-90 leading-relaxed mb-4">{summary}</p>}

        {keyPoints.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-neutral-80 uppercase tracking-wide mb-2">
              Key Points
            </h3>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-neutral-80">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {findings.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-80 uppercase tracking-wide mb-2">
              Findings
            </h3>
            <ul className="space-y-2">
              {findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-neutral-80">
                  <span className="text-primary-500 mt-1">→</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ReportSection>
  );
};
