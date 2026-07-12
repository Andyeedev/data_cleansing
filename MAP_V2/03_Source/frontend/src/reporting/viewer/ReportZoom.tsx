import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';
import { ZoomIn, ZoomOut } from 'lucide-react';

const zoomLevels = [
  { value: 'fit-width', label: 'Fit Width' },
  { value: 'fit-page', label: 'Fit Page' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
  { value: 125, label: '125%' },
  { value: 150, label: '150%' },
  { value: 200, label: '200%' },
];

export const ReportZoom = () => {
  const { zoom, setZoom, zoomPreset, setZoomPreset } = useReportViewer();

  const handleZoomChange = (value: number | string) => {
    if (value === 'fit-width' || value === 'fit-page') {
      setZoomPreset(value as typeof zoomPreset);
      setZoom(100);
    } else {
      setZoomPreset('100');
      setZoom(value as number);
    }
  };

  const zoomIn = () => {
    const newZoom = Math.min(200, zoom + 25);
    setZoom(newZoom);
    setZoomPreset('100');
  };

  const zoomOut = () => {
    const newZoom = Math.max(50, zoom - 25);
    setZoom(newZoom);
    setZoomPreset('100');
  };

  return (
    <ViewerSidebarPanel title="Zoom">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 50}
            className="p-2 text-neutral-60 hover:bg-neutral-100 rounded disabled:opacity-50"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-neutral-80 w-12 text-center">{zoom}%</span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 200}
            className="p-2 text-neutral-60 hover:bg-neutral-100 rounded disabled:opacity-50"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          {zoomLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleZoomChange(level.value)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                (level.value === zoomPreset) || (typeof level.value === 'number' && level.value === zoom)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-neutral-70 hover:bg-neutral-100'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </ViewerSidebarPanel>
  );
};
