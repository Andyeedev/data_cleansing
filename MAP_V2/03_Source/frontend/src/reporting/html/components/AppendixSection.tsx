import React from 'react';
import { BookOpen } from 'lucide-react';
import type { HtmlReportSectionConfig } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';

interface AppendixSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const AppendixSection: React.FC<AppendixSectionProps> = ({ section, data }) => {
  const items = (data?.items as { title: string; content: string }[]) ?? [];
  const content = (data?.content as string) ?? '';

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={BookOpen}
    >
      {content && <div className="text-neutral-80 whitespace-pre-wrap">{content}</div>}

      {items.length > 0 && (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index}>
              <h4 className="font-medium text-neutral-80 mb-2">{item.title}</h4>
              <div className="text-sm text-neutral-70 whitespace-pre-wrap pl-4 border-l-2 border-neutral-20">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </ReportSection>
  );
};
