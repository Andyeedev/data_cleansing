import type { ReactNode } from 'react';

// Dashboard Types
export type DashboardType = 'executive' | 'migration' | 'validation' | 'governance' | 'risk' | 'reporting' | 'administration' | 'ai';

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type WidgetStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export type KPIVariant = 'positive' | 'negative' | 'neutral' | 'warning' | 'critical';

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'heatmap' | 'gauge' | 'timeline';

// Dashboard Context
export interface DashboardFilter {
  id: string;
  label: string;
  type: 'dropdown' | 'search' | 'checkbox' | 'toggle' | 'date' | 'multiselect';
  value: unknown;
  options?: { label: string; value: unknown }[];
}

export interface DashboardState {
  currentDashboard: DashboardType;
  filters: DashboardFilter[];
  selectedWidgets: string[];
  refreshKey: number;
  isLoading: boolean;
}

export interface DashboardContextType extends DashboardState {
  setCurrentDashboard: (dashboard: DashboardType) => void;
  setFilter: (filterId: string, value: unknown) => void;
  clearFilters: () => void;
  toggleWidget: (widgetId: string) => void;
  refreshDashboard: () => void;
  setLoading: (loading: boolean) => void;
}

// Widget Types
export interface WidgetConfig {
  id: string;
  title: string;
  size: WidgetSize;
  type: string;
  refreshable?: boolean;
  exportable?: boolean;
  configurable?: boolean;
}

export interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
}

export interface WidgetFooterProps {
  children?: ReactNode;
  className?: string;
}

export interface WidgetContainerProps {
  id: string;
  title: string;
  subtitle?: string;
  size?: WidgetSize;
  status?: WidgetStatus;
  refreshable?: boolean;
  exportable?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

// KPI Types
export interface KPICardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    percentage?: boolean;
  };
  trend?: {
    value: number[];
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: KPIVariant;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: KPIVariant;
  className?: string;
}

export interface StatusCardProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export interface TrendCardProps {
  title: string;
  value: string | number;
  trend: number[];
  period?: string;
  variant?: KPIVariant;
  className?: string;
}

export interface RiskCardProps {
  title: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  icon?: ReactNode;
  className?: string;
}

export interface ValidationCardProps {
  title: string;
  total: number;
  passed: number;
  failed: number;
  icon?: ReactNode;
  className?: string;
}

export interface MigrationCardProps {
  title: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  icon?: ReactNode;
  className?: string;
}

export interface InformationCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

// Panel Types
export interface ChartPanelProps {
  title: string;
  chartType: ChartType;
  data?: unknown;
  height?: number;
  className?: string;
}

export interface TablePanelProps {
  title: string;
  columns?: { key: string; label: string; width?: number }[];
  data?: unknown[];
  className?: string;
}

export interface ReportPanelProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export interface ActivityPanelProps {
  title?: string;
  activities?: ActivityItem[];
  className?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AIInsightPanelProps {
  title?: string;
  insights?: AIInsight[];
  className?: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'observation' | 'warning' | 'action';
  title: string;
  description: string;
}

export interface ProgressPanelProps {
  title: string;
  progress: number;
  total?: number;
  status?: 'idle' | 'running' | 'completed' | 'error';
  className?: string;
}

// Dashboard Layout Types
export interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export interface DashboardPageProps {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export interface DashboardGridProps {
  children: ReactNode;
  columns?: number;
  className?: string;
}

export interface DashboardSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

// Toolbar Types
export interface DashboardToolbarProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  onFilter?: () => void;
  onDateRange?: () => void;
  onSearch?: (query: string) => void;
  onAIAssistant?: () => void;
  onHelp?: () => void;
  className?: string;
}

// Filter Types
export interface DashboardFilterConfig {
  id: string;
  label: string;
  type: 'dropdown' | 'search' | 'checkbox' | 'toggle' | 'date' | 'multiselect';
  value: unknown;
  options?: { label: string; value: unknown }[];
  placeholder?: string;
}

export interface DashboardFiltersProps {
  filters: DashboardFilterConfig[];
  onFilterChange: (filterId: string, value: unknown) => void;
  className?: string;
}

// Table Types
export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  render?: (value: unknown, row: unknown) => ReactNode;
}

export interface TableContainerProps {
  columns: TableColumn[];
  data: unknown[];
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  exportable?: boolean;
  className?: string;
}
