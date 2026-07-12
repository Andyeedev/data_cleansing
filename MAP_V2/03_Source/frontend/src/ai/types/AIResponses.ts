export type AIResponseStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'timeout';

export type AIContentFormat = 'text' | 'markdown' | 'json' | 'html' | 'chart' | 'table';

export interface AIResponse {
  id: string;
  requestId: string;
  status: AIResponseStatus;
  content: string;
  format: AIContentFormat;
  citations: AICitation[];
  suggestions: AISuggestion[];
  usage: AIResponseUsage;
  latencyMs: number;
  model: string;
  provider: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AICitation {
  id: string;
  source: string;
  sourceType: 'report' | 'dataset' | 'audit' | 'document' | 'system';
  title: string;
  url?: string;
  excerpt: string;
  confidence: number;
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'query' | 'navigation' | 'report' | 'insight';
  label: string;
  description: string;
  payload: Record<string, unknown>;
  confidence: number;
}

export interface AIResponseUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  model: string;
  provider: string;
}

export interface AISummaryResponse extends AIResponse {
  summaryType: 'executive' | 'technical' | 'compliance' | 'risk' | 'migration';
  keyPoints: string[];
  metrics: AIMetric[];
}

export interface AIMetric {
  name: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

export interface AIInsightResponse extends AIResponse {
  insightType: 'pattern' | 'anomaly' | 'trend' | 'prediction' | 'recommendation';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  affectedEntities: string[];
}

export interface AIConversationResponse extends AIResponse {
  conversationId: string;
  messageId: string;
  suggestedFollowUps: string[];
}
