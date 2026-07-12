import { Link } from 'react-router-dom';
import { User, Mail, Shield, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-10 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-100 mb-8">Profile</h1>

        {/* User Info Card */}
        <div className="bg-neutral-10 border border-neutral-30 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-100">{user?.name || 'User'}</h2>
              <p className="text-neutral-60">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-30">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-60" />
                <span className="text-neutral-100">Email</span>
              </div>
              <span className="text-neutral-60">{user?.email || 'user@example.com'}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-neutral-30">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-neutral-60" />
                <span className="text-neutral-100">Roles</span>
              </div>
              <span className="text-neutral-60">{user?.roles?.join(', ') || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-neutral-10 border border-neutral-30 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Account Actions</h3>
          <div className="space-y-3">
            <Link
              to="/change-password"
              className="flex items-center justify-between p-4 border border-neutral-30 rounded-lg hover:bg-neutral-10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-neutral-60" />
                <span className="text-neutral-100 font-medium">Change Password</span>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-60" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
