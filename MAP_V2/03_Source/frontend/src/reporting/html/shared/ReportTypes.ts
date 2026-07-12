import type { LucideIcon } from 'lucide-react';

export type HtmlReportType =
  | 'executive'
  | 'migration'
  | 'validation'
  | 'governance'
  | 'risk'
  | 'security'
  | 'administration'
  | 'audit'
  | 'ai';

export type HtmlReportFormat = 'html' | 'pdf' | 'excel' | 'csv';

export type HtmlReportStatus = 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';

export type HtmlReportSectionType =
  | 'cover'
  | 'summary'
  | 'toc'
  | 'kpi'
  | 'chart'
  | 'table'
  | 'risk'
  | 'recommendation'
  | 'appendix'
  | 'audit-trail'
  | 'evidence'
  | 'custom';

export type HtmlReportChartType = 'bar' | 'line' | 'pie' | 'area' | 'gauge';

export type HtmlReportClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface HtmlReportSectionConfig {
  id: string;
  type: HtmlReportSectionType;
  title: string;
  description?: string;
  visible?: boolean;
  order?: number;
  icon?: LucideIcon;
  children?: HtmlReportSectionConfig[];
}

export interface HtmlReportConfig {
  id: string;
  name: string;
  type: HtmlReportType;
  format: HtmlReportFormat;
  classification: HtmlReportClassification;
  description: string;
  author: string;
  version: string;
  sections: HtmlReportSectionConfig[];
  metadata?: Record<string, unknown>;
}

export interface HtmlReportMetadata {
  id: string;
  name: string;
  type: HtmlReportType;
  description: string;
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  classification: HtmlReportClassification;
  status: HtmlReportStatus;
}

export interface HtmlReportNavigationItem {
  id: string;
  label: string;
  sectionId: string;
  icon?: LucideIcon;
  children?: HtmlReportNavigationItem[];
}

export interface HtmlReportTemplate {
  id: string;
  name: string;
  type: HtmlReportType;
  description: string;
  sections: HtmlReportSectionConfig[];
  defaultData: Record<string, unknown>;
}

export interface HtmlReportDefinition {
  id: string;
  name: string;
  type: HtmlReportType;
  format: HtmlReportFormat;
  classification: HtmlReportClassification;
  description: string;
  author: string;
  version: string;
  status: HtmlReportStatus;
  sections: HtmlReportSectionConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface HtmlKPIData {
  id: string;
  label: string;
  value: string | number;
  delta?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    percentage?: number;
  };
  icon?: string;
}

export interface HtmlTableData {
  id: string;
  title: string;
  columns: { key: string; label: string; width?: string }[];
  rows: Record<string, unknown>[];
}

export interface HtmlChartData {
  id: string;
  title: string;
  type: HtmlReportChartType;
  series: { name: string; data: number[] }[];
  labels: string[];
}

export interface HtmlRiskData {
  id: string;
  title: string;
  rating: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  mitigation?: string;
  owner?: string;
}

export interface HtmlRecommendationData {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  owner?: string;
}

export interface HtmlAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'access' | 'export';
}

export interface HtmlEvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'screenshot' | 'document' | 'log' | 'export';
  url?: string;
  timestamp?: string;
}
