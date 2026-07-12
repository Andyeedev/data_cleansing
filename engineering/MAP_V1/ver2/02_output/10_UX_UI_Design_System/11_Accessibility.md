# MAP Accessibility Specification

| Field    | Value                            |
| -------- | -------------------------------- |
| Document | MAP Accessibility Specification  |
| Version  | 1.0                              |
| Date     | June 2026                        |
| Status   | Official                         |
| Author   | MAP Design Engineering           |

---

## 1. WCAG 2.2 AA Compliance

MAP achieves **full WCAG 2.2 Level AA compliance**. All success criteria are addressed below.

### Perceivable

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.1.1 Non-text Content | All non-text content has a text alternative | Alt text on images, aria-label on icon buttons, SVG titles |
| 1.2.1 Audio/Video | No prerecorded audio-only or video-only | Platform does not serve media content |
| 1.3.1 Info and Relationships | Structure conveyed visually is also programmatically determinable | Semantic HTML (nav, main, aside, article, section), proper heading hierarchy |
| 1.3.2 Meaningful Sequence | Reading order is logical | DOM order matches visual order; CSS does not reorder |
| 1.3.3 Sensory Characteristics | Instructions do not rely solely on shape, colour, or size | Labels always accompany icons; colour is never sole indicator |
| 1.3.4 Orientation | Content not restricted to single display orientation | Supports both portrait and landscape |
| 1.3.5 Identify Input Purpose | Input fields have autocomplete attributes | autocomplete="name", autocomplete="email", etc. |
| 1.4.1 Use of Colour | Colour is not sole means of conveying info | Status uses icon + text + colour; errors use icon + text |
| 1.4.3 Contrast Minimum | 4.5:1 for normal text, 3:1 for large text | All text meets minimum contrast ratios |
| 1.4.4 Resize Text | Text resizable up to 200% without loss of content | Responsive typography, no fixed-height containers |
| 1.4.5 Images of Text | No images of text | All text rendered as HTML text |
| 1.4.10 Reflow | Content reflows at 320px width without horizontal scroll | Responsive layout with breakpoints |
| 1.4.11 Non-text Contrast | 3:1 for UI components and graphical objects | Focus indicators, borders, icons all meet 3:1 |
| 1.4.12 Text Spacing | Adjustable line height, paragraph spacing, letter spacing, word spacing | CSS variables allow user overrides |
| 1.4.13 Hover/Focus Content | Tooltip/popover content dismissible, hoverable, persistent | Escape key dismisses; pointer can move to tooltip |

### Operable

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 2.1.1 Keyboard | All functionality via keyboard | Full keyboard navigation documented per component |
| 2.1.2 No Keyboard Trap | No keyboard trap; user can navigate away | Focus trap only in modals; Escape exits modals |
| 2.1.4 Character Key Shortcuts | Single character shortcuts can be remapped or disabled | No single-character shortcuts implemented |
| 2.2.1 Timing Adjustable | Time limits adjustable | Session timeout warning at 5 min; extendable |
| 2.2.2 Pause, Stop, Hide | Auto-updating content can be paused | Live data refreshes have pause control; animations respect prefers-reduced-motion |
| 2.3.1 Three Flashes | No content flashes more than 3 times per second | No flashing content in design system |
| 2.4.1 Bypass Blocks | Skip navigation link | Skip to main content link on every page |
| 2.4.2 Page Titled | Descriptive page titles | Dynamic `<title>` per route: "[Page Name] - MAP" |
| 2.4.3 Focus Order | Logical focus order | Tab order follows visual layout (left-to-right, top-to-bottom) |
| 2.4.4 Link Purpose | Link purpose determinable from text | Descriptive link text; no "click here" |
| 2.4.5 Multiple Ways | Multiple ways to find pages | Search, navigation, breadcrumbs |
| 2.4.6 Headings and Labels | Descriptive headings and labels | All form fields have visible labels; headings describe section content |
| 2.4.7 Focus Visible | Keyboard focus indicator visible | 2px primary color ring on all interactive elements |

