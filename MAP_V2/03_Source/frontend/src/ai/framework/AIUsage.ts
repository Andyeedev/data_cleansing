export interface AIUsageEntry {
  id: string;
  timestamp: Date;
  userId: string;
  tenantId: string;
  module: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  requestId: string;
  status: 'success' | 'failure';
}

export interface AIUsageSummary {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  byModel: Record<string, { requests: number; tokens: number; cost: number }>;
  byModule: Record<string, { requests: number; tokens: number; cost: number }>;
  byDay: Record<string, { requests: number; tokens: number; cost: number }>;
}

export class AIUsageTracker {
  private entries: AIUsageEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 50000) {
    this.maxEntries = maxEntries;
  }

  private generateId(): string {
    return `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  track(entry: Omit<AIUsageEntry, 'id' | 'timestamp'>): AIUsageEntry {
    const usageEntry: AIUsageEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.entries.push(usageEntry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    return usageEntry;
  }

  trackRequest(params: {
    userId: string;
    tenantId: string;
    module: string;
    model: string;
    provider: string;
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
    requestId: string;
    status: 'success' | 'failure';
  }): AIUsageEntry {
    return this.track({
      ...params,
      totalTokens: params.promptTokens + params.completionTokens
    });
  }

  getSummary(params?: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    tenantId?: string;
    module?: string;
  }): AIUsageSummary {
    let filtered = [...this.entries];

    if (params?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= params.endDate!);
    }
    if (params?.userId) {
      filtered = filtered.filter(e => e.userId === params.userId);
    }
    if (params?.tenantId) {
      filtered = filtered.filter(e => e.tenantId === params.tenantId);
    }
    if (params?.module) {
      filtered = filtered.filter(e => e.module === params.module);
    }

    const summary: AIUsageSummary = {
      totalRequests: filtered.length,
      totalTokens: 0,
      totalCost: 0,
      byModel: {},
      byModule: {},
      byDay: {}
    };

    for (const entry of filtered) {
      summary.totalTokens += entry.totalTokens;
      summary.totalCost += entry.estimatedCost;

      if (!summary.byModel[entry.model]) {
        summary.byModel[entry.model] = { requests: 0, tokens: 0, cost: 0 };
      }
      summary.byModel[entry.model].requests++;
      summary.byModel[entry.model].tokens += entry.totalTokens;
      summary.byModel[entry.model].cost += entry.estimatedCost;

      if (!summary.byModule[entry.module]) {
        summary.byModule[entry.module] = { requests: 0, tokens: 0, cost: 0 };
      }
      summary.byModule[entry.module].requests++;
      summary.byModule[entry.module].tokens += entry.totalTokens;
      summary.byModule[entry.module].cost += entry.estimatedCost;

      const dayKey = entry.timestamp.toISOString().split('T')[0];
      if (!summary.byDay[dayKey]) {
        summary.byDay[dayKey] = { requests: 0, tokens: 0, cost: 0 };
      }
      summary.byDay[dayKey].requests++;
      summary.byDay[dayKey].tokens += entry.totalTokens;
      summary.byDay[dayKey].cost += entry.estimatedCost;
    }

    return summary;
  }

  getEntries(params?: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    tenantId?: string;
    module?: string;
    limit?: number;
    offset?: number;
  }): AIUsageEntry[] {
    let filtered = [...this.entries];

    if (params?.startDate) {
      filtered = filtered.filter(e => e.timestamp >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter(e => e.timestamp <= params.endDate!);
    }
    if (params?.userId) {
      filtered = filtered.filter(e => e.userId === params.userId);
    }
    if (params?.tenantId) {
      filtered = filtered.filter(e => e.tenantId === params.tenantId);
    }
    if (params?.module) {
      filtered = filtered.filter(e => e.module === params.module);
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 100;
    return filtered.slice(offset, offset + limit);
  }

  clear(): void {
    this.entries = [];
  }

  getCount(): number {
    return this.entries.length;
  }
}

export const aiUsageTracker = new AIUsageTracker();
