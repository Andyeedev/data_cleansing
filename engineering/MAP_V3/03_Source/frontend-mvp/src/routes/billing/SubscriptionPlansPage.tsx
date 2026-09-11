import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowLeft } from 'lucide-react';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { useSubscription } from '../../hooks/useSubscription';
import { apiGet, apiPost } from '../../utils/apiClient';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

interface Plan {
  plan_id: string;
  name: string;
  tier: string;
  annual_price: string | number;
  monthly_price: string | number | null;
  max_users: number;
  max_projects: number;
  max_connections: number;
  entitlements: Record<string, unknown>;
  description: string;
}

const TIER_ORDER = ['professional', 'enterprise', 'enterprise_plus'];

function PriceTag({ price, cycle }: { price: string | number; cycle: string }) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (cycle === 'monthly') {
    const monthly = Math.round(numPrice / 12);
    return <span className="text-3xl font-bold text-gray-900">£{monthly.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></span>;
  }
  return <span className="text-3xl font-bold text-gray-900">£{numPrice.toLocaleString()}<span className="text-sm font-normal text-gray-500">/yr</span></span>;
}

function EntitlementCheck({ included }: { included: boolean }) {
  return included
    ? <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
    : <span className="w-4 h-4 flex-shrink-0" />;
}

export function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState<'annual' | 'monthly'>('annual');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await apiGet<Plan[]>('/tenants/plans');
        const sorted = (plans || []).sort(
          (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
        );
        setPlans(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (tier: string) => {
    setCheckoutLoading(tier);
    try {
      const res = await apiPost<{ checkout_url: string }>('/billing/checkout', {
        tier,
        billing_cycle: cycle,
        success_url: `${window.location.origin}/billing/success`,
        cancel_url: `${window.location.origin}/billing/cancel`,
      });
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setCheckoutLoading(null);
    }
  };

  const currentTier = subscription?.plan_tier;

  const featureRows = [
    { label: 'Projects', getValue: (p: Plan) => p.max_projects },
    { label: 'Users', getValue: (p: Plan) => p.max_users },
    { label: 'Systems', getValue: (p: Plan) => p.max_connections },
    { label: 'Discovery', getValue: (p: Plan) => !!p.entitlements?.discovery },
    { label: 'Validation', getValue: (p: Plan) => !!p.entitlements?.validation },
    { label: 'Advanced Reporting', getValue: (p: Plan) => !!p.entitlements?.advanced_reporting || !!p.entitlements?.reporting },
    { label: 'Governance', getValue: (p: Plan) => !!p.entitlements?.governance },
    { label: 'Multi-Project', getValue: (p: Plan) => !!p.entitlements?.multi_project },
    { label: 'API Access', getValue: (p: Plan) => !!p.entitlements?.api_access },
    { label: 'Priority Support', getValue: (p: Plan) => !!p.entitlements?.priority_support || !!p.entitlements?.support },
  ];

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton rows={3} variant="card" height={200} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscription Plans</h1>
        <p className="text-sm text-gray-500">Choose the plan that fits your migration needs.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-4 text-sm">{error}</div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setCycle('annual')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            cycle === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Annual <span className="text-xs opacity-75">(save 20%)</span>
        </button>
        <button
          onClick={() => setCycle('monthly')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            cycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const price = cycle === 'annual' ? plan.annual_price : (plan.monthly_price || Math.round(plan.annual_price / 12));
          const isPopular = plan.tier === 'enterprise';

          return (
            <div
              key={plan.plan_id}
              className={`relative bg-white rounded-lg border-2 p-6 shadow-sm transition-all ${
                isCurrent
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : isPopular
                  ? 'border-blue-200 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</span>
                </div>
              )}

              <div className="text-center mb-6 pt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4 h-8">{plan.description}</p>
                <PriceTag price={price} cycle={cycle} />
              </div>

              <div className="space-y-3 mb-6">
                {featureRows.map((row) => {
                  const val = row.getValue(plan);
                  const isNum = typeof val === 'number';
                  return (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{row.label}</span>
                      {isNum ? (
                        <span className="font-semibold text-gray-900">{val}</span>
                      ) : (
                        <EntitlementCheck included={!!val} />
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.tier)}
                disabled={isCurrent || checkoutLoading === plan.tier}
                className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : checkoutLoading === plan.tier
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCurrent ? 'Current Plan' : checkoutLoading === plan.tier ? 'Redirecting...' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">No plans available. Contact support for assistance.</p>
        </div>
      )}
    </PageContainer>
  );
}
