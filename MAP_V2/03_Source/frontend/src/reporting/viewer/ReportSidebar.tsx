import { List, Bookmark, MessageSquare, FileText, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ReportOutline } from './ReportOutline';
import { ReportBookmarks } from './ReportBookmarks';
import { ReportComments } from './ReportComments';
import { ReportMetadata } from './ReportMetadata';

const panels = [
  { id: 'toc' as const, label: 'Contents', icon: List },
  { id: 'bookmarks' as const, label: 'Bookmarks', icon: Bookmark },
  { id: 'comments' as const, label: 'Comments', icon: MessageSquare },
  { id: 'metadata' as const, label: 'Metadata', icon: FileText },
];

export const ReportSidebar = () => {
  const { sidebarOpen, setSidebarOpen, activeSidebarPanel, setActiveSidebarPanel } = useReportViewer();

  const renderPanel = () => {
    switch (activeSidebarPanel) {
      case 'toc':
        return <ReportOutline />;
      case 'bookmarks':
        return <ReportBookmarks />;
      case 'comments':
        return <ReportComments />;
      case 'metadata':
        return <ReportMetadata />;
      default:
        return <ReportOutline />;
    }
  };

  return (
    <div className={`flex flex-col border-r border-neutral-200 bg-neutral-5 print:hidden transition-all ${sidebarOpen ? 'w-64' : 'w-12'}`}>
      <div className="flex items-center justify-between px-2 py-2 border-b border-neutral-200">
        {sidebarOpen && (
          <div className="flex items-center gap-1">
            {panels.map((panel) => {
              const Icon = panel.icon;
              return (
                <button
                  key={panel.id}
                  onClick={() => setActiveSidebarPanel(panel.id)}
                  title={panel.label}
                  className={`p-1.5 rounded transition-colors ${
                    activeSidebarPanel === panel.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-50 hover:text-neutral-70 hover:bg-neutral-100'
                  }`}
                  aria-label={panel.label}
                  aria-current={activeSidebarPanel === panel.id ? 'true' : undefined}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-neutral-50 hover:text-neutral-70 hover:bg-neutral-100 rounded"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>
      </div>
      {sidebarOpen && (
        <div className="flex-1 overflow-hidden">{renderPanel()}</div>
      )}
    </div>
  );
};
