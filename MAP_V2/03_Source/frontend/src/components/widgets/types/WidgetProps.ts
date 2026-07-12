import type { ReactNode } from 'react';
import type { WidgetConfig, WidgetState, WidgetAction } from './WidgetTypes';

// Base Widget Props
export interface BaseWidgetProps {
  config: WidgetConfig;
  state?: WidgetState;
  error?: string | null;
  onRefresh?: () => void;
  onAction?: (actionId: string) => void;
  className?: string;
}

// Widget Header Props
export interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: WidgetAction[];
  onRefresh?: () => void;
  onAction?: (actionId: string) => void;
  className?: string;
}

// Widget Body Props
export interface WidgetBodyProps {
  children: ReactNode;
  className?: string;
}

// Widget Footer Props
export interface WidgetFooterProps {
  children?: ReactNode;
  className?: string;
}

// Widget Loader Props
export interface WidgetLoaderProps {
  message?: string;
  className?: string;
}

// Widget Error Props
export interface WidgetErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

// Widget Empty Props
export interface WidgetEmptyProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
}

// KPI Widget Props
export interface KPIWidgetProps extends BaseWidgetProps {
  data?: {
    value: string | number;
    label?: string;
    delta?: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
      percentage?: boolean;
    };
    trend?: number[];
    icon?: ReactNode;
    footer?: ReactNode;
  };
}

// Status Widget Props
export interface StatusWidgetProps extends BaseWidgetProps {
  data?: {
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    title: string;
    description?: string;
    icon?: ReactNode;
  };
}

// Metric Widget Props
export interface MetricWidgetProps extends BaseWidgetProps {
  data?: {
    value: string | number;
    label: string;
    subtitle?: string;
    icon?: ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  };
}

// Chart Widget Props
export interface ChartWidgetProps extends BaseWidgetProps {
  data?: {
    series?: { name: string; data: number[] }[];
    labels?: string[];
    height?: number;
  };
}

// Table Widget Props
export interface TableWidgetProps extends BaseWidgetProps {
  data?: {
    columns: { key: string; label: string; width?: number }[];
    rows: Record<string, unknown>[];
    sortable?: boolean;
    paginated?: boolean;
    pageSize?: number;
  };
}

// Report Widget Props
export interface ReportWidgetProps extends BaseWidgetProps {
  data?: {
    content: string;
    format: 'html' | 'markdown';
    title?: string;
  };
}

// AI Widget Props
export interface AIWidgetProps extends BaseWidgetProps {
  data?: {
    insights?: { id: string; type: string; title: string; description: string }[];
    summary?: string;
    recommendations?: { id: string; title: string; description: string; priority: string }[];
  };
}

// System Widget Props
export interface SystemWidgetProps extends BaseWidgetProps {
  data?: {
    notifications?: { id: string; title: string; message: string; type: string; timestamp: string }[];
    tasks?: { id: string; title: string; status: string; dueDate?: string }[];
    timeline?: { id: string; title: string; timestamp: string; type: string }[];
  };
}
