import { useState } from 'react';
import { useApprovalList, useCreateApproval } from '../hooks/useApprovals';
import { useAuth } from '../context/AuthContext';
import {
  StatusBadge,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  Modal,
  Pagination,
} from '../components/shared';

export function ApprovalsPage() {
  const { currentUser: _currentUser, userRoles: _userRoles } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    approval_type: 'general',
    assigned_to: '',
    priority: 'normal',
  });

  const { data, loading, error, refetch } = useApprovalList({
    page,
    page_size: 20,
    status: statusFilter || undefined,
    assigned_to: assignedToFilter || undefined,
  });

  const { create, loading: creating } = useCreateApproval();

  const handleCreate = async () => {
    if (!createForm.title.trim() || !createForm.assigned_to.trim()) return;
    const result = await create({
      title: createForm.title,
      description: createForm.description || undefined,
      approval_type: createForm.approval_type,
      assigned_to: createForm.assigned_to,
      priority: createForm.priority,
    });
    if (result) {
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        approval_type: 'general',
        assigned_to: '',
        priority: 'normal',
      });
      refetch();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'rejected': return 'danger' as const;
      default: return undefined;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger' as const;
      case 'high': return 'warning' as const;
      case 'normal': return 'info' as const;
      default: return undefined;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleAssignedToFilterChange = (value: string) => {
    setAssignedToFilter(value);
    setPage(1);
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h2)', margin: 0 }}>Approvals</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new approval"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-sidebar-active)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Create Approval
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          aria-label="Filter by status"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Assigned To (email)"
          value={assignedToFilter}
          onChange={(e) => handleAssignedToFilterChange(e.target.value)}
          aria-label="Filter by assignee"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)',
          }}
        />
      </div>

      {loading && <LoadingSkeleton variant="table" rows={8} />}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          {data.approvals.length === 0 ? (
            <EmptyState
              title="No approvals found"
              description={
                (statusFilter || assignedToFilter)
                  ? 'Try different filters'
                  : 'Create your first approval request'
              }
              action={
                (!statusFilter && !assignedToFilter)
                  ? { label: 'Create Approval', onClick: () => setShowCreateModal(true) }
                  : undefined
              }
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
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Priority</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Assigned To</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Created</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right', borderBottom: 'var(--border-width) solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.approvals.map((approval) => (
                    <tr key={approval.id} style={{ borderBottom: 'var(--border-width) solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <div style={{ fontWeight: 500 }}>{approval.title}</div>
                        {approval.description && (
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
                            {approval.description.length > 60 ? approval.description.substring(0, 60) + '...' : approval.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', color: 'var(--color-text-secondary)' }}>
                        {approval.approval_type}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge
                          status={formatPriority(approval.priority)}
                          variant={getPriorityBadgeVariant(approval.priority)}
                          size="sm"
                        />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge
                          status={formatStatus(approval.status)}
                          variant={getStatusBadgeVariant(approval.status)}
                          size="sm"
                        />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {approval.assigned_to}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {new Date(approval.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'right' }}>
                        <a
                          href={`/approvals/${approval.id}`}
                          aria-label={`View approval ${approval.title}`}
                          style={{
                            background: 'transparent',
                            border: 'var(--border-width) solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text)',
                            textDecoration: 'none',
                          }}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-md)' }}>
            <Pagination
              page={page}
              pageSize={20}
              total={data.total}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <Modal
        open={showCreateModal}
        title="Create Approval Request"
        onClose={() => setShowCreateModal(false)}
        footer={
          <>
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
              disabled={creating || !createForm.title.trim() || !createForm.assigned_to.trim()}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-sidebar-active)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: creating || !createForm.title.trim() || !createForm.assigned_to.trim() ? 'not-allowed' : 'pointer',
                fontSize: 'var(--font-size-sm)',
                opacity: creating || !createForm.title.trim() || !createForm.assigned_to.trim() ? 0.5 : 1,
              }}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Title *</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter approval title"
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
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
              placeholder="Enter description"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Type</label>
              <select
                value={createForm.approval_type}
                onChange={(e) => setCreateForm({ ...createForm, approval_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <option value="general">General</option>
                <option value="migration">Migration</option>
                <option value="change_request">Change Request</option>
                <option value="deployment">Deployment</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Priority</label>
              <select
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>Assigned To (email) *</label>
            <input
              value={createForm.assigned_to}
              onChange={(e) => setCreateForm({ ...createForm, assigned_to: e.target.value })}
              placeholder="approver@example.com"
              style={{
                width: '100%',
                padding: 'var(--space-sm) var(--space-md)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
