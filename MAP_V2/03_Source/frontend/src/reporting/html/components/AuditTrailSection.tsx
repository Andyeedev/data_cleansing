import React from 'react';
import { Shield } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlAuditEntry } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';
import { TimelineWidget } from '../../../components/widgets/system/TimelineWidget';

interface AuditTrailSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const AuditTrailSection: React.FC<AuditTrailSectionProps> = ({ section, data }) => {
  const entries = (data?.entries as HtmlAuditEntry[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={Shield}
    >
      {entries.length > 0 ? (
        <TimelineWidget
          config={{
            id: `${section.id}-timeline`,
            type: 'timeline',
            title: 'Audit Trail',
            size: 'full',
          }}
          state="success"
          data={{
            events: entries.map((entry) => ({
              id: entry.id,
              title: entry.action,
              description: entry.details,
              timestamp: entry.timestamp,
              type: entry.type,
            })),
          }}
        />
      ) : (
        <p className="text-neutral-50 text-sm italic">No audit entries recorded.</p>
      )}
    </ReportSection>
  );
};
