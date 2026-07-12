import {
  Home, Clock, Star, Users, Calendar, FileText, Folder, History, Loader2, Eye, Search, Filter, LayoutGrid,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const reportCentreNavigation: NavigationItem[] = [
  { id: 'home', label: 'Report Home', path: '/report-centre', icon: Home },
  { id: 'recent', label: 'Recent Reports', path: '/report-centre/recent', icon: Clock },
  { id: 'my', label: 'My Reports', path: '/report-centre/my', icon: FileText },
  { id: 'shared', label: 'Shared Reports', path: '/report-centre/shared', icon: Users },
  { id: 'favourites', label: 'Favourite Reports', path: '/report-centre/favourites', icon: Star },
  { id: 'scheduled', label: 'Scheduled Reports', path: '/report-centre/scheduled', icon: Calendar },
  { id: 'templates', label: 'Templates', path: '/report-centre/templates', icon: FileText },
  { id: 'categories', label: 'Categories', path: '/report-centre/categories', icon: Folder },
  { id: 'explorer', label: 'Report Explorer', path: '/report-centre/explorer', icon: Folder },
  { id: 'history', label: 'Report History', path: '/report-centre/history', icon: History },
  { id: 'queue', label: 'Report Queue', path: '/report-centre/queue', icon: Loader2 },
  { id: 'preview', label: 'Preview', path: '/report-centre/preview', icon: Eye },
  { id: 'search', label: 'Search', path: '/report-centre/search', icon: Search },
  { id: 'filters', label: 'Filters', path: '/report-centre/filters', icon: Filter },
  { id: 'workspace', label: 'Workspace', path: '/report-centre/workspace', icon: LayoutGrid },
];
