import { NavLink } from 'react-router-dom';
import { Shield, FileText, Settings, AlertTriangle, Scale, Search, BarChart3, Layout } from 'lucide-react';

const navItems = [
  { path: '/governance/overview', label: 'Overview', icon: Layout },
  { path: '/governance/compliance', label: 'Compliance', icon: Shield },
  { path: '/governance/policies', label: 'Policies', icon: FileText },
  { path: '/governance/controls', label: 'Controls', icon: Settings },
  { path: '/governance/exceptions', label: 'Exceptions', icon: AlertTriangle },
  { path: '/governance/risk', label: 'Risk Governance', icon: Scale },
  { path: '/governance/audit', label: 'Audit Centre', icon: Search },
  { path: '/governance/reports', label: 'Regulatory Reporting', icon: BarChart3 },
  { path: '/governance/workspace', label: 'Workspace', icon: Layout },
];

export const GovernanceNavigation = () => {
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
