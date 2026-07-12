import { NavLink } from 'react-router-dom';
import { BarChart3, Building2, Settings2, Database, CheckCircle, ShieldCheck, Search, Scale, Clock, FileText, Share2, Layout } from 'lucide-react';

const navItems = [
  { path: '/reports/overview', label: 'Overview', icon: Layout },
  { path: '/reports/executive', label: 'Executive Reports', icon: Building2 },
  { path: '/reports/operational', label: 'Operational Reports', icon: Settings2 },
  { path: '/reports/migration', label: 'Migration Reports', icon: Database },
  { path: '/reports/validation', label: 'Validation Reports', icon: CheckCircle },
  { path: '/reports/governance', label: 'Governance Reports', icon: ShieldCheck },
  { path: '/reports/audit', label: 'Audit Reports', icon: Search },
  { path: '/reports/regulatory', label: 'Regulatory Reports', icon: Scale },
  { path: '/reports/scheduled', label: 'Scheduled Reports', icon: Clock },
  { path: '/reports/templates', label: 'Templates', icon: FileText },
  { path: '/reports/distribution', label: 'Distribution', icon: Share2 },
  { path: '/reports/workspace', label: 'Workspace', icon: BarChart3 },
];

export const ReportingNavigation = () => {
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
