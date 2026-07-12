import { LayoutDashboard, FileBarChart, Bot, ShieldCheck, ClipboardList, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const executiveNavigationItems: NavigationItem[] = [
  { id: 'exec-dashboard', label: 'Dashboard', path: '/dashboard/executive', icon: LayoutDashboard },
  { id: 'exec-reports', label: 'Reports', path: '/reports', icon: FileBarChart },
  { id: 'exec-ai', label: 'AI Insights', path: '/ai', icon: Bot },
  { id: 'exec-programme', label: 'Programme Status', path: '/migration', icon: ClipboardList },
  { id: 'exec-risk', label: 'Risk', path: '/risk', icon: ShieldCheck },
  { id: 'exec-governance', label: 'Governance', path: '/governance', icon: ShieldCheck },
  { id: 'exec-settings', label: 'Settings', path: '/settings', icon: Settings },
];

export const ExecutiveNavigation = () => {
  return null;
};
