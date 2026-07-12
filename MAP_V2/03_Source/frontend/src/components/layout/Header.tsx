import { Bell, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-neutral-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-neutral-20 rounded-md"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-neutral-80" />
        </button>
        <div className="hidden md:flex items-center bg-neutral-20 rounded-lg px-3 py-2 w-96">
          <Search className="w-4 h-4 text-neutral-60 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full text-neutral-100 placeholder-neutral-60"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 hover:bg-neutral-20 rounded-md"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-neutral-80" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-neutral-20 rounded-md p-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-neutral-100">
            User
          </span>
        </div>
      </div>
    </header>
  );
};
