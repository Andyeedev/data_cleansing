import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApprovalDetail, useApproveRequest, useRejectRequest } from '../hooks/useApprovals';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { data: approval, loading, error } = useApprovalDetail(id || null);
  const { approve, loading: approving } = useApproveRequest();
  const { reject, loading: rejecting } = useRejectRequest();

  const [decisionComment, setDecisionComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async () => {
    if (!id) return;
    const success = await approve(id, { decision: 'approved', comment: decisionComment || undefined });
    if (success) {
      setDecisionComment('');
      navigate('/approvals');
    }
  };

  const handleReject = async () => {
    if (!id) return;
    const success = await reject(id, { decision: 'rejected', comment: decisionComment || undefined });
    if (success) {
      setDecisionComment('');
      setShowRejectModal(false);
      navigate('/approvals');
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

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate('/approvals')}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          Back to Approvals
        </button>
      </div>
    );
  }

  if (!approval) {
    return (
      <div style={{ padding: 24 }}>
        <ErrorMessage message="Approval not found" />
        <button
          onClick={() => navigate('/approvals')}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            background: 'var(--color-background)',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          Back to Approvals
        </button>
      </div>
    );
  }

  const isAssignedToMe = approval.assigned_to === currentUser?.email;
  const isPending = approval.status === 'pending';

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/approvals')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: 14,
            padding: 0,
            marginBottom: 8,
          }}
        >
          ← Back to Approvals
        </button>
        <h1 style={{ fontSize: 24, margin: 0 }}>{approval.title}</h1>
      </div>

      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Status</div>
            <span style={{
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              background: `${getStatusColor(approval.status)}15`,
              color: getStatusColor(approval.status),
            }}>
              {formatStatus(approval.status)}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Type</div>
            <div style={{ fontSize: 14 }}>{approval.approval_type}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Priority</div>
            <span style={{
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              background: `${getPriorityColor(approval.priority)}15`,
              color: getPriorityColor(approval.priority),
            }}>
              {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)}
            </span>
          </div>
        </div>

        {approval.description && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Description</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{approval.description}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Assigned To</div>
            <div style={{ fontSize: 14 }}>{approval.assigned_to}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Requested By</div>
            <div style={{ fontSize: 14 }}>{approval.requested_by}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Created</div>
            <div style={{ fontSize: 14 }}>{new Date(approval.created_at).toLocaleString()}</div>
          </div>
          {approval.decided_at && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Decided</div>
              <div style={{ fontSize: 14 }}>{new Date(approval.decided_at).toLocaleString()}</div>
            </div>
          )}
        </div>

        {approval.comment && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Comment</div>
            <div style={{
              fontSize: 14,
              padding: 12,
              background: 'var(--color-background)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
            }}>
              {approval.comment}
            </div>
          </div>
        )}
      </div>

      {isPending && isAssignedToMe && (
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 24,
          background: 'var(--color-background)',
        }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Your Decision</h3>
          <textarea
            value={decisionComment}
            onChange={(e) => setDecisionComment(e.target.value)}
            placeholder="Optional comment..."
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
              marginBottom: 16,
            }}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={rejecting}
              style={{
                padding: '8px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius)',
                cursor: rejecting ? 'not-allowed' : 'pointer',
                fontSize: 14,
                opacity: rejecting ? 0.5 : 1,
              }}
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={approving}
              style={{
                padding: '8px 16px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 'var(--radius)',
                cursor: approving ? 'not-allowed' : 'pointer',
                fontSize: 14,
                opacity: approving ? 0.5 : 1,
              }}
            >
              {approving ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </div>
      )}

      {showRejectModal && (
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
            width: 400,
          }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Reject Approval</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              Are you sure you want to reject this approval request?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowRejectModal(false)}
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
                onClick={handleReject}
                disabled={rejecting}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: rejecting ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  opacity: rejecting ? 0.5 : 1,
                }}
              >
                {rejecting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
