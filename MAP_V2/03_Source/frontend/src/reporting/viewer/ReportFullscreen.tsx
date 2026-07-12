import { Maximize, Minimize, Presentation, BookOpen } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportFullscreen = () => {
  const { isFullscreen, setIsFullscreen, viewMode, setViewMode, setSidebarOpen } = useReportViewer();

  const modes = [
    { id: 'normal' as const, label: 'Normal', icon: Maximize, description: 'Standard viewing mode' },
    { id: 'presentation' as const, label: 'Presentation', icon: Presentation, description: 'Full-screen presentation mode' },
    { id: 'reading' as const, label: 'Reading', icon: BookOpen, description: 'Distraction-free reading mode' },
  ];

  return (
    <ViewerSidebarPanel title="View Mode" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-4">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
            isFullscreen
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-neutral-100 text-neutral-70 hover:bg-neutral-200'
          }`}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          <div className="text-left">
            <p className="text-sm font-medium">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
            <p className="text-xs text-neutral-50">Toggle full-screen viewing</p>
          </div>
        </button>

        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-50 uppercase tracking-wide">View Modes</p>
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  viewMode === mode.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-70 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">{mode.label}</p>
                  <p className="text-xs text-neutral-50">{mode.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ViewerSidebarPanel>
  );
};
