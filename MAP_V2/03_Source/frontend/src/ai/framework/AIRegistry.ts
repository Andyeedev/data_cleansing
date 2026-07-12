import type { AIModuleType } from '../types/AIRequests';

export interface AIModuleRegistration {
  id: string;
  module: AIModuleType;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  capabilities: string[];
  promptTemplates: string[];
  permissions: string[];
  metadata: Record<string, unknown>;
}

export interface AIRegistryEntry {
  module: AIModuleType;
  registration: AIModuleRegistration;
  registeredAt: Date;
  lastActiveAt?: Date;
}

export class AIRegistry {
  private registrations: Map<AIModuleType, AIRegistryEntry> = new Map();

  register(registration: AIModuleRegistration): void {
    const existing = this.registrations.get(registration.module);
    if (existing) {
      existing.registration = registration;
      existing.registeredAt = new Date();
    } else {
      this.registrations.set(registration.module, {
        module: registration.module,
        registration,
        registeredAt: new Date()
      });
    }
  }

  unregister(module: AIModuleType): void {
    this.registrations.delete(module);
  }

  get(module: AIModuleType): AIRegistryEntry | undefined {
    return this.registrations.get(module);
  }

  getEnabled(): AIRegistryEntry[] {
    return Array.from(this.registrations.values())
      .filter(entry => entry.registration.enabled);
  }

  getByCapability(capability: string): AIRegistryEntry[] {
    return Array.from(this.registrations.values())
      .filter(entry => entry.registration.capabilities.includes(capability));
  }

  getAll(): AIRegistryEntry[] {
    return Array.from(this.registrations.values());
  }

  isRegistered(module: AIModuleType): boolean {
    return this.registrations.has(module);
  }

  isEnabled(module: AIModuleType): boolean {
    const entry = this.registrations.get(module);
    return entry?.registration.enabled ?? false;
  }

  updateLastActive(module: AIModuleType): void {
    const entry = this.registrations.get(module);
    if (entry) {
      entry.lastActiveAt = new Date();
    }
  }
}

export const DEFAULT_MODULE_REGISTRATIONS: AIModuleRegistration[] = [
  {
    id: 'executive-ai',
    module: 'executive',
    name: 'Executive AI',
    description: 'AI capabilities for executive insights and reporting',
    version: '1.0.0',
    enabled: true,
    capabilities: ['summary', 'insight', 'recommendation', 'trend'],
    promptTemplates: ['executive-summary', 'risk-assessment', 'kpi-analysis'],
    permissions: ['executive:read', 'executive:ai'],
    metadata: {}
  },
  {
    id: 'operations-ai',
    module: 'operations',
    name: 'Operations AI',
    description: 'AI capabilities for operational monitoring and analysis',
    version: '1.0.0',
    enabled: true,
    capabilities: ['monitoring', 'alerting', 'optimization', 'diagnosis'],
    promptTemplates: ['operations-status', 'queue-analysis', 'failure-diagnosis'],
    permissions: ['operations:read', 'operations:ai'],
    metadata: {}
  },
  {
    id: 'migration-ai',
    module: 'migration',
    name: 'Migration AI',
    description: 'AI capabilities for migration analysis and recommendations',
    version: '1.0.0',
    enabled: true,
    capabilities: ['analysis', 'recommendation', 'prediction', 'validation'],
    promptTemplates: ['migration-summary', 'progress-analysis', 'risk-prediction'],
    permissions: ['migration:read', 'migration:ai'],
    metadata: {}
  },
  {
    id: 'validation-ai',
    module: 'validation',
    name: 'Validation AI',
    description: 'AI capabilities for data validation insights',
    version: '1.0.0',
    enabled: true,
    capabilities: ['analysis', 'pattern-detection', 'anomaly-detection', 'recommendation'],
    promptTemplates: ['validation-summary', 'error-analysis', 'pattern-detection'],
    permissions: ['validation:read', 'validation:ai'],
    metadata: {}
  },
  {
    id: 'governance-ai',
    module: 'governance',
    name: 'Governance AI',
    description: 'AI capabilities for governance and compliance',
    version: '1.0.0',
    enabled: true,
    capabilities: ['compliance', 'audit', 'policy', 'risk'],
    promptTemplates: ['compliance-review', 'audit-summary', 'policy-analysis'],
    permissions: ['governance:read', 'governance:ai'],
    metadata: {}
  },
  {
    id: 'reporting-ai',
    module: 'reporting',
    name: 'Reporting AI',
    description: 'AI capabilities for report generation and interpretation',
    version: '1.0.0',
    enabled: true,
    capabilities: ['narrative', 'chart', 'summary', 'interpretation'],
    promptTemplates: ['report-narrative', 'data-story', 'trend-explanation'],
    permissions: ['reporting:read', 'reporting:ai'],
    metadata: {}
  },
  {
    id: 'security-ai',
    module: 'security',
    name: 'Security AI',
    description: 'AI capabilities for security monitoring and threat analysis',
    version: '1.0.0',
    enabled: true,
    capabilities: ['threat-detection', 'anomaly', 'compliance', 'recommendation'],
    promptTemplates: ['security-events', 'threat-analysis', 'access-review'],
    permissions: ['security:read', 'security:ai'],
    metadata: {}
  },
  {
    id: 'administration-ai',
    module: 'administration',
    name: 'Administration AI',
    description: 'AI capabilities for platform administration',
    version: '1.0.0',
    enabled: true,
    capabilities: ['configuration', 'optimization', 'health', 'recommendation'],
    promptTemplates: ['system-health', 'config-analysis', 'optimization-suggestions'],
    permissions: ['admin:read', 'admin:ai'],
    metadata: {}
  },
  {
    id: 'copilot-ai',
    module: 'copilot',
    name: 'Copilot AI',
    description: 'General-purpose AI copilot assistance',
    version: '1.0.0',
    enabled: true,
    capabilities: ['chat', 'search', 'navigation', 'help', 'command'],
    promptTemplates: ['general-assistant', 'natural-language-query', 'help-response'],
    permissions: ['*'],
    metadata: {}
  }
];

export const createDefaultRegistry = (): AIRegistry => {
  const registry = new AIRegistry();
  DEFAULT_MODULE_REGISTRATIONS.forEach(reg => registry.register(reg));
  return registry;
};
