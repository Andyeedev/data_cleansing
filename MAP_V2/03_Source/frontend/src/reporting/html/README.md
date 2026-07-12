# HTML Reporting Framework

Enterprise HTML Reporting Framework for MAP Nexus™.

## Architecture

```
Report Definition → Template → Sections → Widgets → Renderer → HTML Output
```

Every report is metadata-driven and inherits the same layout, styling, and rendering engine.

## Folder Structure

```
src/reporting/html/
├── framework/          # Core framework components
│   ├── HtmlReport.tsx          # Top-level report component
│   ├── ReportLayout.tsx        # Page layout
│   ├── ReportHeader.tsx        # Report header
│   ├── ReportFooter.tsx        # Report footer
│   ├── ReportSection.tsx       # Section wrapper
│   ├── ReportNavigation.tsx    # In-report TOC
│   ├── ReportRenderer.tsx      # Assembles and renders
│   ├── ReportFactory.ts        # Creates reports from metadata
│   ├── ReportRegistry.ts       # Template registry
│   └── ReportContext.tsx       # React context
├── components/         # Reusable report sections
│   ├── CoverPage.tsx
│   ├── ExecutiveSummary.tsx
│   ├── TableOfContents.tsx
│   ├── KPISection.tsx
│   ├── ChartSection.tsx
│   ├── TableSection.tsx
│   ├── RiskSection.tsx
│   ├── RecommendationSection.tsx
│   ├── AppendixSection.tsx
│   ├── AuditTrailSection.tsx
│   └── EvidenceSection.tsx
├── templates/          # Report templates
│   ├── ExecutiveTemplate.tsx
│   ├── MigrationTemplate.tsx
│   ├── ValidationTemplate.tsx
│   ├── GovernanceTemplate.tsx
│   ├── RiskTemplate.tsx
│   ├── SecurityTemplate.tsx
│   └── AdministrationTemplate.tsx
└── shared/             # Types and models
    ├── ReportTypes.ts
    ├── ReportModels.ts
    └── ReportTheme.ts
```

## Usage

### Basic Report

```tsx
import { HtmlReport } from './reporting/html/framework/HtmlReport';
import { ReportRegistry } from './reporting/html/framework/ReportRegistry';

// Import templates to register them
import './reporting/html/templates/ExecutiveTemplate';

const config = ReportFactory.create('executive-report', {
  name: 'Q4 2026 Executive Report',
  author: 'John Smith',
});

const sectionData = {
  'kpi-metrics': {
    kpis: [
      { id: '1', label: 'Revenue', value: '$1.2M', delta: { value: 12, direction: 'up', percentage: 12 } },
    ],
  },
};

<HtmlReport config={config} sectionData={sectionData} />
```

### Using the Factory

```tsx
import { ReportFactory } from './reporting/html/framework/ReportFactory';

// Create from template
const config = ReportFactory.create('migration-report');

// Create from type
const config = ReportFactory.createFromType('executive');

// Create with overrides
const config = ReportFactory.create('risk-report', {
  name: 'Custom Risk Report',
  classification: 'confidential',
});
```

### Custom Templates

```tsx
import { ReportRegistry } from './reporting/html/framework/ReportRegistry';

ReportRegistry.register({
  id: 'custom-report',
  name: 'Custom Report',
  type: 'executive',
  description: 'A custom report template',
  sections: [
    { id: 'cover', type: 'cover', title: 'Cover', order: 0 },
    { id: 'summary', type: 'summary', title: 'Summary', order: 1 },
  ],
  defaultData: {},
});
```

## Widget Integration

Report sections compose existing Widget Framework components:

| Section Component | Widget Used |
|------------------|-------------|
| KPISection | KPIWidget |
| ChartSection | BarChartWidget, LineChartWidget, PieChartWidget, AreaChartWidget |
| TableSection | GridWidget |
| ExecutiveSummary | (standalone) |
| RecommendationSection | (standalone) |
| AuditTrailSection | TimelineWidget |

## Theme Integration

Reports inherit the Theme System from `src/theme/`:

- Tailwind utility classes for styling
- TypeScript imports for programmatic style composition
- Print-optimised styles via ReportTheme.ts

## Report Types

| Type | Template | Description |
|------|----------|-------------|
| executive | ExecutiveTemplate | Executive summary with KPIs and recommendations |
| migration | MigrationTemplate | Migration progress with timeline and risks |
| validation | ValidationTemplate | Validation results with compliance status |
| governance | GovernanceTemplate | Governance compliance with audit trail |
| risk | RiskTemplate | Risk assessment with register and mitigations |
| security | SecurityTemplate | Security posture with threat analysis |
| administration | AdministrationTemplate | Platform administration status |
