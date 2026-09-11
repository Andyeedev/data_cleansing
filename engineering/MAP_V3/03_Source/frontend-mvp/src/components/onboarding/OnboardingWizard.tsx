import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Check, Circle } from 'lucide-react';

interface WizardStep {
  key: string;
  label: string;
  icon: LucideIcon;
  status: 'complete' | 'active' | 'pending';
}

interface OnboardingWizardProps {
  steps: WizardStep[];
  activeStep: number;
  onStepClick?: (index: number) => void;
  children: React.ReactNode;
}

export function OnboardingWizard({ steps, activeStep, onStepClick, children }: OnboardingWizardProps) {
  const completedCount = steps.filter((s) => s.status === 'complete').length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="flex min-h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <aside className="w-60 bg-gray-50 border-r border-gray-200 p-5 flex flex-col">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Steps</h3>

        <nav className="flex-1">
          <ul className="space-y-1">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === activeStep;
              const isClickable = step.status === 'complete' || isActive;

              return (
                <li key={step.key}>
                  <button
                    onClick={() => isClickable && onStepClick?.(index)}
                    disabled={!isClickable}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : step.status === 'complete'
                        ? 'text-green-700 hover:bg-green-50'
                        : 'text-gray-400 cursor-default'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {step.status === 'complete' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : isActive ? (
                        <StepIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </span>
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : ''}`}>
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700 tabular-nums">{percentage}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {completedCount} of {steps.length} complete
          </p>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
