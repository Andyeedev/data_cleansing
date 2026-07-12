import type { HtmlReportType, HtmlReportTemplate, HtmlReportSectionConfig } from '../shared/ReportTypes';

interface ReportRegistryEntry {
  template: HtmlReportTemplate;
  registeredAt: string;
}

class ReportRegistryClass {
  private registry = new Map<string, ReportRegistryEntry>();

  register(template: HtmlReportTemplate): void {
    this.registry.set(template.id, {
      template,
      registeredAt: new Date().toISOString(),
    });
  }

  unregister(id: string): boolean {
    return this.registry.delete(id);
  }

  get(id: string): HtmlReportTemplate | undefined {
    return this.registry.get(id)?.template;
  }

  getByType(type: HtmlReportType): HtmlReportTemplate[] {
    return Array.from(this.registry.values())
      .filter((entry) => entry.template.type === type)
      .map((entry) => entry.template);
  }

  getAll(): HtmlReportTemplate[] {
    return Array.from(this.registry.values()).map((entry) => entry.template);
  }

  has(id: string): boolean {
    return this.registry.has(id);
  }

  clear(): void {
    this.registry.clear();
  }

  getSections(id: string): HtmlReportSectionConfig[] {
    const template = this.get(id);
    return template?.sections ?? [];
  }
}

export const ReportRegistry = new ReportRegistryClass();
