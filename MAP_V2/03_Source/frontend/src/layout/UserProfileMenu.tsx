import { Link } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../authentication/context/AuthContext';

interface UserProfileMenuProps {
  onClose: () => void;
}

export const UserProfileMenu = ({ onClose }: UserProfileMenuProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-neutral-30 rounded-xl shadow-lg z-50">
        {/* User Info */}
        <div className="p-4 border-b border-neutral-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-neutral-100 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-sm text-neutral-60 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center justify-between p-2 hover:bg-neutral-20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-neutral-60" />
              <span className="text-sm text-neutral-100">Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-60" />
          </Link>

          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center justify-between p-2 hover:bg-neutral-20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-neutral-60" />
              <span className="text-sm text-neutral-100">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-60" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-2 hover:bg-neutral-20 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-error-500" />
              <span className="text-sm text-error-500">Sign out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-60" />
          </button>
        </div>
      </div>
    </>
  );
};
