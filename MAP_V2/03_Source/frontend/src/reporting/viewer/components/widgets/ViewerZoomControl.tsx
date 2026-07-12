import React from 'react';
import { ZoomIn } from 'lucide-react';
import { useReportViewer } from '../../ReportViewerContext';

const zoomPresets = [
  { value: 'fit-width' as const, label: 'Fit Width' },
  { value: 'fit-page' as const, label: 'Fit Page' },
  { value: '100' as const, label: '100%' },
  { value: '125' as const, label: '125%' },
  { value: '150' as const, label: '150%' },
  { value: '200' as const, label: '200%' },
];

export const ViewerZoomControl: React.FC = () => {
  const { zoomPreset, setZoomPreset, setZoom } = useReportViewer();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof zoomPreset;
    setZoomPreset(value);
    if (value === 'fit-width' || value === 'fit-page') {
      setZoom(100);
    } else {
      setZoom(parseInt(value));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <ZoomIn className="w-4 h-4 text-neutral-50" />
      <select
        value={zoomPreset}
        onChange={handleChange}
        className="text-sm border border-neutral-30 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Zoom level"
      >
        {zoomPresets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
};