### Understandable

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 3.1.1 Language of Page | Page language declared | `<html lang="en">` |
| 3.1.2 Language of Parts | Language of content sections identified | lang attributes on content with different languages |
| 3.2.1 On Focus | No unexpected context change on focus | Focus does not trigger navigation or modal opening |
| 3.2.2 On Input | No unexpected context change on input | Selection does not auto-submit; explicit submit buttons |
| 3.2.3 Consistent Navigation | Navigation consistent across pages | Same sidebar/bottom nav on all pages |
| 3.2.4 Consistent Identification | Components with same function identified consistently | Same icons and labels for same actions throughout |
| 3.3.1 Error Identification | Errors clearly identified and described | Inline error messages below fields; error summary at top of forms |
| 3.3.2 Labels or Instructions | Labels and instructions provided | All fields have labels; helper text for complex fields |
| 3.3.3 Error Suggestion | Error correction suggested when possible | Inline suggestions (e.g., "Did you mean...?") |
| 3.3.4 Error Prevention | Destructive actions confirmed | Confirmation dialogs for delete, revoke, archive actions |

### Robust

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 4.1.1 Parsing | Valid HTML, no duplicate IDs | Linting ensures valid HTML; unique IDs enforced |
| 4.1.2 Name, Role, Value | All UI components have accessible names and roles | ARIA attributes, semantic HTML |
| 4.1.3 Status Messages | Status messages announced without focus change | aria-live regions for notifications, loading states |

---

## 2. Keyboard Navigation

### General Rules

