export type AIAuditEventType = 'request' | 'response' | 'error' | 'safety' | 'config' | 'auth';

export type AIAuditSeverity = 'info' | 'warn' | 'error' | 'critical';

export interface AIAuditEntry {
  id: string;
  eventId: string;
  eventType: AIAuditEventType;
  severity: AIAuditSeverity;
  timestamp: Date;
  userId: string;
  tenantId: string;
  module: string;
  action: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  model?: string;
  provider?: string;
  executionTimeMs?: number;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  status: 'success' | 'failure' | 'partial';
}

export interface AIAuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  tenantId?: string;
  module?: string;
  eventType?: AIAuditEventType;
  severity?: AIAuditSeverity;
  limit?: number;
  offset?: number;
}

export class AIAuditLogger {
  private entries: AIAuditEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 10000) {
    this.maxEntries = maxEntries;
  }

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  log(entry: Omit<AIAuditEntry, 'id' | 'timestamp'>): AIAuditEntry {
    const auditEntry: AIAuditEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date()
    };

    this.entries.push(auditEntry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    return auditEntry;
  }

  logRequest(params: {
    userId: string;
    tenantId: string;
    module: string;
    action: string;
    requestId: string;
    model?: string;
    provider?: string;
    details?: Record<string, unknown>;
  }): AIAuditEntry {
    return this.log({
      eventId: this.generateId(),
      eventType: 'request',
      severity: 'info',
      userId: params.userId,
      tenantId: params.tenantId,
      module: params.module,
      action: params.action,
      details: params.details ?? {},
      requestId: params.requestId,
      model: params.model,
      provider: params.provider,
      status: 'success'
    });
  }

  logResponse(params: {
    userId: string;
    tenantId: string;
    module: string;
    action: string;
    requestId: string;
    model: string;
    provider: string;
    executionTimeMs: number;
    tokenUsage: { prompt: number; completion: number; total: number };
    status: 'success' | 'failure' | 'partial';
    details?: Record<string, unknown>;
  }): AIAuditEntry {
    return this.log({
      eventId: this.generateId(),
      eventType: 'response',
      severity: params.status === 'failure' ? 'error' : 'info',
      userId: params.userId,
      tenantId: params.tenantId,
      module: params.module,
      action: params.action,
      details: params.details ?? {},
      requestId: params.requestId,
      model: params.model,
      provider: params.provider,
      executionTimeMs: params.executionTimeMs,
      tokenUsage: params.tokenUsage,
      status: params.status
    });
  }

  logError(params: {
    userId: string;
    tenantId: string;
    module: string;
    action: string;
    requestId?: string;
    error: string;
    severity?: AIAuditSeverity;
    details?: Record<string, unknown>;
  }): AIAuditEntry {
    return this.log({
      eventId: this.generateId(),
      eventType: 'error',
      severity: params.severity ?? 'error',
      userId: params.userId,
      tenantId: params.tenantId,
      module: params.module,
      action: params.action,
      details: { ...params.details, error: params.error },
      requestId: params.requestId,
      status: 'failure'
    });
  }

  query(query: AIAuditQuery): AIAuditEntry[] {
    let results = [...this.entries];

    if (query.startDate) {
      results = results.filter(e => e.timestamp >= query.startDate!);
    }
    if (query.endDate) {
      results = results.filter(e => e.timestamp <= query.endDate!);
    }
    if (query.userId) {
      results = results.filter(e => e.userId === query.userId);
    }
    if (query.tenantId) {
      results = results.filter(e => e.tenantId === query.tenantId);
    }
    if (query.module) {
      results = results.filter(e => e.module === query.module);
    }
    if (query.eventType) {
      results = results.filter(e => e.eventType === query.eventType);
    }
    if (query.severity) {
      results = results.filter(e => e.severity === query.severity);
    }

    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const offset = query.offset ?? 0;
    const limit = query.limit ?? 100;
    return results.slice(offset, offset + limit);
  }

  getEntries(limit: number = 100): AIAuditEntry[] {
    return this.entries.slice(-limit).reverse();
  }

  clear(): void {
    this.entries = [];
  }

  getCount(): number {
    return this.entries.length;
  }
}

export const aiAuditLogger = new AIAuditLogger();
