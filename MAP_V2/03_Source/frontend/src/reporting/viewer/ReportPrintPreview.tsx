import { Printer } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportPrintPreview = () => {
  const { setSidebarOpen } = useReportViewer();

  const handlePrint = () => {
    window.print();
  };

  return (
    <ViewerSidebarPanel title="Print Preview" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-4">
        <div className="bg-neutral-100 rounded-lg p-6 text-center">
          <Printer className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-sm text-neutral-70 mb-4">
            Print preview shows how the report will appear when printed. Use your browser's print dialog for advanced options.
          </p>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600"
          >
            <Printer className="w-4 h-4" />
            Open Print Dialog
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-50 uppercase tracking-wide">Print Settings</p>
          <div className="text-sm text-neutral-60 space-y-1">
            <p>• Paper size: A4 / Letter</p>
            <p>• Orientation: Portrait</p>
            <p>• Margins: Default browser settings</p>
            <p>• Background graphics: Enabled</p>
          </div>
        </div>
      </div>
    </ViewerSidebarPanel>
  );
};
