import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">
            Reset Password
          </h1>
          <p className="text-sm text-neutral-60 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-30">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-100 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-3 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Send Reset Link
            </button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-500 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
