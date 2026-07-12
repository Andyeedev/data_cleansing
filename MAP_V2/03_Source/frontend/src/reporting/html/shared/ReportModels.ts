import type {
  HtmlReportDefinition,
  HtmlReportMetadata,
} from './ReportTypes';

export interface HtmlReportSectionData {
  sectionId: string;
  sectionType: string;
  title: string;
  data: Record<string, unknown>;
  visible: boolean;
}

export interface HtmlReportOutput {
  id: string;
  definition: HtmlReportDefinition;
  sections: HtmlReportSectionData[];
  html: string;
  generatedAt: string;
  metadata: HtmlReportMetadata;
}
