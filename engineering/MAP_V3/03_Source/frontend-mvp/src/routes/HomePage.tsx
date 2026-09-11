import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRightLeft, BarChart3 } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">MAP Nexus</h1>
        <p className="text-xl text-gray-500 mb-2">Migration Assurance & Data Validation</p>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
          Enterprise-grade data migration platform with real-time validation and quality assurance.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mb-12"
        >
          Sign In
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Validate Data Quality</h3>
            <p className="text-xs text-gray-500">Automated validation rules ensure data integrity throughout migration.</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <ArrowRightLeft className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Migrate with Confidence</h3>
            <p className="text-xs text-gray-500">End-to-end migration workflows with real-time progress tracking.</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Report with Clarity</h3>
            <p className="text-xs text-gray-500">Executive and operational dashboards for complete visibility.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
