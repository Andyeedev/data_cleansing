import { useRef, useEffect } from 'react';
import { useReportViewer } from './ReportViewerContext';
import { ReportHeader } from './ReportHeader';
import { ReportFooter } from './ReportFooter';

interface ReportCanvasProps {
  children?: React.ReactNode;
}

export const ReportCanvas: React.FC<ReportCanvasProps> = ({ children }) => {
  const { zoom, reportConfig } = useReportViewer();
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTop = 0;
    }
  }, [reportConfig]);

  return (
    <div className="flex-1 overflow-auto bg-neutral-20" ref={canvasRef}>
      <div
        className="mx-auto bg-white shadow-lg my-4 print:shadow-none print:my-0"
        style={{
          maxWidth: '1200px',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        <ReportHeader />
        <div className="min-h-[60vh] p-8">
          {children || (
            <div className="flex flex-col items-center justify-center h-full text-neutral-50 py-20">
              <p className="text-lg font-medium mb-2">No Report Loaded</p>
              <p className="text-sm">Open a report to view its contents</p>
            </div>
          )}
        </div>
        <ReportFooter />
      </div>
    </div>
  );
};
