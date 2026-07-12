# MAP MVP Prototype Recommendations

| Field | Value |
|-------|-------|
| **Document** | MAP MVP Prototype Recommendations |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Status** | Official |

---

## 1. Figma (Recommended for Design)

### Why Figma

- Industry standard for UI/UX design with widespread adoption across enterprise teams
- Real-time collaboration enables distributed teams to work simultaneously
- Extensive plugin ecosystem for automation, accessibility checks, and design tokens
- Built-in dev handoff with Inspect mode, CSS extraction, and asset export
- Component variants and auto-layout reduce design debt and ensure consistency

### Setup

- Create a **Team Workspace** for MAP with role-based access (Designers, Developers, Stakeholders)
- Build a **MAP Design System Library** as a shared Figma library linked across all project files
- Define **Component Variants** for every state: default, hover, active, disabled, error, loading
- Use **Auto Layout** extensively for responsive behavior and consistent spacing
- Leverage **Design Tokens** via Figma Variables for colors, typography, spacing, and shadows

### File Structure

```
MAP Design System (Figma)
├── Foundations/
│   ├── Colors & Gradients
│   ├── Typography Scale
│   ├── Spacing & Grid
│   ├── Iconography
│   └── Elevation & Shadows
├── Components/
│   ├── Primitives (Button, Input, Badge, Toggle)
│   ├── Composite (Card, DataTable, Sidebar)
│   ├── Navigation (Tabs, Breadcrumbs, Pagination)
│   └── Feedback (Toast, Modal, Alert, Progress)
├── Screens/
│   ├── Dashboard
│   ├── Projects
│   ├── Discovery
│   ├── Validation
│   ├── Reports
│   ├── Governance
│   └── Admin
└── Prototypes/
    ├── Onboarding Flow
    ├── Migration Workflow
    └── Report Generation
```

### Dev Handoff

- Enable **Inspect Mode** for developers to extract CSS, spacing, and dimensions directly
- Use **CSS Extraction** for Tailwind-compatible class generation
- Export assets as SVG (icons), PNG (illustrations), and optimized formats
- Maintain a **redline documentation** layer for complex interactions and animations
- Sync Figma tokens to code via **Token Studio** plugin or manual JSON export

### Cost

- **Professional Plan**: $12/editor/month
- Free viewer accounts for stakeholders and QA
- Organization plan available if scaling beyond 10 editors

---

## 2. Penpot (Open-Source Alternative)

### Why Penpot

- 100% free and open-source under MPL 2.0
- Self-hostable for air-gapped or regulated environments
- Open standards (SVG-native) ensure no vendor lock-in
- Growing community with active development

### Setup

- **Docker Deployment** for internal infrastructure: `docker-compose up -d penpot`
- **Cloud Hosted** option available at penpot.app for rapid prototyping
- Import existing Figma files via SVG export/import workflow
- Create component libraries using Penpot's built-in component system

### Limitations

- Smaller plugin ecosystem compared to Figma
- Fewer enterprise collaboration features (no real-time multi-cursor editing)
- Limited third-party integrations (no native Jira, Slack, or GitHub sync)
- Community components and templates are less mature
- No built-in version history or branching

---

## 3. Storybook (Recommended for Component Documentation)

### Why Storybook

- Isolates components from the application for focused development and testing
- Generates living documentation that stays in sync with code
- Supports interaction testing, visual regression testing, and accessibility auditing
- Acts as a single source of truth for the component API
- Free and open-source with a large ecosystem of addons

### Setup

- Initialize with React + TypeScript: `npx storybook@latest init`
- Enable **Controls** addon for interactive prop manipulation
- Enable **Actions** addon for event logging and callback verification
- Enable **Docs** addon for automatic documentation generation
- Configure **a11y addon** for accessibility auditing on every story
- Configure **viewport addon** for responsive testing across breakpoints

### Components

Document every MAP component in Storybook:

