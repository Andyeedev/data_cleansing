import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Loader2, Mail, User } from 'lucide-react';
import { apiPost } from '../../utils/apiClient';
import { PageContainer } from '../../components/PageContainer/PageContainer';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one digit';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }
    if (name === 'confirmPassword') {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);

    if (!token) {
      setError('Invalid invitation link. Token is missing.');
      return;
    }

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiPost('/invitations/accept', {
        token,
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created successfully. Please verify your email address.' } });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to accept invitation. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600">This invitation link is missing the required token.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h1>
          <p className="text-gray-600">Redirecting to login...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Accept Invitation</h1>
            <p className="text-gray-600 mt-2">Set your password to join MAP Nexus</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Min 8 chars, upper, lower, digit</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}