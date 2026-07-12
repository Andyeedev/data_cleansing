export interface ExecutiveKPIData {
  id: string;
  label: string;
  value: string | number;
  delta?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    percentage?: boolean;
  };
  trend?: number[];
  variant?: 'positive' | 'negative' | 'warning' | 'info';
}

export interface ExecutiveProgrammeStatus {
  currentPhase: string;
  overallStatus: 'On Track' | 'At Risk' | 'Off Track' | 'Completed';
  completionPercentage: number;
  confidenceScore: number;
  lastExecution: string;
  phases: ProgrammePhase[];
}

export interface ProgrammePhase {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'pending' | 'blocked';
  progress?: number;
}

export interface ExecutiveRiskOverview {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallScore: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface ExecutiveActivityItem {
  id: string;
  type: 'validation' | 'report' | 'execution' | 'exception' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface ExecutiveReportItem {
  id: string;
  name: string;
  description: string;
  category: string;
  lastGenerated?: string;
  icon?: string;
}

export interface ExecutiveNotificationItem {
  id: string;
  type: 'critical' | 'system' | 'approval' | 'review' | 'escalation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ExecutiveDashboardData {
  kpis: ExecutiveKPIData[];
  programmeStatus: ExecutiveProgrammeStatus;
  riskOverview: ExecutiveRiskOverview;
  aiSummary: string;
  activities: ExecutiveActivityItem[];
  reports: ExecutiveReportItem[];
  notifications: ExecutiveNotificationItem[];
}
