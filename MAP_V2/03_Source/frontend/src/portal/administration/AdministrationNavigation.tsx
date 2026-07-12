import { NavLink } from 'react-router-dom';
import { Layout, Building2, FolderTree, Users, Shield, Key, CreditCard, FileText, Settings, ToggleRight, Cog, Clock, Bell, Server, Wrench, Heart, LayoutDashboard } from 'lucide-react';

const navItems = [
  { path: '/administration/overview', label: 'Overview', icon: Layout },
  { path: '/administration/tenants', label: 'Tenants', icon: Building2 },
  { path: '/administration/organisations', label: 'Organisations', icon: FolderTree },
  { path: '/administration/users', label: 'Users', icon: Users },
  { path: '/administration/roles', label: 'Roles', icon: Shield },
  { path: '/administration/permissions', label: 'Permissions', icon: Key },
  { path: '/administration/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/administration/licensing', label: 'Licensing', icon: FileText },
  { path: '/administration/configuration', label: 'Platform Configuration', icon: Settings },
  { path: '/administration/feature-flags', label: 'Feature Flags', icon: ToggleRight },
  { path: '/administration/system-settings', label: 'System Settings', icon: Cog },
  { path: '/administration/scheduler', label: 'Scheduler', icon: Clock },
  { path: '/administration/notifications', label: 'Notifications', icon: Bell },
  { path: '/administration/environment', label: 'Environment', icon: Server },
  { path: '/administration/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/administration/health', label: 'Platform Health', icon: Heart },
  { path: '/administration/dashboard', label: 'Administration Dashboard', icon: LayoutDashboard },
];

export const AdministrationNavigation = () => {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-neutral-60 hover:bg-neutral-10 hover:text-neutral-100'
            }`
          }
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