| Category | Components |
|----------|------------|
| Primitives | Button, Input, Select, Checkbox, Radio, Toggle, Badge |
| Layout | Sidebar, Header, Container, Grid, Stack |
| Data | DataTable, ChartCard, StatusIndicator, MetricTile |
| Feedback | Toast, Alert, Modal, Progress, Skeleton |
| Navigation | Tabs, Breadcrumbs, Pagination, Stepper |
| Forms | FormField, FormGroup, ValidationMessage |

### Stories

Each component must include stories for:

- **Default state** with minimal props
- **All variants** (size, color, shape)
- **All states** (default, hover, active, disabled, loading, error)
- **Interactive examples** with Controls for prop experimentation
- **Composition examples** showing the component in realistic layouts
- **Edge cases** (empty states, long text, many items)

### Cost

- **Free** (open-source)
- Optional: Chromatic ($149/month) for visual regression testing and hosted Storybook

---

## 4. Component Documentation

### Documentation Structure

Each component must have the following documentation:

| Section | Description |
|---------|-------------|
| **Description** | What the component does, when to use it, and when not to use it |
| **Props Table** | All props with name, type, default value, required flag, and description |
| **Usage Examples** | Code snippets showing common usage patterns |
| **Do / Don't** | Visual examples of correct and incorrect usage |
| **Accessibility** | ARIA attributes, keyboard navigation, screen reader behavior |
| **Variants** | All visual and functional variants with descriptions |

### Visual Testing

- Use **Chromatic** for automated visual regression testing on every pull request
- Baseline screenshots captured on main branch
- Diffs reviewed in Chromatic's UI before merging
- Integration with CI/CD pipeline via GitHub Actions

### Accessibility Testing

- **addon-a11y** for automated accessibility checks in Storybook
- WCAG 2.1 AA compliance as the minimum standard
- Keyboard navigation testing for all interactive components
- Screen reader compatibility testing (NVDA, VoiceOver, JAWS)

---

## 5. Interactive Prototypes

### Click-Through Prototypes

- Build high-fidelity click-through prototypes in Figma for all key user journeys
- Use Figma's **Prototype** mode with smart animate transitions
- Map hotspot connections between screens for realistic navigation flow
- Include micro-interactions: hover states, loading transitions, success confirmations

### Key User Journeys

| Journey | Screens |
|---------|---------|
| **Onboarding** | Welcome → Workspace Setup → First Project → First Migration |
| **Discovery** | Select Source → Scan → Review Results → Export Report |
| **Validation** | Configure Rules → Run Validation → Review Findings → Generate Report |
| **Governance** | Review Policies → Approve/Reject → Audit Trail → Compliance Report |
| **Administration** | User Management → Role Assignment → Settings → API Keys |

### Stakeholder Review

- Schedule **prototype review sessions** with key stakeholders before development
- Record feedback directly in Figma comments with timestamps
- Iterate on prototype based on feedback before any code is written
- Sign-off on final prototype as the development reference

---

## 6. Design-to-Code Workflow

### Token Synchronization

```
Figma Design Tokens (Variables)
        ↓
Token Studio Plugin (JSON Export)
        ↓
tailwind.config.ts (Custom Theme)
        ↓
CSS Variables (Runtime)
```

### Component Export Pipeline

```
Figma Components
        ↓
Design Specification (Inspect Mode)
        ↓
React Component Reference (Props, States, Layout)
        ↓
Implementation in React + TypeScript + Tailwind
```

### Asset Export

- **Icons**: Export as optimized SVG, convert to React components via SVGR
- **Illustrations**: Export as SVG or PNG (for complex gradients)
- **Logos**: Export in SVG with multiple color variants (light, dark, mono)
- Store exported assets in `src/assets/` with consistent naming conventions

### Workflow Summary

| Step | Tool | Output |
|------|------|--------|
| Design | Figma | Visual designs and component specs |
| Token Export | Token Studio | JSON design tokens |
| Theme Config | Tailwind | `tailwind.config.ts` |
| Component Build | React + TypeScript | Reusable component library |
| Documentation | Storybook | Living component docs |
| Visual Testing | Chromatic | Regression test reports |
| Accessibility | addon-a11y | Compliance audit results |