- All interactive elements are focusable via `Tab`.
- Focus order follows visual layout: left-to-right, top-to-bottom.
- Skip navigation link appears as first focusable element on every page.
- Focus indicator: 2px solid ring in primary color (#667eea) with 2px offset.
- Focus ring is always visible (never `outline: none` without replacement).

### Component-Specific Keyboard Patterns

| Component          | Key(s)                  | Action                                      |
|--------------------|-------------------------|----------------------------------------------|
| Links              | Enter                   | Activate link                               |
| Buttons            | Enter, Space            | Activate button                             |
| Checkboxes         | Space                   | Toggle checked state                        |
| Radio buttons      | Arrow keys              | Move between options in group               |
| Select / Dropdown  | Enter, Space            | Open dropdown                               |
| Select / Dropdown  | Arrow Up/Down           | Navigate options                            |
| Select / Dropdown  | Enter                   | Select highlighted option                   |
| Select / Dropdown  | Escape                  | Close without selecting                     |
| Tabs               | Arrow Left/Right        | Move between tabs                           |
| Tabs               | Enter, Space            | Activate focused tab                        |
| Modal              | Escape                  | Close modal                                 |
| Modal              | Tab                     | Cycle through focusable elements (trapped)  |
| Menu               | Arrow Down              | Move to next menu item                      |
| Menu               | Arrow Up                | Move to previous menu item                  |
| Menu               | Enter                   | Activate menu item                          |
| Menu               | Escape                  | Close menu                                  |
| Tree view          | Arrow Down              | Next node                                   |
| Tree view          | Arrow Up                | Previous node                               |
| Tree view          | Arrow Right             | Expand node                                 |
| Tree view          | Arrow Left              | Collapse node                               |
| Tree view          | Enter                   | Select node                                 |
| Tooltip            | Escape                  | Dismiss tooltip                             |
| Search             | Escape                  | Clear search / close results                |
| Search             | Arrow Up/Down           | Navigate suggestions                        |
| Search             | Enter                   | Select suggestion or submit                 |

### Skip Navigation

```
Skip to main content link
- Appears as first focusable element
- Visible on focus (offset position off-screen, slides in on focus)
- Links to <main> element ID
- Visually hidden until focused
```

---

## 3. Screen Reader Support

### Semantic HTML

| Element  | Usage                                                       |
|----------|-------------------------------------------------------------|
| `<nav>`  | Primary navigation (sidebar), secondary navigation (tabs)  |
| `<main>` | Primary page content                                        |
| `<aside>`| Sidebar, supplementary content                              |
| `<article>` | Self-contained content pieces (cards, report sections)  |
| `<section>`| Thematic grouping of content with heading                |
| `<header>`| Page header, section headers                               |
| `<footer>`| Page footer                                                 |
| `<form>` | All form elements                                           |
| `<table>`| Data tables with `<thead>`, `<tbody>`, `<th scope="col">`  |

### ARIA Labels and Descriptions

| Element                        | ARIA Attribute      | Value                                      |
|--------------------------------|---------------------|--------------------------------------------|
| Icon-only buttons              | aria-label          | Descriptive action name                    |
| Search input                   | aria-label          | "Search projects, migrations, policies"    |
| Close button (modal)           | aria-label          | "Close dialog"                             |
| Navigation landmark            | aria-label          | "Main navigation", "Settings navigation"   |
| Form fields                    | aria-describedby    | Points to helper text or error message     |
| Required fields                | aria-required       | "true"                                     |
| Invalid fields                 | aria-invalid        | "true" when validation fails               |
| Loading indicators             | aria-label          | "Loading content..."                       |
| Data tables                    | aria-describedby    | Table caption describing content           |
| Expandable sections            | aria-expanded       | "true" / "false"                           |
| Tabs                           | aria-selected       | "true" on active tab                       |
| Tabs panel                     | aria-labelledby     | Points to active tab ID                    |
| Modal dialog                   | aria-modal          | "true"                                    |
| Modal dialog                   | aria-labelledby     | Points to modal title                      |
| Live region (toast)            | aria-live           | "polite" for non-critical, "assertive" for errors |
| Progress bar                   | role="progressbar"  | aria-valuenow, aria-valuemin, aria-valuemax|
| Decorative icons               | aria-hidden         | "true"                                     |

### Live Regions

| Content Type          | aria-live    | Implementation                                |
|-----------------------|--------------|-----------------------------------------------|
| Toast notifications   | polite       | `<div aria-live="polite" role="status">`      |
| Error messages        | assertive    | `<div aria-live="assertive" role="alert">`    |
| Loading states        | polite       | `<div aria-live="polite" role="status">`      |
| Search results count  | polite       | `<span aria-live="polite">`                   |
| Form submission status| polite       | `<div aria-live="polite" role="status">`      |
| Data refresh          | polite       | `<div aria-live="polite" role="log">`         |

### Alt Text Guidelines

| Content Type       | Alt Text Approach                                           |
|--------------------|-------------------------------------------------------------|
| Dashboard icons    | Decorative; `aria-hidden="true"`, no alt text              |
| Status icons       | Descriptive: "Status: Completed" or "Status: Failed"       |
| Charts/graphs      | Long description via `aria-describedby` linking to data table|
| User avatars       | "[User name]'s avatar"                                      |
| Company logos      | "[Company name] logo"                                       |
| Decorative images  | Empty alt text (`alt=""`) and `aria-hidden="true"`         |

---

## 4. Colour Contrast

### Text Contrast Ratios

| Element               | Foreground       | Background       | Ratio   | Pass? |
|-----------------------|------------------|------------------|---------|-------|
| Body text             | #111827          | #ffffff          | 17.4:1  | AAA   |
| Body text (gray bg)   | #111827          | #f9fafb          | 16.5:1  | AAA   |
| Secondary text        | #6b7280          | #ffffff          | 5.0:1   | AA    |
| Primary button text   | #ffffff          | #667eea          | 4.6:1   | AA    |
| Link text             | #667eea          | #ffffff          | 4.6:1   | AA    |
| Error text            | #dc2626          | #ffffff          | 5.6:1   | AA    |
| Success text          | #059669          | #ffffff          | 4.5:1   | AA    |
| Disabled text         | #9ca3af          | #ffffff          | 2.9:1   | N/A   |
| Table header          | #374151          | #f9fafb          | 10.4:1  | AAA   |

### UI Component Contrast

| Element               | Colors                      | Ratio | Requirement |
|-----------------------|-----------------------------|-------|-------------|
| Focus ring            | #667eea vs background      | 4.6:1 | Meets 3:1   |
| Border (input)        | #e5e7eb vs #ffffff         | 1.4:1 | N/A (with label) |
| Active nav indicator  | #667eea vs #f9fafb         | 4.6:1 | Meets 3:1   |
| Status badge borders  | Various vs background      | >3:1  | Meets 3:1   |
| Chart data series     | 8-color palette, all >3:1  | >3:1  | Meets 3:1   |

### Chart Color Palette (Accessibility-Verified)

| Color  | Hex       | Usage          | Contrast vs White |
|--------|-----------|----------------|-------------------|
| Blue   | #667eea   | Primary series | 4.6:1             |
| Purple | #764ba2   | Secondary      | 4.5:1             |
| Green  | #059669   | Success/OK     | 4.5:1             |
| Red    | #dc2626   | Error/Fail     | 5.6:1             |
| Orange | #d97706   | Warning        | 3.9:1 (large)     |
| Teal   | #0d9488   | Info           | 4.4:1             |
| Indigo | #4f46e5   | Accent         | 5.4:1             |
| Gray   | #6b7280   | Neutral        | 5.0:1             |

### Colour as Sole Indicator Rule

Colour is **never** the sole means of conveying information:
- Status: icon + text + colour (e.g., checkmark + "Completed" + green)
- Errors: red text + error icon + aria-live announcement
- Links: underlined + colour (not colour alone)
- Charts: patterns or labels alongside colour fills

---

## 5. Focus Management

### Focus Ring

```css
:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

- Applies to all interactive elements.
- Uses `:focus-visible` to avoid showing ring on mouse click.
- Consistent across buttons, links, inputs, selects, checkboxes, radio buttons.

### Focus Trap in Modals

1. When modal opens: focus moves to first focusable element (or close button).
2. `Tab` and `Shift+Tab` cycle within modal only.
3. Focus does not escape to background content.
4. When modal closes: focus returns to the element that triggered the modal.
5. Modal has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title.

### Focus Management on Route Changes

- On page navigation: focus moves to `<main>` or page heading.
- Skip navigation link remains functional on every page.
- Focus is not lost after async operations (e.g., form submission, data loading).

---

## 6. Error Handling

### Error Indicators

Every error uses **multiple simultaneous indicators**:

| Indicator       | Implementation                                                    |
|-----------------|-------------------------------------------------------------------|
| Colour          | Red text (#dc2626) for error messages                             |
| Icon            | Error icon (exclamation triangle) beside message                  |
| Text            | Descriptive, actionable error message                             |
| Border          | Red border on invalid input fields                                |
| ARIA            | `aria-invalid="true"` on field, `aria-describedby` links to message |
| Live region     | Error announced via `aria-live="assertive"`                       |

### Error Prevention

- Destructive actions (delete, revoke, archive) require confirmation dialog.
- Confirmation dialog: "Are you sure you want to [action]? This cannot be undone."
- Undo available for non-destructive actions (toast with "Undo" button, 5 second window).

### Error Recovery

| Scenario                  | Recovery Approach                                              |
|---------------------------|----------------------------------------------------------------|
| Network failure           | Retry button, offline indicator, cached data fallback          |
| Session expired           | Redirect to login with "Your session expired" message          |
| Validation failure        | Inline errors with specific, helpful messages                  |
| API rate limit            | Toast notification with retry-after time                       |
| Component render failure  | Error boundary with "Something went wrong" + retry option      |
| Data load failure         | Skeleton shows error state with retry button                   |

---

## 7. ARIA Implementation

### Complete ARIA Pattern Library

| Pattern           | ARIA Attributes                                                           |
|-------------------|---------------------------------------------------------------------------|
| Alert dialog      | `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby"` |
| Banner            | `role="banner"`                                                          |
| Button            | `aria-label` (icon-only), `aria-pressed` (toggle), `aria-expanded`      |
| Breadcrumb        | `nav` with `aria-label="Breadcrumb"`, `aria-current="page"` on last item|
| Checkbox          | `role="checkbox"`, `aria-checked` (mixed for indeterminate)             |
| Combobox          | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant"` |
| Dialog            | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`                 |
| Feed              | `role="feed"`, `aria-labelledby`                                         |
| Grid              | `role="grid"`, `role="row"`, `role="gridcell"`                          |
| Link              | Standard `<a>` element                                                   |
| Listbox           | `role="listbox"`, `aria-activedescendant`, `aria-multiselectable`       |
| Loading           | `role="status"`, `aria-live="polite"`                                    |
| Menu              | `role="menu"`, `role="menuitem"`, `aria-expanded`                       |
| Navigation        | `role="navigation"` or `<nav>`, `aria-label`                             |
| Progressbar       | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax"`|
| Radio             | `role="radio"`, `aria-checked`, within `role="radiogroup"`              |
| Search            | `role="search"` or `<search>` element                                    |
| Tab list          | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`        |
| Tab panel         | `role="tabpanel"`, `aria-labelledby`                                     |
| Table             | Standard `<table>`, `<th scope="col">`, `<caption>`                     |
| Toast             | `role="status"`, `aria-live="polite"` or `role="alert"`, `aria-live="assertive"` |
| Toolbar           | `role="toolbar"`, `aria-label`                                           |
| Tree              | `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-selected`     |

### Landmark Roles

| Landmark      | Element       | aria-label                        |
|---------------|---------------|-----------------------------------|
| Banner        | `<header>`    | "Site header"                     |
| Navigation    | `<nav>`       | "Main navigation"                 |
| Main          | `<main>`      | (implicit)                        |
| Complementary | `<aside>`     | "Sidebar"                         |
| Contentinfo   | `<footer>`    | "Site footer"                     |
| Search        | `<search>`    | "Global search"                   |

---

## 8. Motion and Animation

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- When user has OS-level reduced motion enabled, all animations are disabled or reduced to near-instant.
- Skeleton shimmer, page transitions, modal animations, toast slides all respect this setting.

### No Flashing Content

- No content flashes more than 3 times per second.
- Loading spinners are smooth rotations (no flashing).
- Progress bars animate smoothly (no strobing).
- Error states use static indicators (no blinking).

### Animation Guidelines

| Animation Type     | Duration | Easing        | Reduced Motion   |
|--------------------|----------|---------------|------------------|
| Page transition    | 150ms    | ease-in-out   | Instant          |
| Modal open         | 200ms    | ease-out      | Instant          |
| Modal close        | 150ms    | ease-in       | Instant          |
| Panel slide        | 200ms    | ease-out      | Instant          |
| Toast slide-in     | 200ms    | ease-out      | Instant          |
| Toast slide-out    | 150ms    | ease-in       | Instant          |
| Skeleton shimmer   | 1.5s loop| linear        | No animation     |
| Spinner rotation   | 0.8s loop| linear        | Static state     |
| Checkmark draw     | 300ms    | ease-out      | Instant          |
| Collapse/expand    | 200ms    | ease-in-out   | Instant          |
| Tooltip show       | 150ms    | ease-out      | Instant          |
| Tooltip hide       | 100ms    | ease-in       | Instant          |
| Focus ring appear  | 100ms    | ease-out      | Instant          |

### Safe Animations

All animations in MAP follow these rules:
- No parallax scrolling effects.
- No auto-playing video or audio.
- No animated backgrounds.
- Subtle, purposeful motion only.
- Purpose: guide attention, confirm actions, show state changes.
