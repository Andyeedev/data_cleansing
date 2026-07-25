import { useState } from 'react';
import { useApprovalList, useCreateApproval } from '../hooks/useApprovals';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function ApprovalsPage() {
  const { currentUser, userRoles } = useAuth();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      case 'cancelled': return 'var(--color-text-secondary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'normal': return '#3b82f6';
      case 'low': return 'var(--color-text-secondary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Approvals</h1>
        <button
          onClick={() => setShowCreateModal(true)}
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
          Create Approval
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
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
          onChange={(e) => { setAssignedToFilter(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14,
          }}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <>
          {data.approvals.length === 0 ? (
            <div style={{
              padding: 48,
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No approvals found</p>
              <p style={{ fontSize: 14 }}>
                {(statusFilter || assignedToFilter) ? 'Try different filters' : 'Create your first approval request'}
              </p>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Title</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Priority</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Assigned To</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Created</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.approvals.map((approval) => (
                    <tr key={approval.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{approval.title}</div>
                        {approval.description && (
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                            {approval.description.length > 60 ? approval.description.substring(0, 60) + '...' : approval.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                        {approval.approval_type}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: `${getPriorityColor(approval.priority)}15`,
                          color: getPriorityColor(approval.priority),
                        }}>
                          {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          background: `${getStatusColor(approval.status)}15`,
                          color: getStatusColor(approval.status),
                        }}>
                          {formatStatus(approval.status)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {approval.assigned_to}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {new Date(approval.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <a
                          href={`/approvals/${approval.id}`}
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 12,
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

          {data.total > 20 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  opacity: page === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  cursor: page >= Math.ceil(data.total / 20) ? 'not-allowed' : 'pointer',
                  opacity: page >= Math.ceil(data.total / 20) ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--color-background)',
            borderRadius: 'var(--radius)',
            padding: 24,
            width: 480,
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Create Approval Request</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Title *</label>
                <input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Enter approval title"
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
                <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Enter description"
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Type</label>
                  <select
                    value={createForm.approval_type}
                    onChange={(e) => setCreateForm({ ...createForm, approval_type: e.target.value })}
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
                    <option value="general">General</option>
                    <option value="migration">Migration</option>
                    <option value="change_request">Change Request</option>
                    <option value="deployment">Deployment</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
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
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Assigned To (email) *</label>
                <input
                  value={createForm.assigned_to}
                  onChange={(e) => setCreateForm({ ...createForm, assigned_to: e.target.value })}
                  placeholder="approver@example.com"
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
              <button
                onClick={() => setShowCreateModal(false)}
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
                onClick={handleCreate}
                disabled={creating || !createForm.title.trim() || !createForm.assigned_to.trim()}
                style={{
                  padding: '8px 16px',
                  background: 'var(--color-sidebar-active)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: creating || !createForm.title.trim() || !createForm.assigned_to.trim() ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  opacity: creating || !createForm.title.trim() || !createForm.assigned_to.trim() ? 0.5 : 1,
                }}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
