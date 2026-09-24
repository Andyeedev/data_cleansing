import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiPost } from '../../utils/apiClient';
import { PageContainer } from '../../components/PageContainer/PageContainer';

export function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await apiPost('/auth/resend-verification', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {success ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent</h1>
              <p className="text-gray-600 mb-6">
                If the email exists and is eligible, a verification link has been sent.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Resend Verification</h1>
                <p className="text-gray-600 mt-2">Enter your email to receive a new verification link</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Verification Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}