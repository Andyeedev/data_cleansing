import { NavLink } from 'react-router-dom';
import { Shield, Key, Lock, FileCheck, Users, Smartphone, Wifi, Globe, AlertTriangle, Activity, Scale, Layout } from 'lucide-react';

const navItems = [
  { path: '/security/overview', label: 'Overview', icon: Layout },
  { path: '/security/credentials', label: 'Credentials', icon: Key },
  { path: '/security/encryption', label: 'Encryption', icon: Lock },
  { path: '/security/keys', label: 'Keys', icon: Key },
  { path: '/security/certificates', label: 'Certificates', icon: FileCheck },
  { path: '/security/identity-providers', label: 'Identity Providers', icon: Users },
  { path: '/security/authentication', label: 'Authentication', icon: Shield },
  { path: '/security/mfa', label: 'MFA', icon: Smartphone },
  { path: '/security/sessions', label: 'Sessions', icon: Wifi },
  { path: '/security/api-security', label: 'API Security', icon: Globe },
  { path: '/security/audit-logs', label: 'Audit Logs', icon: Activity },
  { path: '/security/security-events', label: 'Security Events', icon: AlertTriangle },
  { path: '/security/threat-monitoring', label: 'Threat Monitoring', icon: Shield },
  { path: '/security/compliance', label: 'Compliance', icon: Scale },
  { path: '/security/dashboard', label: 'Security Dashboard', icon: Layout },
];

export const SecurityNavigation = () => {
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
