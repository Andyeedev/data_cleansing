import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskDetail, useUpdateTask, useDeleteTask, useTaskComments, useAddComment } from '../hooks/useTasks';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRoles } = useAuth();

  const { data: task, loading, error } = useTaskDetail(id ?? null);
  const { update, loading: updating } = useUpdateTask();
  const { remove, loading: deleting } = useDeleteTask();
  const { data: comments, loading: commentsLoading, refetch: refetchComments } = useTaskComments(id ?? null);
  const { addComment, loading: addingComment } = useAddComment();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assigned_to: '',
    completion_percentage: 0,
  });
  const [newComment, setNewComment] = useState('');

  const startEditing = () => {
    if (!task) return;
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to || '',
      completion_percentage: task.completion_percentage || 0,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!id) return;
    const result = await update(id, form);
    if (result) setEditing(false);
  };

  const handleDelete = async () => {
    if (!id || !task) return;
    if (!confirm(`Delete task "${task.title}"?`)) return;
    const success = await remove(id);
    if (success) navigate('/tasks');
  };

  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    const result = await addComment(id, { content: newComment });
    if (result) {
      setNewComment('');
      refetchComments();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'blocked': return '#ef4444';
      default: return 'var(--color-text-secondary)';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Task Detail</h1>
        <ErrorMessage message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!task) return <ErrorMessage message="Task not found" />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <button
            onClick={() => navigate('/tasks')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-sidebar-active)',
              cursor: 'pointer',
              fontSize: 14,
              padding: 0,
              marginBottom: 8,
            }}
          >
            ← Back to Tasks
          </button>
          <h1 style={{ fontSize: 24, margin: 0 }}>{task.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!editing ? (
            <button
              onClick={startEditing}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {updating ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text-secondary)' }}>Task Information</h2>
        
        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Assigned To</label>
              <input
                value={form.assigned_to}
                onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Completion (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.completion_percentage}
                onChange={(e) => setForm({ ...form, completion_percentage: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 14,
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</div>
              <span style={{
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: `${getStatusColor(task.status)}15`,
                color: getStatusColor(task.status),
              }}>
                {formatStatus(task.status)}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Priority</div>
              <span style={{
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                background: `${getPriorityColor(task.priority)}15`,
                color: getPriorityColor(task.priority),
              }}>
                {task.priority}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Assigned To</div>
              <div style={{ fontSize: 14 }}>{task.assigned_to || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Due Date</div>
              <div style={{ fontSize: 14 }}>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Completion</div>
              <div style={{ fontSize: 14 }}>{task.completion_percentage || 0}%</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Created</div>
              <div style={{ fontSize: 14 }}>{new Date(task.created_at).toLocaleDateString()}</div>
            </div>
            {task.description && (
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</div>
                <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{task.description}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comments */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text-secondary)' }}>Comments</h2>
        
        {/* Add Comment */}
        <div style={{ marginBottom: 16 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              background: 'var(--color-background)',
              color: 'var(--color-text)',
              fontSize: 14,
              resize: 'vertical',
              marginBottom: 8,
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={addingComment || !newComment.trim()}
            style={{
              padding: '6px 12px',
              background: 'var(--color-sidebar-active)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: addingComment || !newComment.trim() ? 'not-allowed' : 'pointer',
              fontSize: 14,
              opacity: addingComment || !newComment.trim() ? 0.5 : 1,
            }}
          >
            {addingComment ? 'Adding...' : 'Add Comment'}
          </button>
        </div>

        {/* Comments List */}
        {commentsLoading ? (
          <LoadingSpinner />
        ) : comments.length === 0 ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: 14 }}>No comments yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div style={{ fontSize: 13, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
