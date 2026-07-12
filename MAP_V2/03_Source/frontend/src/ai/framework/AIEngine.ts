import type { AIRequest, AIRequestResponse, AIModuleType } from '../types/AIRequests';
import { AIProviderAdapter } from '../providers/AIProvider';
import { AIPipeline } from './AIPipeline';
import { AIConfigurationManager } from './AIConfiguration';
import { AIRegistry, createDefaultRegistry } from './AIRegistry';
import { AIAuditLogger } from './AIAudit';
import { AIUsageTracker } from './AIUsage';
import { AIQuotaManager } from './AIQuota';

export interface AIEngineConfig {
  enableAudit: boolean;
  enableUsageTracking: boolean;
  enableQuotaManagement: boolean;
}

const DEFAULT_ENGINE_CONFIG: AIEngineConfig = {
  enableAudit: true,
  enableUsageTracking: true,
  enableQuotaManagement: true
};

export class AIEngine {
  private providerAdapter: AIProviderAdapter;
  private pipeline: AIPipeline;
  private configManager: AIConfigurationManager;
  private registry: AIRegistry;
  private auditLogger: AIAuditLogger;
  private usageTracker: AIUsageTracker;
  private quotaManager: AIQuotaManager;
  private engineConfig: AIEngineConfig;

  constructor(config?: Partial<AIEngineConfig>) {
    this.engineConfig = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.providerAdapter = new AIProviderAdapter();
    this.configManager = new AIConfigurationManager();
    this.pipeline = new AIPipeline(this.providerAdapter, this.configManager.getConfiguration());
    this.registry = createDefaultRegistry();
    this.auditLogger = new AIAuditLogger();
    this.usageTracker = new AIUsageTracker();
    this.quotaManager = new AIQuotaManager();
  }

  async processRequest(request: AIRequest): Promise<AIRequestResponse> {
    const requestId = request.id;
    const startTime = Date.now();

    if (this.engineConfig.enableQuotaManagement && !this.quotaManager.canMakeRequest()) {
      const error = {
        id: `err-${Date.now()}`,
        requestId,
        code: 'QUOTA_EXCEEDED',
        message: 'Request quota exceeded',
        retryable: true
      };
      throw new Error(error.message);
    }

    if (this.engineConfig.enableAudit) {
      this.auditLogger.logRequest({
        userId: request.userId,
        tenantId: request.tenantId,
        module: request.module,
        action: 'process-request',
        requestId,
        model: request.modelConfig?.modelId,
        provider: this.providerAdapter.getActiveProvider()?.getType()
      });
    }

    try {
      const response = await this.pipeline.process(request);

      if (this.engineConfig.enableUsageTracking) {
        this.usageTracker.trackRequest({
          userId: request.userId,
          tenantId: request.tenantId,
          module: request.module,
          model: response.model,
          provider: response.provider,
          promptTokens: response.usage.promptTokens,
          completionTokens: response.usage.completionTokens,
          estimatedCost: response.usage.estimatedCost,
          requestId,
          status: 'success'
        });
      }

      if (this.engineConfig.enableQuotaManagement) {
        this.quotaManager.recordRequest(response.usage.totalTokens, response.usage.estimatedCost);
      }

      if (this.engineConfig.enableAudit) {
        this.auditLogger.logResponse({
          userId: request.userId,
          tenantId: request.tenantId,
          module: request.module,
          action: 'process-request',
          requestId,
          model: response.model,
          provider: response.provider,
          executionTimeMs: Date.now() - startTime,
          tokenUsage: {
            prompt: response.usage.promptTokens,
            completion: response.usage.completionTokens,
            total: response.usage.totalTokens
          },
          status: 'success'
        });
      }

      this.registry.updateLastActive(request.module);

      return response;
    } catch (error) {
      if (this.engineConfig.enableAudit) {
        this.auditLogger.logError({
          userId: request.userId,
          tenantId: request.tenantId,
          module: request.module,
          action: 'process-request',
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error',
          details: { executionTimeMs: Date.now() - startTime }
        });
      }

      throw error;
    }
  }

  getProviderAdapter(): AIProviderAdapter {
    return this.providerAdapter;
  }

  getConfigManager(): AIConfigurationManager {
    return this.configManager;
  }

  getRegistry(): AIRegistry {
    return this.registry;
  }

  getAuditLogger(): AIAuditLogger {
    return this.auditLogger;
  }

  getUsageTracker(): AIUsageTracker {
    return this.usageTracker;
  }

  getQuotaManager(): AIQuotaManager {
    return this.quotaManager;
  }

  isModuleEnabled(module: AIModuleType): boolean {
    return this.registry.isEnabled(module);
  }
}

let defaultEngine: AIEngine | null = null;

export const getAIEngine = (): AIEngine => {
  if (!defaultEngine) {
    defaultEngine = new AIEngine();
  }
  return defaultEngine;
};

export const createAIEngine = (config?: Partial<AIEngineConfig>): AIEngine => {
  return new AIEngine(config);
};
