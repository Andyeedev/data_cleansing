export type AIProviderType = 'azure-openai' | 'openai' | 'claude' | 'gemini' | 'ollama' | 'custom';

export type AIModelTier = 'basic' | 'standard' | 'advanced' | 'enterprise';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderType;
  tier: AIModelTier;
  maxTokens: number;
  contextWindow: number;
  supportsStreaming: boolean;
  supportsFunctions: boolean;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  description: string;
}

export interface AIModelConfig {
  modelId: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    tier: 'advanced',
    maxTokens: 4096,
    contextWindow: 128000,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kInputTokens: 0.005,
    costPer1kOutputTokens: 0.015,
    description: 'Advanced multimodal model'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    tier: 'standard',
    maxTokens: 4096,
    contextWindow: 128000,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kInputTokens: 0.00015,
    costPer1kOutputTokens: 0.0006,
    description: 'Fast and cost-effective'
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'claude',
    tier: 'advanced',
    maxTokens: 8192,
    contextWindow: 200000,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kInputTokens: 0.003,
    costPer1kOutputTokens: 0.015,
    description: 'Balanced performance and speed'
  },
  {
    id: 'claude-haiku-35-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    tier: 'basic',
    maxTokens: 8192,
    contextWindow: 200000,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kInputTokens: 0.001,
    costPer1kOutputTokens: 0.005,
    description: 'Fast and affordable'
  }
];

export const DEFAULT_MODEL_CONFIG: AIModelConfig = {
  modelId: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: []
};
