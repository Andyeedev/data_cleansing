import { useState } from 'react';
import { Bell, Menu, Moon, Sun, ChevronDown } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationPanel } from './NotificationPanel';
import { UserProfileMenu } from './UserProfileMenu';
import { useNavigation } from '../navigation/NavigationContext';

export const Header = () => {
  const { toggleSidebar } = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-neutral-30 flex items-center justify-between px-4 lg:px-6 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-neutral-80" />
        </button>

        {/* MAP Nexus Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="hidden md:block text-lg font-semibold text-neutral-100">
            MAP Nexus™
          </span>
        </div>

        {/* Global Search */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-neutral-80" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-80" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 hover:bg-neutral-20 rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-neutral-80" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
          </button>
          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-2 hover:bg-neutral-20 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-60 hidden md:block" />
          </button>
          {showProfile && (
            <UserProfileMenu onClose={() => setShowProfile(false)} />
          )}
        </div>
      </div>
    </header>
  );
};
