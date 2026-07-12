import { getAIEngine } from '../framework/AIEngine';
import type { AIRequest, AIRequestResponse, AIModuleType } from '../types/AIRequests';

export interface AIServiceParams {
  prompt: string;
  module: AIModuleType;
  userId: string;
  tenantId: string;
  portal: string;
  report?: string;
  dataset?: string;
  sessionId: string;
}

export class AIService {
  private engine = getAIEngine();

  async chat(params: AIServiceParams): Promise<AIRequestResponse> {
    const request: AIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'chat',
      module: params.module,
      prompt: params.prompt,
      context: {
        portal: params.portal,
        report: params.report,
        dataset: params.dataset,
        sessionId: params.sessionId,
        conversationHistory: [],
        permissions: [],
        preferences: {}
      },
      priority: 'medium',
      metadata: {},
      timestamp: new Date(),
      userId: params.userId,
      tenantId: params.tenantId
    };

    return this.engine.processRequest(request);
  }

  async summarize(params: AIServiceParams & { summaryType?: string }): Promise<AIRequestResponse> {
    const request: AIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'completion',
      module: params.module,
      prompt: `Provide a ${params.summaryType ?? 'general'} summary:\n\n${params.prompt}`,
      context: {
        portal: params.portal,
        report: params.report,
        dataset: params.dataset,
        sessionId: params.sessionId,
        conversationHistory: [],
        permissions: [],
        preferences: {}
      },
      priority: 'medium',
      metadata: { summaryType: params.summaryType },
      timestamp: new Date(),
      userId: params.userId,
      tenantId: params.tenantId
    };

    return this.engine.processRequest(request);
  }

  async explain(params: AIServiceParams): Promise<AIRequestResponse> {
    const request: AIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'completion',
      module: params.module,
      prompt: `Explain the following in detail:\n\n${params.prompt}`,
      context: {
        portal: params.portal,
        report: params.report,
        dataset: params.dataset,
        sessionId: params.sessionId,
        conversationHistory: [],
        permissions: [],
        preferences: {}
      },
      priority: 'medium',
      metadata: { task: 'explain' },
      timestamp: new Date(),
      userId: params.userId,
      tenantId: params.tenantId
    };

    return this.engine.processRequest(request);
  }

  async recommend(params: AIServiceParams): Promise<AIRequestResponse> {
    const request: AIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'completion',
      module: params.module,
      prompt: `Provide actionable recommendations for:\n\n${params.prompt}`,
      context: {
        portal: params.portal,
        report: params.report,
        dataset: params.dataset,
        sessionId: params.sessionId,
        conversationHistory: [],
        permissions: [],
        preferences: {}
      },
      priority: 'high',
      metadata: { task: 'recommend' },
      timestamp: new Date(),
      userId: params.userId,
      tenantId: params.tenantId
    };

    return this.engine.processRequest(request);
  }
}

export const aiService = new AIService();
