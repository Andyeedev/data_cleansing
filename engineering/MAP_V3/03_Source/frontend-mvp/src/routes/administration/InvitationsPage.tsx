import { useState, useEffect } from 'react';
import { Plus, Mail, XCircle, RotateCw, Trash2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGet, apiPost, apiDelete } from '../../utils/apiClient';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { InvitationModal } from '../../components/invitation/InvitationModal';

interface Invitation {
  invitation_id: string;
  email: string;
  status: string;
  invited_by: string | null;
  created_at: string;
  expires_at: string;
}

export function InvitationsPage() {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet('/invitations');
      setInvitations(response.data.invitations || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreateInvitation = async (email: string, message?: string) => {
    try {
      await apiPost('/invitations', { email, message });
      setModalOpen(false);
      await fetchInvitations();
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to create invitation');
    }
  };

  const handleResend = async (invitationId: string) => {
    setResendingId(invitationId);
    try {
      await apiPost(`/invitations/${invitationId}/resend`);
      await fetchInvitations();
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to resend invitation');
    } finally {
      setResendingId(null);
    }
  };

  const handleRevoke = async (invitationId: string) => {
    setRevokingId(invitationId);
    try {
      await apiDelete(`/invitations/${invitationId}`);
      await fetchInvitations();
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to revoke invitation');
    } finally {
      setRevokingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      accepted: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
      revoked: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
            <p className="text-gray-600 mt-1">Manage user invitations for your tenant</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Invite User
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading invitations...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
              <p className="text-gray-600 mb-6">Invite team members to join your tenant</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Invite User
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invited By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invitations.map((inv) => (
                    <tr key={inv.invitation_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{inv.email}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {inv.invited_by ? inv.invited_by.substring(0, 8) + '...' : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {isExpired(inv.expires_at) ? (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(inv.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status === 'pending' && !isExpired(inv.expires_at) && (
                            <button
                              onClick={() => handleResend(inv.invitation_id)}
                              disabled={resendingId === inv.invitation_id}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Resend invitation"
                            >
                              {resendingId === inv.invitation_id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <RotateCw className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          {inv.status === 'pending' && (
                            <button
                              onClick={() => handleRevoke(inv.invitation_id)}
                              disabled={revokingId === inv.invitation_id}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Revoke invitation"
                            >
                              {revokingId === inv.invitation_id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InvitationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateInvitation}
      />
    </PageContainer>
  );
}