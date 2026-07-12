import { LayoutDashboard, ArrowRightLeft, CheckCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components/layout/PageTitle';
import { AIAssistant, AIInsights } from '../ai';

const features = [
  {
    title: 'Executive Dashboard',
    description: 'Real-time insights and analytics for decision makers.',
    icon: LayoutDashboard,
    path: '/dashboard/executive',
    color: 'bg-primary-50 text-primary-500',
  },
  {
    title: 'Migration',
    description: 'Manage and monitor data migration processes.',
    icon: ArrowRightLeft,
    path: '/migration',
    color: 'bg-success-50 text-success-500',
  },
  {
    title: 'Validation',
    description: 'Ensure data quality with automated validation rules.',
    icon: CheckCircle,
    path: '/validation',
    color: 'bg-secondary-50 text-secondary-600',
  },
  {
    title: 'Reports',
    description: 'Generate comprehensive reports and analytics.',
    icon: BarChart3,
    path: '/reports',
    color: 'bg-warning-50 text-warning-600',
  },
];

export const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <PageTitle
        title="Welcome to MAP Nexus"
        subtitle="Enterprise Financial Services Migration & Validation Platform"
      />

      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-white mb-8">
        <h2 className="text-2xl font-semibold mb-2">MAP Nexus™ Version 2</h2>
        <p className="text-primary-100 mb-4">
          Your comprehensive platform for managing financial data migrations,
          validation, governance, and risk assessment.
        </p>
        <Link
          to="/dashboard/executive"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="bg-white rounded-xl p-6 border border-neutral-30 hover:border-primary-500 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-60">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* AI Insights Demo */}
      <div style={{ marginBottom: '24px' }}>
        <AIInsights />
      </div>

      <AIAssistant />
    </div>
  );
};
