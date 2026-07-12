import { Bookmark, Trash2 } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportBookmarks = () => {
  const { bookmarks, removeBookmark, addBookmark, activeSection, setSidebarOpen } = useReportViewer();

  const handleAddBookmark = () => {
    if (activeSection) {
      addBookmark({ sectionId: activeSection, label: `Section ${activeSection}` });
    }
  };

  return (
    <ViewerSidebarPanel title="Bookmarks" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-4">
        <button
          onClick={handleAddBookmark}
          disabled={!activeSection}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bookmark className="w-4 h-4" />
          Add Bookmark
        </button>

        {bookmarks.length === 0 ? (
          <p className="text-sm text-neutral-50 text-center py-4">
            No bookmarks yet. Navigate to a section and click "Add Bookmark".
          </p>
        ) : (
          <ul className="space-y-2">
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id} className="flex items-center justify-between p-2 bg-neutral-100 rounded-md">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-80">{bookmark.label}</p>
                    <p className="text-xs text-neutral-50">{new Date(bookmark.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="p-1 text-neutral-50 hover:text-error-500"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ViewerSidebarPanel>
  );
};
