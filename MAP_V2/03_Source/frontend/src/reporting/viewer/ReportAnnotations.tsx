import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';
import { Highlighter, Bookmark, Flag, Trash2 } from 'lucide-react';

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  highlight: Highlighter,
  marker: Bookmark,
  flag: Flag,
};

const typeColours: Record<string, string> = {
  highlight: 'bg-warning-50 text-warning-700',
  marker: 'bg-primary-50 text-primary-700',
  flag: 'bg-error-50 text-error-700',
};

export const ReportAnnotations = () => {
  const { annotations, removeAnnotation, setSidebarOpen } = useReportViewer();

  return (
    <ViewerSidebarPanel title="Annotations" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-4">
        {annotations.length === 0 ? (
          <p className="text-sm text-neutral-50 text-center py-4">
            No annotations yet. Select text in the report to add highlights, markers or flags.
          </p>
        ) : (
          <ul className="space-y-2">
            {annotations.map((annotation) => {
              const Icon = typeIcons[annotation.type] ?? Highlighter;
              return (
                <li key={annotation.id} className="flex items-start justify-between p-2 bg-neutral-100 rounded-md">
                  <div className="flex items-start gap-2">
                    <span className={`p-1 rounded ${typeColours[annotation.type]}`}>
                      <Icon className="w-3 h-3" />
                    </span>
                    <div>
                      <p className="text-sm text-neutral-80">{annotation.text}</p>
                      <p className="text-xs text-neutral-50">
                        {annotation.type} • Section: {annotation.sectionId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAnnotation(annotation.id)}
                    className="p-1 text-neutral-50 hover:text-error-500"
                    aria-label="Remove annotation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ViewerSidebarPanel>
  );
};
