import { useState, useEffect } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { apiGet, apiPost } from '../../utils/apiClient';
import { PageContainer } from '../../components/PageContainer/PageContainer';

interface Lead {
  lead_id: string;
  full_name: string;
  work_email: string;
  company: string | null;
  org_size: string | null;
  industry: string | null;
  role: string | null;
  source_form: string;
  created_at: string;
  status: string;
  converted_to_tenant: string | null;
  converted_at: string | null;
}

export function RegistrationsPage() {
  // State declarations - must come first (React rules of hooks)
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [converting, setConverting] = useState(false);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<{ leads: Lead[] }>('/admin/registrations');
      setLeads(response.leads || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  // Load leads when component mounts
  useEffect(() => {
    fetchLeads();
  }, []);

  const handleConvert = async (leadId: string) => {
    setConversionId(leadId);
    setAdminPassword('');
    setModalOpen(true);
  };

  const confirmConvert = async (adminPassword: string | undefined) => {
    setConverting(true);
    setError(null);
    try {
      const response = await apiPost<{ tenant_id: string; admin_user_id: string; admin_email: string; verification_sent: boolean }>(`/admin/registrations/${conversionId}/convert`, {
        admin_password: adminPassword,
      });
      if (response.tenant_id) {
        setModalOpen(false);
        await fetchLeads();
      } else {
        setError('Conversion failed');
      }
    } catch (err: unknown) {
      const detail =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(detail || (err instanceof Error ? err.message : undefined) || 'Conversion failed');
    } finally {
      setConverting(false);
      setConversionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  // Route guard is Super-Admin-only; conversion is per-row. No in-page
  // role check needed.

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Registrations</h1>
            <p className="text-gray-600 mt-1">Super Admin review and conversion</p>
          </div>
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
              <p className="text-gray-600">Loading registrations...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
              <p className="text-gray-600 mb-6">Website leads await Super Admin review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.lead_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{lead.full_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{lead.work_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{lead.company || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{lead.role || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{lead.source_form}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {lead.status === 'pending' && !lead.converted_to_tenant && (
                            <button
                              onClick={() => handleConvert(lead.lead_id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                              disabled={converting}
                              title="Convert lead to tenant"
                              aria-label={`Convert lead for ${lead.work_email}`}
                            >
                              {converting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> 
                              ) : (
                                'Convert'
                              )}
                            </button>
                          )}
                          {lead.status === 'converted' && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                              Converted
                            </span>
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

        {converting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-zsm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Converting lead to tenant...</p>
              <p className="text-gray-500">This may take a moment.</p>
            </div>
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-zsm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Convert Lead to Tenant</h2>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {converting ? (
                <p className="text-gray-500 mb-4">Converting lead to tenant...</p>
              ) : (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adminPassword">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Cancel conversion"
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmConvert(adminPassword || undefined)}
                  disabled={!adminPassword || converting}
                  aria-label="Confirm lead conversion"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  {converting ? 'Converting...' : 'Convert'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}