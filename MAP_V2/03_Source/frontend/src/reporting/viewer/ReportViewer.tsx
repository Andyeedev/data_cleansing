import React, { useEffect } from 'react';
import { ReportViewerProvider, useReportViewer } from './ReportViewerContext';
import { ReportToolbar } from './ReportToolbar';
import { ReportSidebar } from './ReportSidebar';
import { ReportCanvas } from './ReportCanvas';
import { ReportNavigation } from './ReportNavigation';
import { HtmlReport } from '../html/framework/HtmlReport';
import type { HtmlReportConfig, HtmlReportMetadata } from '../html/shared/ReportTypes';

interface ReportViewerProps {
  config?: HtmlReportConfig;
  metadata?: HtmlReportMetadata | null;
  sectionData?: Record<string, Record<string, unknown>>;
  children?: React.ReactNode;
}

const ReportViewerInner: React.FC<ReportViewerProps> = ({
  config,
  metadata,
  sectionData = {},
  children,
}) => {
  const { setReportConfig, setReportData, isFullscreen, viewMode } = useReportViewer();

  useEffect(() => {
    if (config) {
      setReportConfig(config);
    }
  }, [config, setReportConfig]);

  useEffect(() => {
    setReportData(sectionData);
  }, [sectionData, setReportData]);

  const viewerClasses = [
    'flex flex-col h-full',
    isFullscreen ? 'fixed inset-0 z-50 bg-white' : '',
    viewMode === 'reading' ? 'max-w-3xl mx-auto' : '',
  ].join(' ');

  return (
    <div className={viewerClasses}>
      <ReportToolbar />
      <div className="flex flex-1 overflow-hidden">
        <ReportSidebar />
        <ReportCanvas>
          {children || (config ? (
            <HtmlReport config={config} metadata={metadata} sectionData={sectionData} showNavigation={false} />
          ) : null)}
        </ReportCanvas>
      </div>
      <ReportNavigation />
    </div>
  );
};

export const ReportViewer: React.FC<ReportViewerProps> = (props) => {
  return (
    <ReportViewerProvider>
      <ReportViewerInner {...props} />
    </ReportViewerProvider>
  );
};

export { ReportViewerProvider, useReportViewer } from './ReportViewerContext';
