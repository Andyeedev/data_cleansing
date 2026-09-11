import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Database, Target } from 'lucide-react';
import { OnboardingWizard } from '../../components/onboarding/OnboardingWizard';
import { CreateProjectStep, ConnectSourceStep, ConnectTargetStep } from '../../components/onboarding/SetupSteps';

const WIZARD_STEPS = [
  { key: 'project', label: 'Create Project', icon: FolderPlus, status: 'active' as const },
  { key: 'source', label: 'Connect Source', icon: Database, status: 'pending' as const },
  { key: 'target', label: 'Connect Target', icon: Target, status: 'pending' as const },
];

export function OnboardingSetupPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = WIZARD_STEPS.map((s, i) => ({
    ...s,
    status: (i < activeStep ? 'complete' : i === activeStep ? 'active' : 'pending') as 'complete' | 'active' | 'pending',
  }));

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    } else {
      navigate('/onboarding/hub');
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/onboarding/welcome')}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Welcome
        </button>
      </div>

      <OnboardingWizard steps={steps} activeStep={activeStep} onStepClick={handleStepClick}>
        {activeStep === 0 && <CreateProjectStep onNext={handleNext} />}
        {activeStep === 1 && <ConnectSourceStep onNext={handleNext} />}
        {activeStep === 2 && <ConnectTargetStep onNext={handleNext} />}
      </OnboardingWizard>
    </div>
  );
}
