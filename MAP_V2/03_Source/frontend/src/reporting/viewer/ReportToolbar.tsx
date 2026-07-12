import { FolderOpen, RefreshCw, Printer, Download, Share2, Maximize, Minimize, Bot } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerToolbarButton } from './components/widgets/ViewerToolbarButton';
import { ViewerZoomControl } from './components/widgets/ViewerZoomControl';
import { ViewerSearchBar } from './components/widgets/ViewerSearchBar';

export const ReportToolbar = () => {
  const { isFullscreen, setIsFullscreen } = useReportViewer();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-5 border-b border-neutral-20 print:hidden">
      <div className="flex items-center gap-1">
        <ViewerToolbarButton icon={FolderOpen} label="Open" onClick={() => {}} />
        <ViewerToolbarButton icon={RefreshCw} label="Refresh" onClick={() => {}} />
        <div className="w-px h-6 bg-neutral-200 mx-1" />
        <ViewerToolbarButton icon={Printer} label="Print" onClick={() => window.print()} />
        <ViewerToolbarButton icon={Download} label="Export" disabled />
        <ViewerToolbarButton icon={Download} label="Download" disabled />
        <div className="w-px h-6 bg-neutral-200 mx-1" />
        <ViewerSearchBar />
      </div>
      <div className="flex items-center gap-1">
        <ViewerZoomControl />
        <div className="w-px h-6 bg-neutral-200 mx-1" />
        <ViewerToolbarButton
          icon={isFullscreen ? Minimize : Maximize}
          label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          onClick={() => setIsFullscreen(!isFullscreen)}
          active={isFullscreen}
        />
        <ViewerToolbarButton icon={Share2} label="Share" disabled />
        <ViewerToolbarButton icon={Bot} label="AI Summary" disabled />
      </div>
    </div>
  );
};
