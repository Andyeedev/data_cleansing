import type { PortalDefinition, PortalMetadata } from '../types/PortalDefinition';
import { allPortals } from '../metadata/PortalMetadata';

class PortalRegistryClass {
  private registry: Map<string, PortalMetadata> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    allPortals.forEach((portal) => {
      this.register(portal);
    });
  }

  register(definition: PortalDefinition): void {
    const existing = this.registry.get(definition.id);
    const metadata: PortalMetadata = {
      definition,
      registeredAt: existing?.registeredAt || new Date(),
      updatedAt: new Date(),
      lastAccessedAt: existing?.lastAccessedAt,
      accessCount: existing?.accessCount || 0,
    };
    this.registry.set(definition.id, metadata);
  }

  unregister(id: string): void {
    this.registry.delete(id);
  }

  get(id: string): PortalDefinition | undefined {
    const metadata = this.registry.get(id);
    return metadata?.definition;
  }

  getMetadata(id: string): PortalMetadata | undefined {
    return this.registry.get(id);
  }

  getAll(): PortalDefinition[] {
    return Array.from(this.registry.values()).map((m) => m.definition);
  }

  getAllMetadata(): PortalMetadata[] {
    return Array.from(this.registry.values());
  }

  getByCategory(category: PortalDefinition['category']): PortalDefinition[] {
    return this.getAll().filter((p) => p.category === category);
  }

  getEnabled(): PortalDefinition[] {
    return this.getAll().filter((p) => p.enabled && p.status === 'active');
  }

  getByRoute(route: string): PortalDefinition | undefined {
    return this.getAll().find(
      (p) => route.startsWith(p.route) || p.route === route
    );
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  recordAccess(id: string): void {
    const metadata = this.registry.get(id);
    if (metadata) {
      metadata.lastAccessedAt = new Date();
      metadata.accessCount += 1;
      this.registry.set(id, metadata);
    }
  }

  getRecentlyVisited(limit: number = 5): PortalDefinition[] {
    return Array.from(this.registry.values())
      .filter((m) => m.lastAccessedAt)
      .sort((a, b) => (b.lastAccessedAt?.getTime() || 0) - (a.lastAccessedAt?.getTime() || 0))
      .slice(0, limit)
      .map((m) => m.definition);
  }

  search(query: string): PortalDefinition[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.id.toLowerCase().includes(lower)
    );
  }

  getAllIds(): string[] {
    return Array.from(this.registry.keys());
  }

  clear(): void {
    this.registry.clear();
  }
}

export const PortalRegistry = new PortalRegistryClass();
