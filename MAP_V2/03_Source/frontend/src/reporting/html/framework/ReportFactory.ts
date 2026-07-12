import type {
  HtmlReportConfig,
  HtmlReportDefinition,
  HtmlReportType,
  HtmlReportSectionConfig,
  HtmlReportMetadata,
} from '../shared/ReportTypes';
import { ReportRegistry } from './ReportRegistry';

export class ReportFactory {
  static create(templateId: string, overrides?: Partial<HtmlReportConfig>): HtmlReportConfig {
    const template = ReportRegistry.get(templateId);
    if (!template) {
      throw new Error(`Report template not found: ${templateId}`);
    }

    return {
      id: overrides?.id ?? `${template.id}-${Date.now()}`,
      name: overrides?.name ?? template.name,
      type: overrides?.type ?? template.type,
      format: overrides?.format ?? 'html',
      classification: overrides?.classification ?? 'internal',
      description: overrides?.description ?? template.description,
      author: overrides?.author ?? 'MAP Nexus',
      version: overrides?.version ?? '1.0',
      sections: overrides?.sections ?? template.sections,
      metadata: overrides?.metadata,
    };
  }

  static createDefinition(config: HtmlReportConfig): HtmlReportDefinition {
    return {
      id: config.id,
      name: config.name,
      type: config.type,
      format: config.format,
      classification: config.classification,
      description: config.description,
      author: config.author,
      version: config.version,
      status: 'draft',
      sections: config.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static createMetadata(config: HtmlReportConfig): HtmlReportMetadata {
    return {
      id: config.id,
      name: config.name,
      type: config.type,
      description: config.description,
      version: config.version,
      author: config.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      classification: config.classification,
      status: 'completed',
    };
  }

  static getSectionsByType(
    sections: HtmlReportSectionConfig[],
    type: HtmlReportSectionConfig['type']
  ): HtmlReportSectionConfig[] {
    return sections.filter((s) => s.type === type);
  }

  static getVisibleSections(sections: HtmlReportSectionConfig[]): HtmlReportSectionConfig[] {
    return sections.filter((s) => s.visible !== false);
  }

  static sortSectionsByOrder(sections: HtmlReportSectionConfig[]): HtmlReportSectionConfig[] {
    return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  static createFromType(type: HtmlReportType, overrides?: Partial<HtmlReportConfig>): HtmlReportConfig {
    const templates = ReportRegistry.getByType(type);
    if (templates.length === 0) {
      throw new Error(`No templates found for type: ${type}`);
    }
    return this.create(templates[0].id, overrides);
  }
}
