# MAP MVP UX Design Principles

| Field    | Value                          |
| -------- | ------------------------------ |
| Document | MAP MVP UX Design Principles   |
| Version  | 1.0                            |
| Date     | June 2026                      |
| Status   | Official                       |

---

## 1. Design Philosophy

MAP is an enterprise-grade SaaS platform for cloud migration validation. The UI is built on three pillars:

- **Enterprise-first.** Designed for IT professionals, migration engineers, and compliance officers who operate under strict governance. Trust, reliability, and professional credibility are non-negotiable.
- **Task-oriented.** Every screen serves a specific job. Users arrive with intent — discover resources, run validations, review findings, generate reports. The interface removes friction between intent and outcome.
- **Minimal chrome, maximum data density.** UI decoration is kept to an absolute minimum. Surface area is reserved for data, controls, and actionable content. Every pixel must earn its place.

The visual language draws from Microsoft Fluent, Azure Portal, GitHub, and Atlassian — proven patterns in enterprise tooling. The result is an interface that feels familiar, fast, and trustworthy from the first interaction.

---

## 2. Core Principles

### 2.1 Clarity Over Cleverness

Every label, control, and layout must communicate its purpose without ambiguity. Avoid jargon unless it is standard terminology for the target user. Prefer plain language. If a user has to pause and interpret a UI element, the design has failed.

- Use descriptive labels over icon-only controls
- Show status explicitly — never assume the user infers state
- Default to the most obvious interpretation

### 2.2 Content Over Chrome

The interface exists to present data and enable actions. Decorative elements — gradients, shadows, decorative illustrations — are eliminated unless they serve a functional purpose.

- Allocate screen real estate to data tables, charts, and controls
- Use whitespace for separation, not decoration
- Avoid decorative imagery that adds no informational value

### 2.3 Consistency Over Novelty

Predictable patterns reduce cognitive load. When a user learns how one screen works, that knowledge transfers to every other screen. Never introduce a novel pattern when an established one suffices.

- Reuse component patterns across the application
- Maintain uniform spacing, typography, and color usage
- Apply the same interaction model for equivalent actions

### 2.4 Efficiency Over Expressiveness

Speed of task completion is the primary metric. Every additional click, animation, or transition must be justified by a measurable efficiency gain.

- Surface primary actions prominently
- Minimize navigation depth for common workflows
- Support keyboard shortcuts for power users

### 2.5 Feedback Over Silence

Every user action must produce a visible, immediate response. Systems that appear unresponsive erode trust.

- Show loading states for operations exceeding 300ms
- Confirm destructive actions before execution
- Display success, warning, and error states consistently
- Provide inline validation on form fields

### 2.6 Accessibility as Foundation

Accessibility is not a feature layered on top — it is a foundational constraint that shapes every design decision. The platform must be usable by all users regardless of ability.

- All interactive elements must be keyboard-accessible
- Color is never the sole indicator of state or meaning
- Text alternatives accompany all non-text content
- Focus order must be logical and visible

---

## 3. Accessibility

MAP targets **WCAG 2.2 Level AA** compliance across all interfaces.

### 3.1 Keyboard-First Design

- Every interactive element is reachable via Tab/Shift+Tab
- Logical focus order follows visual reading order
- Focus indicator is visible with a minimum 2px outline using a high-contrast color
- No keyboard traps exist anywhere in the interface
- Modal dialogs trap focus within the dialog until dismissed

### 3.2 Screen Reader Support

- All images include descriptive alt text or are marked as decorative
- Form inputs have associated `<label>` elements
- Dynamic content updates use ARIA live regions
- Data tables include proper `<th>`, `scope`, and `caption` attributes
- Landmark regions (`<nav>`, `<main>`, `<aside>`) are properly defined

### 3.3 Color and Contrast

- Text-to-background contrast ratio: minimum **4.5:1** for normal text, **3:1** for large text
- Interactive element contrast: minimum **3:1** against adjacent colors
- Status is communicated through color AND iconography OR text
- The UI remains usable in Windows High Contrast Mode

### 3.4 Error Prevention

- Destructive actions require explicit confirmation
- Form submissions are disabled until required fields are valid
- Inline validation messages appear below the relevant field
- Error messages describe the problem and suggest a resolution

---

## 4. Usability Goals

| Goal                     | Target                                      |
| ------------------------ | ------------------------------------------- |
| Common task completion   | ≤ 3 clicks from entry point                 |
| Page load time           | < 2 seconds (LCP)                           |
| Navigation consistency   | Same structure on every page                |
| Onboarding time          | < 15 minutes for first productive session   |
| Training requirement     | Minimal — interface is self-explanatory      |
| Error recovery           | Undo or revert within 2 steps               |
| Information findability  | Global search returns results in < 1 second |

### 4.1 Progressive Disclosure

- Show essential information by default
- Expand details on demand (collapsible sections, drill-down links)
- Never overwhelm the user with all available options simultaneously
- Group advanced settings behind clearly labeled expandable sections

### 4.2 Familiarity

- Leverage patterns from Azure Portal, GitHub, and Atlassian where applicable
- Use standard form controls and table layouts
- Adopt terminology consistent with Azure and cloud migration domains

---

## 5. Consistency Rules

### 5.1 Interaction Consistency

- The same action always produces the same result
- Equivalent actions use identical UI patterns (e.g., all "Create" actions use the same button placement and style)
- Confirmation dialogs follow a uniform structure: title, description, action buttons (Cancel left, Confirm right)

### 5.2 Terminology Consistency

- A term used once is used everywhere — no synonyms for the same concept
- Maintain a project-wide glossary of approved terms
- Button labels use verb-noun format: "Create Project", "Run Validation", "Export Report"

### 5.3 Visual Consistency

- Uniform spacing using a 4px base grid
- Consistent border radius: 6px (small), 8px (medium), 12px (large)
- Type scale is fixed — no arbitrary font sizes
- Color tokens are applied from the approved palette only

### 5.4 Behavioral Consistency

- Tables sort by the same mechanism everywhere
- Filters follow the same placement and interaction model
- Toast notifications appear in the same position with the same animation
- Loading states use the same indicator pattern

---

## 6. Design Heuristics

MAP adheres to Nielsen's usability heuristics, adapted for enterprise SaaS:

| #  | Heuristic                        | MAP Application                                                                 |
| -- | -------------------------------- | ------------------------------------------------------------------------------ |
| 1  | Visibility of system status      | Real-time progress indicators, status badges, loading spinners, pipeline states |
| 2  | Match between system and real world | Use Azure and cloud migration terminology familiar to the target audience      |
| 3  | User control and freedom         | Undo/redo support, back navigation, cancel operations, draft saving            |
| 4  | Consistency and standards        | Reuse Fluent-inspired components, follow platform conventions                  |
| 5  | Error prevention                 | Destructive action confirmations, input validation, guarded defaults           |
| 6  | Recognition over recall          | Persistent navigation, recent items, contextual suggestions                    |
| 7  | Flexibility and efficiency       | Keyboard shortcuts, bulk actions, customizable dashboards                      |
| 8  | Aesthetic and minimalist design  | No decorative elements, clean data presentation, purposeful whitespace         |
| 9  | Help users recognize errors      | Inline validation, descriptive error messages, suggested fixes                 |
| 10 | Help and documentation           | Contextual help tooltips, inline documentation links, searchable help center   |

---

*End of document.*
