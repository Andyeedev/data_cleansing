import React from 'react';
import { useReportViewer } from '../../ReportViewerContext';

export const ViewerPageIndicator: React.FC = () => {
  const { currentPages, setCurrentPages } = useReportViewer();

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-60">
      <span>Page</span>
      <input
        type="number"
        min={1}
        max={currentPages.total}
        value={currentPages.current}
        onChange={(e) => {
          const page = parseInt(e.target.value);
          if (page >= 1 && page <= currentPages.total) {
            setCurrentPages({ ...currentPages, current: page });
          }
        }}
        className="w-12 px-2 py-1 text-center border border-neutral-30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Current page"
      />
      <span>of {currentPages.total}</span>
    </div>
  );
};
