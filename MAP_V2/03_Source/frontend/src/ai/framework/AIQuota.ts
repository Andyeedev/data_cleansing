export interface AIQuotaConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  tokensPerMinute: number;
  tokensPerHour: number;
  tokensPerDay: number;
  costPerDay: number;
  costPerMonth: number;
}

export interface AIQuotaUsage {
  requestsLastMinute: number;
  requestsLastHour: number;
  requestsLastDay: number;
  tokensLastMinute: number;
  tokensLastHour: number;
  tokensLastDay: number;
  costToday: number;
  costThisMonth: number;
}

export interface AIQuotaStatus {
  withinLimits: boolean;
  limits: AIQuotaConfig;
  usage: AIQuotaUsage;
  exceededLimits: string[];
  warnings: string[];
}

export class AIQuotaManager {
  private config: AIQuotaConfig;
  private requestTimestamps: Date[] = [];
  private tokenTimestamps: { timestamp: Date; tokens: number; cost: number }[] = [];

  constructor(config?: Partial<AIQuotaConfig>) {
    this.config = {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      tokensPerMinute: 100000,
      tokensPerHour: 2000000,
      tokensPerDay: 10000000,
      costPerDay: 100,
      costPerMonth: 2000,
      ...config
    };
  }

  private cleanupOldEntries(): void {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.requestTimestamps = this.requestTimestamps.filter(t => t > oneDayAgo);
    this.tokenTimestamps = this.tokenTimestamps.filter(t => t.timestamp > oneDayAgo);
  }

  checkQuota(): AIQuotaStatus {
    this.cleanupOldEntries();

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const requestsLastMinute = this.requestTimestamps.filter(t => t > oneMinuteAgo).length;
    const requestsLastHour = this.requestTimestamps.filter(t => t > oneHourAgo).length;
    const requestsLastDay = this.requestTimestamps.filter(t => t > oneDayAgo).length;

    const tokensLastMinute = this.tokenTimestamps
      .filter(t => t.timestamp > oneMinuteAgo)
      .reduce((sum, t) => sum + t.tokens, 0);
    const tokensLastHour = this.tokenTimestamps
      .filter(t => t.timestamp > oneHourAgo)
      .reduce((sum, t) => sum + t.tokens, 0);
    const tokensLastDay = this.tokenTimestamps
      .filter(t => t.timestamp > oneDayAgo)
      .reduce((sum, t) => sum + t.tokens, 0);

    const costToday = this.tokenTimestamps
      .filter(t => t.timestamp > oneDayAgo)
      .reduce((sum, t) => sum + t.cost, 0);
    const costThisMonth = this.tokenTimestamps
      .filter(t => t.timestamp > startOfMonth)
      .reduce((sum, t) => sum + t.cost, 0);

    const usage: AIQuotaUsage = {
      requestsLastMinute,
      requestsLastHour,
      requestsLastDay,
      tokensLastMinute,
      tokensLastHour,
      tokensLastDay,
      costToday,
      costThisMonth
    };

    const exceededLimits: string[] = [];
    const warnings: string[] = [];

    if (requestsLastMinute >= this.config.requestsPerMinute) {
      exceededLimits.push('requestsPerMinute');
    } else if (requestsLastMinute >= this.config.requestsPerMinute * 0.8) {
      warnings.push('requestsPerMinute');
    }

    if (requestsLastHour >= this.config.requestsPerHour) {
      exceededLimits.push('requestsPerHour');
    } else if (requestsLastHour >= this.config.requestsPerHour * 0.8) {
      warnings.push('requestsPerHour');
    }

    if (requestsLastDay >= this.config.requestsPerDay) {
      exceededLimits.push('requestsPerDay');
    } else if (requestsLastDay >= this.config.requestsPerDay * 0.8) {
      warnings.push('requestsPerDay');
    }

    if (tokensLastMinute >= this.config.tokensPerMinute) {
      exceededLimits.push('tokensPerMinute');
    } else if (tokensLastMinute >= this.config.tokensPerMinute * 0.8) {
      warnings.push('tokensPerMinute');
    }

    if (tokensLastHour >= this.config.tokensPerHour) {
      exceededLimits.push('tokensPerHour');
    } else if (tokensLastHour >= this.config.tokensPerHour * 0.8) {
      warnings.push('tokensPerHour');
    }

    if (tokensLastDay >= this.config.tokensPerDay) {
      exceededLimits.push('tokensPerDay');
    } else if (tokensLastDay >= this.config.tokensPerDay * 0.8) {
      warnings.push('tokensPerDay');
    }

    if (costToday >= this.config.costPerDay) {
      exceededLimits.push('costPerDay');
    } else if (costToday >= this.config.costPerDay * 0.8) {
      warnings.push('costPerDay');
    }

    if (costThisMonth >= this.config.costPerMonth) {
      exceededLimits.push('costPerMonth');
    } else if (costThisMonth >= this.config.costPerMonth * 0.8) {
      warnings.push('costPerMonth');
    }

    return {
      withinLimits: exceededLimits.length === 0,
      limits: { ...this.config },
      usage,
      exceededLimits,
      warnings
    };
  }

  recordRequest(tokens: number, cost: number): void {
    const now = new Date();
    this.requestTimestamps.push(now);
    this.tokenTimestamps.push({ timestamp: now, tokens, cost });
  }

  canMakeRequest(): boolean {
    const status = this.checkQuota();
    return status.withinLimits;
  }

  getUsage(): AIQuotaUsage {
    return this.checkQuota().usage;
  }

  updateConfig(config: Partial<AIQuotaConfig>): void {
    this.config = { ...this.config, ...config };
  }

  reset(): void {
    this.requestTimestamps = [];
    this.tokenTimestamps = [];
  }
}

export const aiQuotaManager = new AIQuotaManager();
