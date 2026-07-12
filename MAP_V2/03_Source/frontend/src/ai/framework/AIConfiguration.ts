import type { AIProviderType, AIModelConfig } from '../types/AIModels';
import type { AIModuleType } from '../types/AIRequests';

export interface AISafetyPolicy {
  id: string;
  name: string;
  enabled: boolean;
  rules: AISafetyRule[];
}

export interface AISafetyRule {
  type: 'blocked-topic' | 'max-length' | 'pii-detection' | 'content-filter' | 'rate-limit';
  config: Record<string, unknown>;
}

export interface AIPromptTemplateConfig {
  id: string;
  name: string;
  module: AIModuleType;
  template: string;
  variables: string[];
  isSystem: boolean;
}

export interface AIRateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  tokensPerMinute: number;
  tokensPerDay: number;
}

export interface AIRetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export interface AIConfiguration {
  provider: AIProviderType;
  model: AIModelConfig;
  moduleDefaults: Partial<Record<AIModuleType, AIModelConfig>>;
  safetyPolicies: AISafetyPolicy[];
  promptTemplates: AIPromptTemplateConfig[];
  rateLimits: AIRateLimitConfig;
  retryPolicy: AIRetryPolicy;
  systemPrompts: Record<string, string>;
  features: {
    streaming: boolean;
    citations: boolean;
    suggestions: boolean;
    audit: boolean;
    usageTracking: boolean;
  };
}

export const DEFAULT_SYSTEM_PROMPTS: Record<string, string> = {
  general: `You are an AI assistant for the MAP Nexus™ Enterprise Platform.
Provide helpful, accurate, and concise responses.
Always respect user permissions and tenant isolation.
Never expose sensitive data not available to the requesting user.`,

  executive: `You are an executive AI assistant for MAP Nexus™.
Focus on high-level insights, KPIs, and strategic recommendations.
Present information clearly for executive decision-making.`,

  operations: `You are an operations AI assistant for MAP Nexus™.
Focus on operational metrics, queue status, and process optimization.
Provide actionable insights for operational efficiency.`,

  migration: `You are a migration AI assistant for MAP Nexus™.
Focus on migration progress, data quality, and risk assessment.
Provide clear status updates and recommendations.`,

  governance: `You are a governance AI assistant for MAP Nexus™.
Focus on compliance, policy adherence, and audit readiness.
Ensure regulatory requirements are clearly communicated.`,

  security: `You are a security AI assistant for MAP Nexus™.
Focus on security events, threat patterns, and access controls.
Prioritize security recommendations by severity.`,

  copilot: `You are a general-purpose AI copilot for MAP Nexus™.
Assist users with any platform-related questions or tasks.
Adapt your responses based on the current portal context.`
};

export const DEFAULT_AI_CONFIGURATION: AIConfiguration = {
  provider: 'openai',
  model: {
    modelId: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopSequences: []
  },
  moduleDefaults: {},
  safetyPolicies: [
    {
      id: 'default-safety',
      name: 'Default Safety Policy',
      enabled: true,
      rules: [
        { type: 'content-filter', config: { enabled: true } },
        { type: 'pii-detection', config: { enabled: true } },
        { type: 'rate-limit', config: { enabled: true, maxRequestsPerMinute: 60 } }
      ]
    }
  ],
  promptTemplates: [],
  rateLimits: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    tokensPerMinute: 100000,
    tokensPerDay: 2000000
  },
  retryPolicy: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
    maxDelay: 30000
  },
  systemPrompts: DEFAULT_SYSTEM_PROMPTS,
  features: {
    streaming: true,
    citations: true,
    suggestions: true,
    audit: true,
    usageTracking: true
  }
};

export class AIConfigurationManager {
  private config: AIConfiguration;

  constructor(config: AIConfiguration = DEFAULT_AI_CONFIGURATION) {
    this.config = { ...config };
  }

  getConfiguration(): AIConfiguration {
    return JSON.parse(JSON.stringify(this.config));
  }

  updateConfiguration(updates: Partial<AIConfiguration>): void {
    this.config = { ...this.config, ...updates };
  }

  setProvider(provider: AIProviderType): void {
    this.config.provider = provider;
  }

  setModel(model: AIModelConfig): void {
    this.config.model = { ...model };
  }

  getSystemPrompt(module: AIModuleType): string {
    return this.config.systemPrompts[module] ?? this.config.systemPrompts.general;
  }

  setSystemPrompt(module: AIModuleType, prompt: string): void {
    this.config.systemPrompts[module] = prompt;
  }

  addPromptTemplate(template: AIPromptTemplateConfig): void {
    const existing = this.config.promptTemplates.findIndex(t => t.id === template.id);
    if (existing >= 0) {
      this.config.promptTemplates[existing] = template;
    } else {
      this.config.promptTemplates.push(template);
    }
  }

  removePromptTemplate(id: string): void {
    this.config.promptTemplates = this.config.promptTemplates.filter(t => t.id !== id);
  }

  isFeatureEnabled(feature: keyof AIConfiguration['features']): boolean {
    return this.config.features[feature];
  }
}
