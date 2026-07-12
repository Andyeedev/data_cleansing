import type { AIRequest, AIRequestResponse, AIRequestContext } from '../types/AIRequests';
import type { AIProviderResponse } from '../providers/AIProvider';
import { AIProviderAdapter } from '../providers/AIProvider';
import type { AIConfiguration } from './AIConfiguration';

export interface AIPipelineStep {
  name: string;
  execute: (input: AIPipelineInput) => Promise<AIPipelineInput>;
}

export interface AIPipelineInput {
  request: AIRequest;
  context: AIRequestContext;
  systemPrompt: string;
  userPrompt: string;
  providerResponse?: AIProviderResponse;
  parsedResponse?: AIRequestResponse;
  validated: boolean;
  errors: string[];
}

export class AIPipeline {
  private providerAdapter: AIProviderAdapter;
  private config: AIConfiguration;
  private steps: AIPipelineStep[] = [];

  constructor(providerAdapter: AIProviderAdapter, config: AIConfiguration) {
    this.providerAdapter = providerAdapter;
    this.config = config;
    this.initializeSteps();
  }

  private initializeSteps(): void {
    this.steps = [
      {
        name: 'context-builder',
        execute: async (input) => this.buildContext(input)
      },
      {
        name: 'prompt-builder',
        execute: async (input) => this.buildPrompt(input)
      },
      {
        name: 'provider-adapter',
        execute: async (input) => this.callProvider(input)
      },
      {
        name: 'response-parser',
        execute: async (input) => this.parseResponse(input)
      },
      {
        name: 'safety-validator',
        execute: async (input) => this.validateSafety(input)
      }
    ];
  }

  private async buildContext(input: AIPipelineInput): Promise<AIPipelineInput> {
    return input;
  }

  private async buildPrompt(input: AIPipelineInput): Promise<AIPipelineInput> {
    const moduleSystemPrompt = this.config.systemPrompts[input.request.module] ?? this.config.systemPrompts.general;
    return {
      ...input,
      systemPrompt: `${moduleSystemPrompt}\n\n${input.systemPrompt}`
    };
  }

  private async callProvider(input: AIPipelineInput): Promise<AIPipelineInput> {
    try {
      const providerResponse = await this.providerAdapter.complete(input.request);
      return { ...input, providerResponse };
    } catch (error) {
      return {
        ...input,
        errors: [...input.errors, `Provider error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  private async parseResponse(input: AIPipelineInput): Promise<AIPipelineInput> {
    if (!input.providerResponse) {
      return input;
    }

    const response: AIRequestResponse = {
      id: `resp-${Date.now()}`,
      requestId: input.request.id,
      content: input.providerResponse.content,
      finishReason: input.providerResponse.finishReason,
      usage: {
        promptTokens: input.providerResponse.usage.promptTokens,
        completionTokens: input.providerResponse.usage.completionTokens,
        totalTokens: input.providerResponse.usage.totalTokens,
        estimatedCost: this.calculateCost(
          input.providerResponse.usage.promptTokens,
          input.providerResponse.usage.completionTokens
        )
      },
      model: input.providerResponse.model,
      provider: input.request.module,
      latencyMs: input.providerResponse.latencyMs,
      metadata: {}
    };

    return { ...input, parsedResponse: response };
  }

  private async validateSafety(input: AIPipelineInput): Promise<AIPipelineInput> {
    return { ...input, validated: true };
  }

  private calculateCost(promptTokens: number, completionTokens: number): number {
    const model = this.config.model;
    const modelInfo = this.getModelInfo(model.modelId);
    if (!modelInfo) return 0;
    return (promptTokens * modelInfo.costPer1kInputTokens + completionTokens * modelInfo.costPer1kOutputTokens) / 1000;
  }

  private getModelInfo(modelId: string): { costPer1kInputTokens: number; costPer1kOutputTokens: number } | null {
    const models: Record<string, { costPer1kInputTokens: number; costPer1kOutputTokens: number }> = {
      'gpt-4o': { costPer1kInputTokens: 0.005, costPer1kOutputTokens: 0.015 },
      'gpt-4o-mini': { costPer1kInputTokens: 0.00015, costPer1kOutputTokens: 0.0006 },
      'claude-sonnet-4-20250514': { costPer1kInputTokens: 0.003, costPer1kOutputTokens: 0.015 },
      'claude-haiku-35-20241022': { costPer1kInputTokens: 0.001, costPer1kOutputTokens: 0.005 }
    };
    return models[modelId] ?? null;
  }

  async process(request: AIRequest): Promise<AIRequestResponse> {
    const context = this.buildRequestContext(request);

    let input: AIPipelineInput = {
      request,
      context,
      systemPrompt: this.config.systemPrompts[request.module] ?? this.config.systemPrompts.general,
      userPrompt: request.prompt,
      validated: false,
      errors: []
    };

    for (const step of this.steps) {
      input = await step.execute(input);
    }

    if (input.parsedResponse) {
      return input.parsedResponse;
    }

    return {
      id: `resp-${Date.now()}`,
      requestId: request.id,
      content: 'Unable to process request',
      finishReason: 'error',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
      model: 'none',
      provider: 'none',
      latencyMs: 0,
      metadata: { errors: input.errors }
    };
  }

  private buildRequestContext(request: AIRequest): AIRequestContext {
    return request.context;
  }
}
