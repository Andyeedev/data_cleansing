import { FileText, User, Tag, Calendar, Shield, Clock } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportMetadata = () => {
  const { reportConfig, setSidebarOpen } = useReportViewer();

  if (!reportConfig) {
    return (
      <ViewerSidebarPanel title="Metadata" onClose={() => setSidebarOpen(false)}>
        <p className="text-sm text-neutral-50 text-center py-4">No report loaded</p>
      </ViewerSidebarPanel>
    );
  }

  const metadataItems = [
    { icon: FileText, label: 'Name', value: reportConfig.name },
    { icon: Tag, label: 'Type', value: reportConfig.type },
    { icon: Shield, label: 'Classification', value: reportConfig.classification },
    { icon: User, label: 'Author', value: reportConfig.author },
    { icon: Clock, label: 'Version', value: reportConfig.version },
    { icon: Calendar, label: 'Format', value: reportConfig.format },
  ];

  return (
    <ViewerSidebarPanel title="Metadata" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-3">
        {metadataItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-neutral-50 mt-0.5" />
              <div>
                <p className="text-xs text-neutral-50">{item.label}</p>
                <p className="text-sm text-neutral-80 font-medium capitalize">{item.value}</p>
              </div>
            </div>
          );
        })}
        {reportConfig.description && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-50 mb-1">Description</p>
            <p className="text-sm text-neutral-70">{reportConfig.description}</p>
          </div>
        )}
      </div>
    </ViewerSidebarPanel>
  );
};
