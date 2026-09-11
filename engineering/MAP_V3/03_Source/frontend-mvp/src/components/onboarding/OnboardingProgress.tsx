import { Check, ArrowRight, Circle } from 'lucide-react';
import type { OnboardingStep } from '../../hooks/useOnboardingProgress';

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  percentage: number;
}

const WIDTH_CLASSES: Record<number, string> = {
  0: 'w-0', 5: 'w-[5%]', 10: 'w-[10%]', 15: 'w-[15%]', 20: 'w-[20%]', 25: 'w-[25%]',
  30: 'w-[30%]', 35: 'w-[35%]', 40: 'w-[40%]', 45: 'w-[45%]', 50: 'w-[50%]', 55: 'w-[55%]',
  60: 'w-[60%]', 65: 'w-[65%]', 70: 'w-[70%]', 75: 'w-[75%]', 80: 'w-[80%]', 85: 'w-[85%]',
  90: 'w-[90%]', 95: 'w-[95%]', 100: 'w-full',
};

function widthClass(percent: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  return WIDTH_CLASSES[Math.round(clamped / 5) * 5] ?? 'w-0';
}

export function OnboardingProgress({ steps, percentage }: OnboardingProgressProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Migration Progress</h2>
        <span className="text-sm font-semibold text-gray-700 tabular-nums">{percentage}%</span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full bg-blue-600 transition-all duration-500 ${widthClass(percentage)}`}
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {steps.map((step) => (
          <div key={step.key} className="flex items-center gap-1.5">
            {step.status === 'complete' && (
              <Check className="w-4 h-4 text-green-600" />
            )}
            {step.status === 'active' && (
              <ArrowRight className="w-4 h-4 text-blue-600" />
            )}
            {step.status === 'pending' && (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
            <span
              className={`text-sm ${
                step.status === 'complete'
                  ? 'text-green-700 font-medium'
                  : step.status === 'active'
                  ? 'text-blue-700 font-medium'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
