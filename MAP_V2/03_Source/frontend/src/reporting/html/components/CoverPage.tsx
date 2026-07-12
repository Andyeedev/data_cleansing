import React from 'react';
import { FileText } from 'lucide-react';
import type { HtmlReportSectionConfig } from '../shared/ReportTypes';
import { useReport } from '../framework/ReportContext';

interface CoverPageProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const CoverPage: React.FC<CoverPageProps> = ({ section, data }) => {
  const { config, metadata } = useReport();

  const title = (data?.title as string) ?? config?.name ?? 'Report';
  const subtitle = (data?.subtitle as string) ?? config?.description ?? '';
  const author = (data?.author as string) ?? config?.author ?? 'MAP Nexus';
  const version = (data?.version as string) ?? config?.version ?? '1.0';
  const classification = (data?.classification as string) ?? config?.classification ?? 'Internal';

  return (
    <div
      id={section.id}
      className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-neutral-100 rounded-xl p-12 print:min-h-0 print:bg-primary-600 print:break-after-page"
    >
      <FileText className="w-16 h-16 mb-8 text-primary-20" />

      <h1 className="text-4xl font-bold text-center mb-4">{title}</h1>

      {subtitle && (
        <p className="text-xl text-primary-20 text-center max-w-2xl mb-8">{subtitle}</p>
      )}

      <div className="mt-8 text-center space-y-2">
        <p className="text-primary-30">{author}</p>
        <p className="text-primary-40 text-sm">Version {version}</p>
        <p className="text-primary-40 text-sm">
          {metadata ? new Date(metadata.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
        </p>
        <span className="inline-block mt-4 px-3 py-1 bg-primary-700 rounded text-xs uppercase tracking-wide">
          {classification}
        </span>
      </div>
    </div>
  );
};
