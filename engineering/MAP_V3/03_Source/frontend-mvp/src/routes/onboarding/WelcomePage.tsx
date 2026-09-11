import { useNavigate } from 'react-router-dom';
import { Plus, Link as LinkIcon, BarChart3, FileText, BookOpen, Code, HelpCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { OnboardingCard } from '../../components/onboarding/OnboardingCard';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';
import { useSubscription } from '../../hooks/useSubscription';

function LimitBar({ current, max, label }: { current: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-800 tabular-nums">{current}/{max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function WelcomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { activeProject, availableProjects } = useProject();
  const { steps, percentage, isLoading } = useOnboardingProgress();
  const { subscription, daysUntilTrialEnd } = useSubscription();

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'there';
  const trialDays = daysUntilTrialEnd();
  const isTrialing = subscription?.status === 'trialing';
  const isNone = subscription?.status === 'none';

  return (
    <PageContainer>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel — Status */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {userName}</h1>
            <p className="text-sm text-gray-500 mb-6">MAP Nexus — Migration Assurance & Data Validation</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Projects</div>
                <div className="text-2xl font-bold text-blue-800 tabular-nums">{availableProjects.length}</div>
              </div>
              <div className="rounded-lg border-l-4 border-l-green-500 bg-green-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1">Status</div>
                <div className="text-lg font-bold text-green-800">{activeProject?.status || 'None'}</div>
              </div>
              <div className="rounded-lg border-l-4 border-l-purple-500 bg-purple-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Active Project</div>
                <div className="text-sm font-bold text-purple-800 truncate">{activeProject?.project_name || 'Not set'}</div>
              </div>
              <div className="rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Progress</div>
                <div className="text-2xl font-bold text-amber-800 tabular-nums">{percentage}%</div>
              </div>
            </div>

            {/* Subscription Plan Card */}
            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Subscription</h3>
                {!isNone && (
                  <button
                    onClick={() => navigate('/billing/subscription')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Manage
                  </button>
                )}
              </div>

              {isNone ? (
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-amber-900">No active plan</p>
                    <p className="text-xs text-amber-700">You're using default limits. Upgrade for more capacity.</p>
                  </div>
                  <button
                    onClick={() => navigate('/subscription/plans')}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 whitespace-nowrap"
                  >
                    View Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md uppercase">
                      {subscription?.plan_name || 'Unknown'}
                    </span>
                    {isTrialing && trialDays !== null && (
                      <span className="flex items-center gap-1 text-xs text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                        Trial: {trialDays} days remaining
                      </span>
                    )}
                    <span className="text-xs text-gray-500 capitalize">
                      {subscription?.billing_cycle || 'annual'} billing
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <LimitBar
                      current={subscription?.limits.projects.current ?? 0}
                      max={subscription?.limits.projects.max ?? 3}
                      label="Projects"
                    />
                    <LimitBar
                      current={subscription?.limits.connections.current ?? 0}
                      max={subscription?.limits.connections.max ?? 5}
                      label="Systems"
                    />
                    <LimitBar
                      current={subscription?.limits.users.current ?? 0}
                      max={subscription?.limits.users.max ?? 5}
                      label="Users"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <OnboardingProgress steps={steps} percentage={percentage} />

          {availableProjects.length > 0 && (
            <OnboardingCard state={isLoading ? 'loading' : 'content'}>
              <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Active Projects</h3>
              <div className="space-y-2">
                {availableProjects.map((p) => (
                  <div key={p.project_id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{p.project_name}</span>
                      <span className="ml-2 text-xs text-gray-500">({p.status})</span>
                    </div>
                    <button
                      onClick={() => navigate('/migration/projects')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </OnboardingCard>
          )}
        </div>

        {/* Right Panel — Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Quick Start</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/onboarding/setup')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">New Project</div>
                  <div className="text-xs text-gray-500">Create and set up a migration project</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/migration/connections')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Connect System</div>
                  <div className="text-xs text-gray-500">Add a source or target database</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/reports/suite/executive')}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">View Reports</div>
                  <div className="text-xs text-gray-500">Executive and operational reports</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-1">
                <BookOpen className="w-4 h-4" /> Documentation
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-1">
                <Code className="w-4 h-4" /> API Reference
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-1">
                <FileText className="w-4 h-4" /> Migration Guides
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-1">
                <HelpCircle className="w-4 h-4" /> Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
