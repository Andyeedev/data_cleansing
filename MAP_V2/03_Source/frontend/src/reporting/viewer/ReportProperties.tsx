import { Settings, FileText, Layers, Hash } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportProperties = () => {
  const { reportConfig, setSidebarOpen } = useReportViewer();

  if (!reportConfig) {
    return (
      <ViewerSidebarPanel title="Properties" onClose={() => setSidebarOpen(false)}>
        <p className="text-sm text-neutral-50 text-center py-4">No report loaded</p>
      </ViewerSidebarPanel>
    );
  }

  const sections = reportConfig.sections ?? [];
  const visibleSections = sections.filter((s) => s.visible !== false);

  const properties = [
    { icon: FileText, label: 'Report ID', value: reportConfig.id },
    { icon: Layers, label: 'Total Sections', value: sections.length.toString() },
    { icon: Hash, label: 'Visible Sections', value: visibleSections.length.toString() },
    { icon: Settings, label: 'Format', value: reportConfig.format.toUpperCase() },
  ];

  return (
    <ViewerSidebarPanel title="Properties" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-3">
        {properties.map((prop) => {
          const Icon = prop.icon;
          return (
            <div key={prop.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-neutral-50" />
                <span className="text-sm text-neutral-60">{prop.label}</span>
              </div>
              <span className="text-sm font-medium text-neutral-80">{prop.value}</span>
            </div>
          );
        })}
      </div>
    </ViewerSidebarPanel>
  );
};
