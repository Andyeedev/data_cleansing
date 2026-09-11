import { useNavigate } from 'react-router-dom';
import { FolderPlus, Database, Target, Search, Table2, ArrowRightLeft, ShieldCheck, FileText, Clock } from 'lucide-react';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';
import { useSubscription } from '../../hooks/useSubscription';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';

interface SpokeCard {
  key: string;
  label: string;
  icon: typeof FolderPlus;
  route: string;
}

const SPOKES: SpokeCard[] = [
  { key: 'project', label: 'Project', icon: FolderPlus, route: '/migration/projects' },
  { key: 'source', label: 'Source System', icon: Database, route: '/migration/connections' },
  { key: 'target', label: 'Target System', icon: Target, route: '/migration/connections' },
  { key: 'discovery', label: 'Discovery', icon: Search, route: '/migration/discovery' },
  { key: 'datasets', label: 'Datasets', icon: Table2, route: '/migration/datasets' },
  { key: 'mappings', label: 'Mappings', icon: ArrowRightLeft, route: '/migration/mappings/spreadsheet' },
  { key: 'validation', label: 'Validation', icon: ShieldCheck, route: '/validation-centre' },
];

function LimitPill({ current, max, label }: { current: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  const color = pct >= 90 ? 'text-red-700 bg-red-50 border-red-200' : pct >= 70 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-green-700 bg-green-50 border-green-200';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium ${color}`}>
      <span>{label}</span>
      <span className="tabular-nums">{current}/{max}</span>
    </div>
  );
}

export function OnboardingHubPage() {
  const navigate = useNavigate();
  const { steps, percentage, isLoading } = useOnboardingProgress();
  const { subscription, daysUntilTrialEnd, isAtLimit } = useSubscription();

  const getStepStatus = (key: string): 'complete' | 'active' | 'pending' => {
    const step = steps.find((s) => s.key === key);
    return step?.status ?? 'pending';
  };

  const trialDays = daysUntilTrialEnd();
  const isTrialing = subscription?.status === 'trialing';
  const isNone = subscription?.status === 'none';

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSkeleton rows={2} variant="card" height={80} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" height={120} />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Migration Hub</h1>
        <p className="text-sm text-gray-500">Your migration journey — complete each step to move forward.</p>
      </div>

      {/* Subscription Limit Strip */}
      {!isNone && subscription && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase">
                {subscription.plan_name}
              </span>
              {isTrialing && trialDays !== null && (
                <span className="flex items-center gap-1 text-xs text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                  Trial: {trialDays}d left
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <LimitPill current={subscription.limits.projects.current} max={subscription.limits.projects.max} label="Projects" />
              <LimitPill current={subscription.limits.connections.current} max={subscription.limits.connections.max} label="Systems" />
              <LimitPill current={subscription.limits.users.current} max={subscription.limits.users.max} label="Users" />
            </div>
          </div>
        </div>
      )}

      {isNone && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-900">No active subscription</p>
            <p className="text-xs text-amber-700">You're on default limits. Upgrade for more capacity.</p>
          </div>
          <button
            onClick={() => navigate('/subscription/plans')}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            View Plans
          </button>
        </div>
      )}

      <OnboardingProgress steps={steps} percentage={percentage} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SPOKES.map((spoke) => {
          const status = getStepStatus(spoke.key);
          const Icon = spoke.icon;

          return (
            <button
              key={spoke.key}
              onClick={() => navigate(spoke.route)}
              className={`bg-white rounded-lg border p-5 shadow-sm text-left transition-all hover:shadow-md ${
                status === 'complete'
                  ? 'border-green-200 hover:border-green-300'
                  : status === 'active'
                  ? 'border-blue-200 hover:border-blue-300 ring-1 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === 'complete' ? 'bg-green-100' : status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    status === 'complete' ? 'text-green-600' : status === 'active' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  status === 'complete'
                    ? 'bg-green-100 text-green-700'
                    : status === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {status === 'complete' ? 'Complete' : status === 'active' ? 'In Progress' : 'Not Started'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-1">{spoke.label}</h3>
              <p className="text-xs text-gray-500">
                {status === 'complete'
                  ? '已完成 — click to review'
                  : status === 'active'
                  ? 'Ready to configure'
                  : 'Complete previous steps first'}
              </p>
            </button>
          );
        })}

        <button
          onClick={() => navigate('/reports/suite/executive')}
          className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm text-left transition-all hover:shadow-md hover:border-gray-300 opacity-75"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Always Available
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Reports</h3>
          <p className="text-xs text-gray-500">View executive and operational reports</p>
        </button>
      </div>

      {percentage === 100 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 text-center">
          <h3 className="text-lg font-bold text-green-900 mb-1">Migration Setup Complete!</h3>
          <p className="text-sm text-green-700 mb-4">All steps are done. You can now run validations and generate reports.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </PageContainer>
  );
}
