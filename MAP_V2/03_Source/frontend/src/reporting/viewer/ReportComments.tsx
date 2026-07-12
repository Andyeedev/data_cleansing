import { useState } from 'react';
import { Trash2, Send } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportComments = () => {
  const { comments, removeComment, addComment, activeSection, setSidebarOpen } = useReportViewer();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() && activeSection) {
      addComment({ sectionId: activeSection, text: newComment.trim(), author: 'Current User' });
      setNewComment('');
    }
  };

  return (
    <ViewerSidebarPanel title="Comments" onClose={() => setSidebarOpen(false)}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1 px-3 py-2 text-sm border border-neutral-30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="New comment"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || !activeSection}
            className="p-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
            aria-label="Submit comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {comments.length === 0 ? (
          <p className="text-sm text-neutral-50 text-center py-4">
            No comments yet. Add a comment to the current section.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="p-3 bg-neutral-100 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-80">{comment.author}</span>
                  <button
                    onClick={() => removeComment(comment.id)}
                    className="p-1 text-neutral-50 hover:text-error-500"
                    aria-label="Remove comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-neutral-70">{comment.text}</p>
                <p className="text-xs text-neutral-50 mt-1">
                  {new Date(comment.timestamp).toLocaleString()} • Section: {comment.sectionId}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ViewerSidebarPanel>
  );
};
