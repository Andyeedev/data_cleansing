import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader2, Mail, RotateCcw } from 'lucide-react';
import { apiPost } from '../../utils/apiClient';
import { PageContainer } from '../../components/PageContainer/PageContainer';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!token) {
      setError('Invalid verification link. Token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiPost('/auth/verify-email', { token });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to verify email. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    navigate('/resend-verification');
  };

  if (!token) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Verification Link</h1>
          <p className="text-gray-600 mb-6">This verification link is missing the required token.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </PageContainer>
    );
  }

  if (success) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email has been verified successfully. You can now log in.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">Click the button below to verify your email address</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              onClick={handleResend}
              className="w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Resend Verification Email
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Already verified? Sign in
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}