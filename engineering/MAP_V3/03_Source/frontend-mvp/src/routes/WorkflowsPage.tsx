import { useState } from 'react';
import { useWorkflowList, useCreateWorkflow, useDeleteWorkflow, useExecuteWorkflow } from '../hooks/useWorkflows';
import { useAuth } from '../context/AuthContext';
import {
  ErrorState,
  LoadingSkeleton,
  StatusBadge,
  EmptyState,
  Pagination,
  Modal,
} from '../components/shared';

export function WorkflowsPage() {
  const { userRoles } = useAuth();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'custom',
  });

  const { data, loading, error, refetch } = useWorkflowList({
    page,
    page_size: 20,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  const { create, loading: creating } = useCreateWorkflow();
  const { remove, loading: deleting } = useDeleteWorkflow();
  const { execute, loading: executing } = useExecuteWorkflow();

  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    const result = await create({
      name: createForm.name,
      description: createForm.description || undefined,
      type: createForm.type,
    });
    if (result) {
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', type: 'custom' });
      refetch();
    }
  };

  const handleDelete = async (workflowId: string, workflowName: string) => {
    if (!confirm(`Delete workflow "${workflowName}"?`)) return;
    const success = await remove(workflowId);
    if (success) refetch();
  };

  const handleExecute = async (workflowId: string) => {
    const success = await execute(workflowId, {});
    if (success) refetch();
  };

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Workflow Management</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', margin: 0 }}>Workflow Management</h1>
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
          Create Workflow
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          aria-label="Filter by type"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Types</option>
          <option value="custom">Custom</option>
          <option value="migration">Migration</option>
          <option value="validation">Validation</option>
          <option value="approval">Approval</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
          <option value="error">Error</option>
        </select>
      </div>

      {loading && <LoadingSkeleton variant="table" rows={5} />}
      {error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <>
          {data.workflows.length === 0 ? (
            <EmptyState
              title="No workflows found"
              description={(typeFilter || statusFilter) ? 'Try different filters' : 'Create your first workflow to get started'}
            />
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Name</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Steps</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Created</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.workflows.map((workflow) => (
                    <tr key={workflow.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontWeight: 500 }}>{workflow.name}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>{workflow.type}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={workflow.status} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                        {Array.isArray(workflow.steps) ? workflow.steps.length : 0}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                        {new Date(workflow.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <button
                          onClick={() => handleExecute(workflow.id)}
                          disabled={executing}
                          aria-label={`Execute workflow ${workflow.name}`}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            marginRight: 'var(--space-sm)',
                            color: '#22c55e',
                          }}
                        >
                          Execute
                        </button>
                        <button
                          onClick={() => handleDelete(workflow.id, workflow.name)}
                          disabled={deleting}
                          aria-label={`Delete workflow ${workflow.name}`}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: '#ef4444',
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
              <Pagination
                page={page}
                pageSize={20}
                total={data.total}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <Modal
          open={showCreateModal}
          title="Create Workflow"
          onClose={() => setShowCreateModal(false)}
          footer={
            <>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
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
                disabled={creating || !createForm.name.trim()}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: creating || !createForm.name.trim() ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  opacity: creating || !createForm.name.trim() ? 0.5 : 1,
                }}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Name *</label>
              <input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Enter workflow name"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
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
                placeholder="Enter description"
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Type</label>
              <select
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <option value="custom">Custom</option>
                <option value="migration">Migration</option>
                <option value="validation">Validation</option>
                <option value="approval">Approval</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
