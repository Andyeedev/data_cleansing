interface EnvironmentBannerProps {
  environment: 'development' | 'testing' | 'uat' | 'production';
}

const environmentConfig = {
  development: {
    label: 'Development',
    bgColor: 'bg-warning-50',
    textColor: 'text-warning-700',
    borderColor: 'border-warning-200',
  },
  testing: {
    label: 'Testing',
    bgColor: 'bg-info-50',
    textColor: 'text-info-700',
    borderColor: 'border-info-200',
  },
  uat: {
    label: 'UAT',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
  },
  production: {
    label: 'Production',
    bgColor: 'bg-success-50',
    textColor: 'text-success-700',
    borderColor: 'border-success-200',
  },
};

export const EnvironmentBanner = ({ environment }: EnvironmentBannerProps) => {
  const config = environmentConfig[environment];

  // Don't show banner in production
  if (environment === 'production') return null;

  return (
    <div
      className={`${config.bgColor} ${config.textColor} ${config.borderColor} border-b px-4 py-1 text-center text-sm font-medium`}
    >
      ⚠ {config.label} Environment
    </div>
  );
};
