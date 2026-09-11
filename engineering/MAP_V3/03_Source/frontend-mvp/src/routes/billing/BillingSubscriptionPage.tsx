import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { useSubscription } from '../../hooks/useSubscription';
import { apiGet, apiPost } from '../../utils/apiClient';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

interface Invoice {
  id: string;
  amount_paid: number;
  currency: string;
  status: string;
  created: string;
  invoice_pdf: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    past_due: 'bg-amber-100 text-amber-800',
    pending_cancellation: 'bg-orange-100 text-orange-800',
    suspended: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
    expired: 'bg-gray-100 text-gray-600',
    none: 'bg-gray-100 text-gray-500',
  };
  const labels: Record<string, string> = {
    active: 'Active',
    trialing: 'Trial',
    past_due: 'Past Due',
    pending_cancellation: 'Cancelling',
    suspended: 'Suspended',
    cancelled: 'Cancelled',
    expired: 'Expired',
    none: 'No Plan',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.none}`}>
      {labels[status] || status}
    </span>
  );
}

export function BillingSubscriptionPage() {
  const navigate = useNavigate();
  const { subscription, daysUntilTrialEnd, refetch } = useSubscription();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await apiGet<{ invoices: Invoice[] }>('/billing/invoices');
        setInvoices(res.invoices || []);
      } catch {
        // invoices may not be available
      } finally {
        setInvoicesLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await apiPost<{ portal_url: string }>('/billing/portal', {
        return_url: `${window.location.origin}/billing/subscription`,
      });
      if (res.portal_url) {
        window.location.href = res.portal_url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure? Your subscription will remain active until the end of the current billing period.')) return;
    setCancelLoading(true);
    try {
      await apiPost('/billing/cancel', {});
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  const trialDays = daysUntilTrialEnd();

  if (!subscription || subscription.status === 'none') {
    return (
      <PageContainer>
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscription</h1>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-amber-900 mb-1">No Active Subscription</h3>
          <p className="text-sm text-amber-700 mb-4">You're using default limits. Choose a plan to unlock full capabilities.</p>
          <button
            onClick={() => navigate('/subscription/plans')}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            View Plans
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscription</h1>
        <p className="text-sm text-gray-500">Manage your subscription, billing, and invoices.</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{subscription.plan_name || 'Unknown Plan'}</h3>
            <p className="text-sm text-gray-500 capitalize">{subscription.billing_cycle} billing</p>
          </div>
          <StatusBadge status={subscription.status} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Projects</div>
            <div className="text-lg font-bold text-gray-900">{subscription.limits.projects.current}/{subscription.limits.projects.max}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Users</div>
            <div className="text-lg font-bold text-gray-900">{subscription.limits.users.current}/{subscription.limits.users.max}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Systems</div>
            <div className="text-lg font-bold text-gray-900">{subscription.limits.connections.current}/{subscription.limits.connections.max}</div>
          </div>
        </div>

        {/* Trial Warning */}
        {subscription.status === 'trialing' && trialDays !== null && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              {trialDays} days remaining in your trial.
              {trialDays <= 7 && ' Upgrade soon to avoid interruption.'}
            </span>
          </div>
        )}

        {/* Past Due Warning */}
        {subscription.status === 'past_due' && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              Payment past due. Please update your payment method to avoid service interruption.
            </span>
          </div>
        )}

        {/* Pending Cancellation Warning */}
        {subscription.status === 'pending_cancellation' && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Your subscription will cancel at the end of the current billing period.
              {subscription.end_date && ` Active until ${subscription.end_date}.`}
            </span>
          </div>
        )}

        {/* Suspended Warning */}
        {subscription.status === 'suspended' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">
              Your subscription is suspended. Features are limited until payment is resolved.
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/subscription/plans')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            {subscription.status === 'none' ? 'Choose Plan' : 'Change Plan'}
          </button>
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {portalLoading ? 'Loading...' : 'Manage Billing'}
          </button>
          {subscription.status !== 'cancelled' && subscription.status !== 'pending_cancellation' && (
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">Invoice History</h3>
        {invoicesLoading ? (
          <LoadingSkeleton rows={3} variant="card" height={40} />
        ) : invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-500">Date</th>
                  <th className="text-left py-2 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-2 font-medium text-gray-500">Status</th>
                  <th className="text-left py-2 font-medium text-gray-500">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{new Date(inv.created).toLocaleDateString()}</td>
                    <td className="py-2 text-gray-900">£{inv.amount_paid.toLocaleString()}</td>
                    <td className="py-2">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-2">
                      {inv.invoice_pdf && (
                        <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
