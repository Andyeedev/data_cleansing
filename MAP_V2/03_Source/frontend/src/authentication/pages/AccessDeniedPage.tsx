import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccessDeniedPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-error-500" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-100 mb-4">Access Denied</h1>
        <p className="text-neutral-60 mb-8">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={logout}
            className="text-neutral-60 hover:text-neutral-100 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
