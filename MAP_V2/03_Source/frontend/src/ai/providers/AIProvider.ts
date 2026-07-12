import type { AIProviderType, AIModelConfig } from '../types/AIModels';
import type { AIRequest, AIStreamChunk } from '../types/AIRequests';

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey?: string;
  baseUrl?: string;
  organizationId?: string;
  projectId?: string;
  models: AIModelConfig[];
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface AIProviderResponse {
  id: string;
  content: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  latencyMs: number;
}

export interface AIProviderError {
  code: string;
  message: string;
  retryable: boolean;
  statusCode?: number;
}

export abstract class AIProvider {
  protected config: AIProviderConfig;
  protected isInitialized = false;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract initialize(): Promise<void>;
  abstract complete(request: AIRequest): Promise<AIProviderResponse>;
  abstract stream(request: AIRequest): AsyncGenerator<AIStreamChunk>;
  abstract validate(): Promise<boolean>;
  abstract getAvailableModels(): string[];

  getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  getType(): AIProviderType {
    return this.config.type;
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export class AIProviderAdapter {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private activeProvider: AIProviderType = 'openai';

  registerProvider(type: AIProviderType, provider: AIProvider): void {
    this.providers.set(type, provider);
  }

  unregisterProvider(type: AIProviderType): void {
    this.providers.delete(type);
  }

  setActiveProvider(type: AIProviderType): void {
    if (!this.providers.has(type)) {
      throw new Error(`Provider ${type} not registered`);
    }
    this.activeProvider = type;
  }

  getActiveProvider(): AIProvider | undefined {
    return this.providers.get(this.activeProvider);
  }

  getProvider(type: AIProviderType): AIProvider | undefined {
    return this.providers.get(type);
  }

  getRegisteredProviders(): AIProviderType[] {
    return Array.from(this.providers.keys());
  }

  async complete(request: AIRequest): Promise<AIProviderResponse> {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`No active provider: ${this.activeProvider}`);
    }
    return provider.complete(request);
  }

  async *stream(request: AIRequest): AsyncGenerator<AIStreamChunk> {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`No active provider: ${this.activeProvider}`);
    }
    yield* provider.stream(request);
  }
}
