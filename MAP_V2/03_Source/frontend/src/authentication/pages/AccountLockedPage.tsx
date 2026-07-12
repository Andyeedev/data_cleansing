import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

export const AccountLockedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-warning-500" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-100 mb-4">Account Locked</h1>
        <p className="text-neutral-60 mb-8">
          Your account has been temporarily locked due to too many failed login attempts.
          Please try again later or contact support for assistance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <a
            href="/support"
            className="text-neutral-60 hover:text-neutral-100 font-medium transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};
