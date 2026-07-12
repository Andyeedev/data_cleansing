import React from 'react';
import { Paperclip } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlEvidenceItem } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';

interface EvidenceSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

const typeIcons: Record<string, string> = {
  screenshot: '📸',
  document: '📄',
  log: '📋',
  export: '💾',
};

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ section, data }) => {
  const items = (data?.items as HtmlEvidenceItem[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={Paperclip}
    >
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-neutral-20 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{typeIcons[item.type] ?? '📎'}</span>
                <h4 className="font-medium text-neutral-80">{item.title}</h4>
              </div>
              <p className="text-sm text-neutral-60 mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-50">
                <span className="capitalize">{item.type}</span>
                {item.timestamp && <span>{item.timestamp}</span>}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  View Evidence →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-50 text-sm italic">No evidence items attached.</p>
      )}
    </ReportSection>
  );
};
