# MAP Nexus™ Theme System Report

**Prompt ID:** 002  
**Task:** Create Enterprise Theme System  
**Date:** 2026-07-08  
**Status:** ✓ Complete

---

## Theme Tokens Created

### Colour Tokens (`theme/colours.ts`)

| Palette | Shades | Purpose |
|---------|--------|---------|
| Primary | 50-900 | Azure Blue (#0078d4) |
| Secondary | 50-900 | Cyan (#50e6ff) |
| Success | 50-900 | Green (#107c10) |
| Warning | 50-900 | Amber (#ffb900) |
| Error | 50-900 | Red (#d13438) |
| Information | 50-900 | Cyan (#00b4d8) |
| Neutral | 0-140 | Grey palette |
| Background | Light/Dark | Background colours |
| Text | Primary/Secondary/Link | Text colours |
| Border | Light/Default/Focus | Border colours |
| Dark Mode | Full palette | Dark mode colours |

**Total colour tokens:** 150+

---

### Typography Tokens (`theme/typography.ts`)

| Category | Variants |
|----------|----------|
| Font Family | Primary (Segoe UI), Mono |
| Font Size | xs-5xl (12px-48px) |
| Font Weight | Light-Bold (300-700) |
| Line Height | none-loose (1-2) |
| Letter Spacing | tighter-widest |
| Heading | h1-h6 |
| Subtitle | lg/md/sm |
| Body | lg/md/sm |
| Caption | md/sm |
| Button | lg/md/sm |
| Table | header/body |
| Card | title/subtitle/value |

---

### Spacing Tokens (`theme/spacing.ts`)

| Category | Tokens |
|----------|--------|
| Spacing | 0-96 (0-24rem) |
| Grid | 12 columns, gutter |
| Layout | Header, Sidebar, Footer, Page, Container, Card |

---

### Border Radius (`theme/radius.ts`)

| Token | Value |
|-------|-------|
| none | 0 |
| sm | 0.25rem |
| md | 0.5rem |
| lg | 0.75rem |
| xl | 1rem |
| 2xl | 1.5rem |
| full | 9999px |

**Component-specific:** button, input, card, badge, avatar, dialog

---

### Border Tokens (`theme/borders.ts`)

| Category | Tokens |
|----------|--------|
| Width | 0-8px |
| Style | solid, dashed, dotted, double, none |
| Colour | light, default, strong, focus, primary, success, warning, error |
| Component | input, button, card, table, divider |

---

### Shadow Tokens (`theme/shadows.ts`)

| Token | Description |
|-------|-------------|
| none | No shadow |
| xs | Minimal shadow |
| sm | Small shadow |
| md | Medium shadow |
| lg | Large shadow |
| xl | Extra large shadow |
| 2xl | Double extra large |
| inner | Inset shadow |

**Component shadows:** card, button, input, dropdown, dialog, tooltip, header, sidebar

---

### Icon Tokens (`theme/icons.ts`)

| Category | Icons |
|----------|-------|
| Navigation | home, dashboard, migration, validation, governance, risk, reports, administration, ai, help, settings |
| Action | search, notification, user, menu, close, chevrons, arrows, refresh, download, upload, filter, sort, CRUD |
| Status | success, warning, error, info, check |
| Migration | overview, jobs, history, start, pause, stop |
| Validation | rules, results, queue |
| Governance | policies, compliance, audit |
| Risk | assessment, register, matrix |
| Reports | standard, custom, scheduled |
| AI | assistant, insights, prompts |
| User | profile, users, roles, logout, lock |
| Media | image, video, music, folder, file, archive |
| Weather | sun, moon, cloud, cloudRain |
| Device | wifi, battery |
| Feedback | star, heart, thumbsUp, thumbsDown, flag, bookmark, share |
| View | maximize, minimize, zoomIn, zoomOut, rotate |
| Auth | login, logout, lock, accessDenied |

**Icon sizes:** xs(12), sm(16), md(20), lg(24), xl(32), 2xl(48)

---

### Animation Tokens (`theme/animations.ts`)

| Category | Tokens |
|----------|--------|
| Duration | instant-slowest (0-1000ms) |
| Easing | linear, ease, easeIn, easeOut, easeInOut, bounce |
| Transition | all, colors, opacity, shadow, transform |
| Keyframes | fadeIn, fadeOut, slideIn, spin, pulse, bounce, ping |
| Animation | fadeIn, fadeOut, slideIn, spin, pulse, bounce, ping |

---

### Breakpoint Tokens (`theme/breakpoints.ts`)

| Breakpoint | Value |
|------------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

**Responsive:** mobile, tablet, desktop configurations

---

### Z-Index Tokens (`theme/zindex.ts`)

| Component | Z-Index |
|-----------|---------|
| dropdown | 1000 |
| sticky | 1020 |
| fixed | 1030 |
| backdrop | 1040 |
| modal | 1050 |
| popover | 1060 |
| tooltip | 1070 |
| toast | 1080 |
| header | 1090 |
| sidebar | 1085 |

---

## Component Library

### Buttons (`theme/components/buttons.ts`)

| Variant | Description |
|---------|-------------|
| primary | Azure blue background |
| secondary | White background, blue border |
| ghost | Transparent background |
| danger | Red background |
| success | Green background |
| warning | Amber background |

**Sizes:** sm, md, lg  
**Icon buttons:** sm, md, lg

---

### Cards (`theme/components/cards.ts`)

| Variant | Description |
|---------|-------------|
| default | Standard card with shadow |
| interactive | Hover effect with pointer |
| outlined | Border only |
| elevated | Strong shadow |

**Padding:** sm, md, lg  
**KPI Cards:** Header, value, label, trend, footer

---

### Forms (`theme/components/forms.ts`)

| Element | Styles |
|---------|--------|
| Label | Base, required |
| Input | Base, error, success |
| Textarea | Base |
| Select | Base |
| Checkbox | Base, label |
| Radio | Base, label |
| Switch | Base, active, inactive, toggle |
| Helper | Base, error, success |
| Fieldset | Base, legend |

---

### Tables (`theme/components/tables.ts`)

| Element | Styles |
|---------|--------|
| Container | Border, rounded |
| Header | Background, font, sortable |
| Row | Base, hover, selected, striped |
| Cell | Padding, whitespace |
| Footer | Background |
| Empty | Padding, text |
| Actions | Flex, cell |

---

### Alerts (`theme/components/alerts.ts`)

| Variant | Description |
|---------|-------------|
| info | Blue background |
| success | Green background |
| warning | Amber background |
| error | Red background |

**Badge variants:** default, primary, success, warning, error, information

---

### Dialogs (`theme/components/dialogs.ts`)

| Component | Styles |
|-----------|--------|
| Overlay | Background, transition |
| Container | Position, overflow |
| Position | center, top, bottom |
| Sizes | sm, md, lg, xl, full |
| Header | Base, title, close |
| Body | Padding |
| Footer | Border, flex |

**Panel:** Container, position, header, body, footer

---

## Dashboard Styles

### KPI Cards (`theme/dashboard/kpi.ts`)
- Card base, header, icon, badge, value, label, trend, footer
- Icon backgrounds: primary, secondary, success, warning, error, information

### Trend Cards (`theme/dashboard/trend.ts`)
- Card base, header, value, change, period, chart

### Score Cards (`theme/dashboard/score.ts`)
- Card base, header, score, bar, label, rating
- Rating colours: critical, high, medium, low, minimal

### Progress Indicators (`theme/dashboard/progress.ts`)
- Bar: base, sizes (sm-xl), fill colours
- Circular: base, svg, track, fill, text
- Steps: container, step, circle, line, label

### Risk Styles (`theme/dashboard/risk.ts`)
- Rating: base, colours
- Matrix: container, cell, label
- Indicator: base, dot, label
- Alert: base, colours, icon, content

### Validation Styles (`theme/dashboard/validation.ts`)
- Status: base, colours
- Indicator: base, icon, label
- Card: base, header, progress, stats
- Rule: base, icon, content, status

---

## Build Status

| Check | Result |
|-------|--------|
| TypeScript compilation | ✓ PASS |
| Vite build | ✓ PASS |
| CSS size | 30.42 kB (6.44 kB gzipped) |
| JS size | 275.13 kB (86.80 kB gzipped) |
| Build time | 948ms |

---

## Accessibility Compliance

| Standard | Status |
|----------|--------|
| WCAG AA colours | ✓ Compliant |
| Focus indicators | ✓ Implemented |
| Keyboard navigation | ✓ Scaffolded |
| ARIA-ready | ✓ Structured |
| Semantic HTML | ✓ Used |
| Contrast ratios | ✓ AA compliant |

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| Mobile (<640px) | Single column, stacked layout |
| Tablet (640-1023px) | Two columns, collapsible sidebar |
| Desktop (1024px+) | Full layout, persistent sidebar |

---

## Overall Result

✓ **ENTERPRISE THEME SYSTEM COMPLETE**

All design tokens created, component library defined, dashboard styles implemented, accessibility standards followed.

---

## Ready for Prompt 003

The enterprise theme system has been successfully created.  
You may now proceed to Prompt 003.

---

*Generated by MAP Nexus™ Theme System*
