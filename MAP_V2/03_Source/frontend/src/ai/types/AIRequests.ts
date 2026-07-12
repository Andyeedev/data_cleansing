import type { AIModelConfig } from './AIModels';

export type AIRequestType = 'chat' | 'completion' | 'embedding' | 'function' | 'stream';

export type AIModuleType =
  | 'executive'
  | 'operations'
  | 'migration'
  | 'validation'
  | 'governance'
  | 'reporting'
  | 'security'
  | 'administration'
  | 'copilot'
  | 'general';

export type AIPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AIPromptTemplate {
  id: string;
  name: string;
  module: AIModuleType;
  systemPrompt: string;
  userPromptTemplate: string;
  description: string;
  variables: string[];
}

export interface AIRequest {
  id: string;
  type: AIRequestType;
  module: AIModuleType;
  prompt: string;
  systemPrompt?: string;
  context: AIRequestContext;
  modelConfig?: Partial<AIModelConfig>;
  priority: AIPriority;
  metadata: Record<string, unknown>;
  timestamp: Date;
  userId: string;
  tenantId: string;
}

export interface AIRequestContext {
  portal: string;
  report?: string;
  dataset?: string;
  sessionId: string;
  conversationHistory: AIConversationMessage[];
  permissions: string[];
  preferences: Record<string, unknown>;
}

export interface AIConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AIStreamRequest extends AIRequest {
  type: 'stream';
  onChunk: (chunk: AIStreamChunk) => void;
  onComplete: (response: AIRequestResponse) => void;
  onError: (error: AIRequestError) => void;
}

export interface AIStreamChunk {
  id: string;
  delta: string;
  finishReason?: string;
}

export interface AIRequestResponse {
  id: string;
  requestId: string;
  content: string;
  finishReason: string;
  usage: AIUsageData;
  model: string;
  provider: string;
  latencyMs: number;
  metadata: Record<string, unknown>;
}

export interface AIUsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface AIRequestError {
  id: string;
  requestId: string;
  code: string;
  message: string;
  retryable: boolean;
  metadata?: Record<string, unknown>;
}
