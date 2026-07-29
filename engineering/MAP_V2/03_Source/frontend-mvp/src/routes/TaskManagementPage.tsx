import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskList, useCreateTask, useDeleteTask } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { Pagination } from '../components/shared/Pagination';
import { Modal } from '../components/shared/Modal';

export function TaskManagementPage() {
  const navigate = useNavigate();
  const { userRoles } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
  });

  const { data, loading, error, refetch } = useTaskList({
    page,
    page_size: 20,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const { create, loading: creating } = useCreateTask();
  const { remove, loading: deleting } = useDeleteTask();

  const handleCreate = async () => {
    if (!createForm.title.trim()) return;
    const result = await create({
      title: createForm.title,
      description: createForm.description || undefined,
      priority: createForm.priority,
      assigned_to: createForm.assigned_to || undefined,
    });
    if (result) {
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', priority: 'medium', assigned_to: '' });
      refetch();
    }
  };

  const handleDelete = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Delete task "${taskTitle}"?`)) return;
    const success = await remove(taskId);
    if (success) refetch();
  };

  const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'success' => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'warning';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'info' | 'warning' | 'danger' => {
    switch (status) {
      case 'done': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      case 'blocked': return 'danger';
      default: return 'warning';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-md)' }}>Task Management</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Task Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-sidebar-active)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Create Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          style={{
            padding: 'var(--space-sm) var(--space-sm)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          aria-label="Filter by priority"
          style={{
            padding: 'var(--space-sm) var(--space-sm)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading && <LoadingSkeleton variant="table" rows={5} />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          {data.tasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description={(statusFilter || priorityFilter) ? 'Try different filters' : 'Create your first task to get started'}
              action={!statusFilter && !priorityFilter ? { label: 'Create Task', onClick: () => setShowCreateModal(true) } : undefined}
            />
          ) : (
            <div style={{
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Title</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Priority</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Assigned To</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Due Date</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tasks.map((task) => (
                    <tr
                      key={task.id}
                      style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}
                    >
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <button
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-sidebar-active)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)',
                            padding: 0,
                            textDecoration: 'underline',
                          }}
                        >
                          {task.title}
                        </button>
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={formatStatus(task.status)} variant={getStatusVariant(task.status)} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={task.priority} variant={getPriorityVariant(task.priority)} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                        {task.assigned_to || '—'}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <button
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          aria-label={`View task ${task.title}`}
                          style={{
                            background: 'none',
                            border: 'var(--border-width) solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            marginRight: 'var(--space-sm)',
                            color: 'var(--color-text)',
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(task.id, task.title)}
                          disabled={deleting}
                          aria-label={`Delete task ${task.title}`}
                          style={{
                            background: 'none',
                            border: 'var(--border-width) solid var(--color-danger)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-danger)',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.total > 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
              <Pagination page={page} pageSize={20} total={data.total} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      <Modal open={showCreateModal} title="Create Task" onClose={() => setShowCreateModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Title *</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter task title"
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
                resize: 'vertical',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Priority</label>
            <select
              value={createForm.priority}
              onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Assigned To</label>
            <input
              value={createForm.assigned_to}
              onChange={(e) => setCreateForm({ ...createForm, assigned_to: e.target.value })}
              placeholder="Enter user ID"
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
          <button
            onClick={() => setShowCreateModal(false)}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius)',
              background: 'var(--color-background)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating || !createForm.title.trim()}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--color-sidebar-active)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: creating || !createForm.title.trim() ? 'not-allowed' : 'pointer',
              fontSize: 'var(--font-size-sm)',
              opacity: creating || !createForm.title.trim() ? 0.5 : 1,
            }}
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
