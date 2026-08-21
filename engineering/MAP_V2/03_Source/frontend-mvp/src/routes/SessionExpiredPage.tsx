import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';

export function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-warning-500" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-100 mb-4">Session Expired</h1>
        <p className="text-neutral-60 mb-8">
          Your session has expired. Please sign in again to continue.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sign In Again
        </Link>
      </div>
    </div>
  );
}
