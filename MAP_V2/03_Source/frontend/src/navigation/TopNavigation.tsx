import { Bell, Search, Menu, User, Sun } from 'lucide-react';
import { useNavigation } from './NavigationContext';

export const TopNavigation = () => {
  const {
    toggleMobileDrawer,
    toggleSearch,
    toggleNotification,
    notificationOpen,
  } = useNavigation();

  return (
    <header className="h-16 bg-white border-b border-neutral-30 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileDrawer}
          className="lg:hidden p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-neutral-80" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center bg-neutral-20 rounded-lg px-3 py-2 w-96">
          <Search className="w-4 h-4 text-neutral-60 mr-2" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="bg-transparent outline-none text-sm w-full text-neutral-100 placeholder-neutral-60"
            onFocus={toggleSearch}
            readOnly
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle placeholder */}
        <button
          className="p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Toggle theme"
          title="Theme toggle (coming soon)"
        >
          <Sun className="w-5 h-5 text-neutral-80" />
        </button>

        {/* Notifications */}
        <button
          onClick={toggleNotification}
          className="relative p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Notifications"
          aria-expanded={notificationOpen}
        >
          <Bell className="w-5 h-5 text-neutral-80" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
        </button>

        {/* User menu */}
        <button
          className="flex items-center gap-2 p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-neutral-100">
            User
          </span>
        </button>
      </div>
    </header>
  );
};
