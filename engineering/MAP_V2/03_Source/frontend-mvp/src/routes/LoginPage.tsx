import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../config/constants';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password');
    }
  };

  const benefits = [
    {
      icon: CheckCircle,
      text: 'Enterprise-grade data migration',
    },
    {
      icon: Shield,
      text: 'Comprehensive validation rules',
    },
    {
      icon: Zap,
      text: 'Real-time analytics and reporting',
    },
  ];

  return (
    <div className="min-h-screen flex max-w-[930px] mx-auto gap-[0.1in]">
      {/* Left Side - Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">M</span>
            </div>
            <span className="text-white text-2xl font-semibold">MAP Nexus</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Enterprise Financial
            <br />
            Services Platform
          </h1>
          <p className="text-xl text-primary-100 mb-12 max-w-lg">
            Streamline your data migration, validation, and governance processes
            with our comprehensive enterprise solution.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-primary-200 text-sm">
            &copy; {new Date().getFullYear()} MAP Nexus. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-semibold text-neutral-100">MAP Nexus</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-100 mb-2">
                Welcome back
              </h2>
              <p className="text-neutral-60">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-100 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-100 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-3 pr-12 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-60 hover:text-neutral-100 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-neutral-60">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Support Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-60">
                Need help?{' '}
                <a
                  href="/support"
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-neutral-30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-neutral-60">
                  &copy; {new Date().getFullYear()} MAP Nexus. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-neutral-60">
                    Version {APP_VERSION}
                  </span>
                  <a
                    href="/privacy"
                    className="text-xs text-neutral-60 hover:text-primary-500 transition-colors"
                  >
                    Privacy
                  </a>
                  <a
                    href="/terms"
                    className="text-xs text-neutral-60 hover:text-primary-500 transition-colors"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
